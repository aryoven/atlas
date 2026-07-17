import { createServerSupabaseClient } from "@/services/supabase-server";
import { getPlan, type Plan } from "./plans";

export async function getUserPlan(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .single();

  const plan = (data?.plan as Plan | undefined) ?? "free";

  return getPlan(plan);
}