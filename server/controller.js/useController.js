import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || "secret123gjhghjh",
        { expiresIn: "30d" }
    ); 
};

//API to register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email: email.toLowerCase() });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// export const registerUser = async (req, res, next) => {
//     const { name, email, password } = req.body;

//     try {
//         const userExists = await User.findOne({ email: email.toLowerCase() });

//         if (userExists) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists"
//             });
//         }

//         const user = await User.create({
//             name,
//             email: email.toLowerCase(),
//             password
//         });

//         const token = generateToken(user._id);

//         res.status(201).json({
//             success: true,
//             token
//         });

//     } catch (error) {
//         next(error);   // ⭐ important
//     }
// };



// API to login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = generateToken(user._id);

            return res.json({
                success: true,
                token
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to get user data
export const getUser = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//api to get published images
export const getPublishedImages = async(req,res)=>{
    try{
   const publishedImagesMessages = await Chat.aggregate([
    {$unwind: "$messages"},
    {
        $match: {
            "messages.isImage":true,
            "messages.isPublished":true,
        }
    },
{
    $project:{
        _id:0,
        imageUrl: "$messages.content",
        userName: "$userName"
    }
}
   ])

   res.json({success:true,images:publishedImagesMessages.reverse()})
    }catch(error){
        return res.json({success:false,message:error.message});
    }
}