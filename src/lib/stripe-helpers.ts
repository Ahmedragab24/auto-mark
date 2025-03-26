import Stripe from "stripe";

/**
 * Initialize the Stripe client with proper error handling
 */
export function getStripeClient(): Stripe {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Missing Stripe secret key in environment variables");
    }

    return new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    });
  } catch (error) {
    console.error("Failed to initialize Stripe client:", error);
    throw error;
  }
}

/**
 * Verify a Stripe webhook signature
 */
export function verifyStripeWebhook(
  payload: string,
  signature: string
): Stripe.Event {
  try {
    const secretKey = process.env.STRIPE_SECRET_WEBHOOK_KEY;
    if (!secretKey) {
      throw new Error("Missing Stripe webhook secret in environment variables");
    }

    const stripe = getStripeClient();
    return stripe.webhooks.constructEvent(payload, signature, secretKey);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    throw error;
  }
}

/**
 * Handle a successful payment
 * This is where you would update your database with subscription information
 */
export async function handleSuccessfulPayment(
  session: Stripe.Checkout.Session
): Promise<void> {
  try {
    const { metadata } = session;

    if (!metadata?.userId) {
      console.warn("Missing userId in session metadata:", session.id);
      return;
    }

    // Here you would update your database
    // Example:
    // await db.user.update({
    //   where: { id: metadata.userId },
    //   data: {
    //     subscriptionStatus: "active",
    //     subscriptionId: session.subscription as string,
    //     customerId: customer as string,
    //   },
    // });

    console.log(`Successfully processed payment for user: ${metadata.userId}`);
  } catch (error) {
    console.error("Error handling successful payment:", error);
    throw error;
  }
}
