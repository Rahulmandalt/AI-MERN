import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRouter.js'
import { stripeWebhooks } from './controller.js/Webhooks.js'

const app= express()

await connectDB()

//stripe webhook
app.post('/api/stripe', express.raw({type: 'application/json'}),stripeWebhooks)

// middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))


app.use(express.json())



//Routes
app.get('/',(req,res)=> res.send('rahil'))
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`server is running on PORT ${PORT}`)
})