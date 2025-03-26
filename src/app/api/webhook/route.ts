import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Initialize Stripe with better error handling
const stripe = (() => {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error(
        "STRIPE_SECRET_KEY is not defined in environment variables"
      );
      throw new Error("Missing Stripe secret key");
    }
    return new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    });
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    throw error;
  }
})();

// Make sure to set this environment variable with your complete webhook secret
const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY;

export async function POST(request: NextRequest) {
  console.log("Webhook endpoint called");

  if (!endpointSecret) {
    console.error(
      "STRIPE_SECRET_WEBHOOK_KEY is not defined in environment variables"
    );
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    console.error("Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log(`✅ Webhook verified: ${event.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event based on its type
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 Payment successful for session: ${session.id}`);

        // Extract metadata
        const userId = session.metadata?.userId;
        const packageId = session.metadata?.packageId;
        // const productId = session.metadata?.productId;

        if (!userId) {
          console.warn("Missing userId in session metadata:", session.id);
        }

        // Here you would update your database with the payment status
        try {
          // This is where you would call your database update function
          // For example, using your existing mutation:
          //
          // const formData = {
          //   packageId: packageId,
          //   productId: productId || 0,
          // };
          //
          // await updateSubscriptionStatus(userId, formData);

          console.log(
            `✅ Successfully processed subscription for user: ${userId}, package: ${packageId}`
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (dbError: any) {
          console.error("Database update error:", dbError);
          // We don't want to return an error response here as Stripe will retry
          // Instead, log the error and continue
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`💰 Payment intent succeeded: ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `❌ Payment failed: ${paymentIntent.id}, ${
            paymentIntent.last_payment_error?.message || "Unknown error"
          }`
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true, id: event.id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: `Error processing webhook: ${error.message}` },
      { status: 500 }
    );
  }
}
