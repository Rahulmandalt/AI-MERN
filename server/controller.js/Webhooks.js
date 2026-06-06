import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Webhook Event:", event.type);
  } catch (error) {
    console.log("Webhook Signature Error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Session Metadata:", session.metadata);

      const transactionId = session.metadata?.transactionId;
      const appId = session.metadata?.appId;

      if (!transactionId || appId !== "quickgpt") {
        return res.json({ received: true, message: "Invalid metadata" });
      }

      const transaction = await Transaction.findOne({
        _id: transactionId,
        isPaid: false,
      });

      if (!transaction) {
        return res.json({
          received: true,
          message: "Transaction not found or already paid",
        });
      }

      const user = await User.findById(transaction.userId);

      if (!user) {
        return res.json({ received: true, message: "User not found" });
      }

      // ✅ FIX: NaN issue handle kiya
      user.credits = (user.credits || 0) + transaction.credits;
      transaction.isPaid = true;

      // ✅ FIX: Dono ek saath save karo
      await Promise.all([user.save(), transaction.save()]);

      console.log(`Credits Added: ${transaction.credits} to user ${user._id}`);
      console.log(`New Balance: ${user.credits}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.log("Webhook Processing Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};