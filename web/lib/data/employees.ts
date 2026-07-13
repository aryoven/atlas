import type { Employee } from "@/lib/types/employee";
import { createServerSupabaseClient } from "@/services/supabase-server";

export async function getEmployeeForUser(
  id: string,
  userId: string
): Promise<Employee | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Employee;
}
