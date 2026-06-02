
import express from "express"
import { protect } from "../middlewares/auth.js"
import { imageMessageController, textMessageController } from "../controller.js/messageController.js"

const messageRouter = express()

messageRouter.post('/text', protect, textMessageController)
messageRouter.post('/image', protect, imageMessageController)


export default messageRouter;