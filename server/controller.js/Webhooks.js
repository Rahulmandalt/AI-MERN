import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook signature error:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    console.log("Webhook Event:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const sessionList = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      if (!sessionList.data.length) {
        return response.json({
          received: true,
          message: "No checkout session found",
        });
      }

      const session = sessionList.data[0];

      const transactionId = session?.metadata?.transactionId;
      const appId = session?.metadata?.appId;

      console.log("transactionId:", transactionId);
      console.log("appId:", appId);

      if (!transactionId || appId !== "quickgpt") {
        return response.json({
          received: true,
          message: "Invalid metadata",
        });
      }

      const transaction = await Transaction.findOne({
        _id: transactionId,
        isPaid: false,
      });

      if (!transaction) {
        return response.json({
          received: true,
          message: "Transaction not found or already paid",
        });
      }

      await User.updateOne(
        { _id: transaction.userId },
        { $inc: { credits: transaction.credits } }
      );

      transaction.isPaid = true;
      await transaction.save();

      console.log("Credits added successfully");
    }

    return response.json({ received: true });
  } catch (error) {
    console.log("Webhook processing error:", error);
    return response.status(500).send("Internal Server Error");
  }
};