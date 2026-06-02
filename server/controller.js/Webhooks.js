import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;

                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                const session = sessionList.data[0];

                if (!session) {
                    return response.json({
                        received: true,
                        message: "Session not found",
                    });
                }

                const { transactionId, appId } = session.metadata || {};

                if (appId !== "quickgpt") {
                    return response.json({
                        received: true,
                        message: "Ignored event: invalid app",
                    });
                }

                const transaction = await Transaction.findOne({
                    _id: transactionId,
                    isPaid: false,
                });

                if (!transaction) {
                    return response.json({
                        received: true,
                        message: "Transaction not found or already processed",
                    });
                }

                // Update user credits
                await User.updateOne(
                    { _id: transaction.userId },
                    { $inc: { credits: transaction.credits } }
                );

                // Mark transaction as paid
                transaction.isPaid = true;
                await transaction.save();

                break;
            }

            default:
                console.log("Unhandled event:", event.type);
                break;
        }

        return response.json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return response.status(500).send("Internal Server Error");
    }
};