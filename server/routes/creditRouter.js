
import express from "express";
import { getPlans, purchase } from "../controller.js/creditController.js";
import { protect } from "../middlewares/auth.js";

const creditRouter = express.Router()

creditRouter.get('/plan',getPlans)
creditRouter.post('/purchase',protect,purchase)

export default creditRouter;