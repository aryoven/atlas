import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Stripe Event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              user_id: session.client_reference_id!,
              plan: "pro",
              status: subscription.status,

              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              stripe_price_id:
                subscription.items.data[0].price.id,

              current_period_end: new Date(
                subscription.items.data[0].current_period_end *
                  1000
              ).toISOString(),
            },
            {
              onConflict: "user_id",
            }
          );

        if (error) {
          console.error(error);
          throw error;
        }

        console.log("Subscription saved.");

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status,
            stripe_price_id:
              subscription.items.data[0].price.id,

            current_period_end: new Date(
              subscription.items.data[0].current_period_end *
                1000
            ).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            plan: "free",
            status: "canceled",
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Webhook Error",
      },
      {
        status: 500,
      }
    );
  }
}