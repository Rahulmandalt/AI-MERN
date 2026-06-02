
import express from "express"
import { protect } from "../middlewares/auth.js";
import { createChat, deleteChat, getChat } from "../controller.js/chatController.js";


const chatRouter = express.Router();

chatRouter.get('/create', protect,createChat)
chatRouter.get('/get', protect,getChat)
chatRouter.post('/delete', protect,deleteChat)

export default chatRouter;