import Chat from "../models/Chat.js"



//Api controller for creating a new chat
export const createChat =async(req,res)=>{
    try{
        const userId=req.user._id

        const chatData={
            userId,
            massages:[],
            name:"new chat",
            userName:req.user.name
        }
        await Chat.create(chatData)
        res.json({success:true, message:"chat created"})
    }catch(error){
        res.json({success:false, error:error.message})
    }
}

//api controller for getting all chat

export const getChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//api controller for deleting a chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({
      _id: chatId,
      userId,
    });

    res.json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};