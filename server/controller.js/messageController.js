import imagekit from "../configs/imagekit.js"
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import axios from "axios"
import openai from "../configs/openai.js"



//api text-based AI chat message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "you don`t have enough credits to use this feature" })
        }

        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({ role: 'user', content: prompt, timestamp: Date.now(), isImage: false })

        const { choices } = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [

                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        //    const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false }
        const reply = {
            role: "assistant",
            content: choices[0].message.content,
            timestamp: Date.now(),
            isImage: false,
        };

        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//image Generation Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    // find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // push user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // encode prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // imagekit AI url
    const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    // generate image
    const aiImageResponse = await axios.get(generateImageUrl, {
      responseType: "arraybuffer",
    });

    // convert to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // upload to imagekit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};