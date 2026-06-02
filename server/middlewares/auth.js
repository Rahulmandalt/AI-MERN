// import jwt from 'jsonwebtoken'
// import User from '../models/User.js';


// export const protect = async (req, res, next) => {
//     let token = req.header.authorization;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const userId = decoded.id;

//         const user = await User.findById(userId)

//         if (!user) {
//             return res.json({ success: false, message: 'not authorized, user not found' })
//         }
//         req.user = user;
//         next()
//     } catch (error){
//  res.status(401).json({message:'not authorized, token failed'})
//     }
   
// }




import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token exist?
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Bearer remove
    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};