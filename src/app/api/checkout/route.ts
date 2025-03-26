import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  console.log("Checkout API called");

  try {
    // Log environment variables (without exposing full secret values)
    console.log("Environment check:", {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
      successUrl: process.env.NEXT_PUBLIC_SUCCESS_URL,
      cancelUrl: process.env.NEXT_PUBLIC_CANCEL_URL,
    });

    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
      console.log("Request body:", JSON.stringify(body));
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { priceId, userId, amount, currency = "AED" } = body;

    if (!userId) {
      console.error("Missing required field: userId");
      return NextResponse.json(
        { error: "Missing required field: userId" },
        { status: 400 }
      );
    }

    // Set default URLs if environment variables are not set
    const successUrl =
      process.env.NEXT_PUBLIC_SUCCESS_URL ||
      `${request.nextUrl.origin}/payment/success`;
    const cancelUrl =
      process.env.NEXT_PUBLIC_CANCEL_URL ||
      `${request.nextUrl.origin}/payment/cancel`;

    console.log("Creating checkout session with:", {
      priceId,
      userId,
      amount,
      currency,
      successUrl,
      cancelUrl,
    });

    // Create a checkout session with detailed error handling
    try {
      let checkoutSessionParams: Stripe.Checkout.SessionCreateParams;

      if (priceId && priceId.startsWith("price_")) {
        // If a valid Stripe price ID is provided, use it
        checkoutSessionParams = {
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          mode: "payment",
          success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl,
          metadata: { userId, priceId },
        };
      } else {
        // Otherwise, create a one-time payment with the amount
        checkoutSessionParams = {
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                  name: body.packageName || "Subscription Package",
                  description:
                    body.packageDescription ||
                    `Duration: ${body.duration_days || priceId} days`,
                },
                unit_amount: Math.round(Number.parseFloat(amount) * 100), // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl,
          metadata: {
            userId,
            priceId,
            packageId: body.packageId || "",
            productId: body.productId || "",
            duration_days: body.duration_days || priceId,
          },
        };
      }

      const checkoutSession = await stripe.checkout.sessions.create(
        checkoutSessionParams
      );

      console.log("Checkout session created:", checkoutSession.id);
      return NextResponse.json({ sessionId: checkoutSession.id });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (stripeError: any) {
      console.error("Stripe checkout error:", {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        param: stripeError.param,
      });

      return NextResponse.json(
        {
          error: "Stripe checkout error",
          message: stripeError.message,
          code: stripeError.code,
        },
        { status: 400 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Unhandled checkout error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
