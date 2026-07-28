import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/services/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (error || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        {
          error: "No active subscription found.",
        },
        {
          status: 400,
        }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${origin}/dashboard/billing`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to create billing portal.",
      },
      {
        status: 500,
      }
    );
  }
}