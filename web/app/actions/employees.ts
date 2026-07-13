"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/services/supabase-server";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
} from "@/lib/validations/employee";

export type ActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof CreateEmployeeInput, string[]>>;
};

async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createEmployee(
  input: CreateEmployeeInput
): Promise<ActionState> {
  const parsed = createEmployeeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { error: "You must be signed in to create an AI Employee." };
  }

  const { error } = await supabase.from("employees").insert({
    user_id: user.id,
    name: parsed.data.name,
    role: parsed.data.role,
    instructions: parsed.data.instructions,
    model: parsed.data.model,
    temperature: parsed.data.temperature,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput
): Promise<ActionState> {
  const parsed = updateEmployeeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { error: "You must be signed in to update this AI Employee." };
  }

  const { error } = await supabase
    .from("employees")
    .update({
      name: parsed.data.name,
      role: parsed.data.role,
      instructions: parsed.data.instructions,
      model: parsed.data.model,
      temperature: parsed.data.temperature,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/employees/${id}`);
  revalidatePath(`/dashboard/employees/${id}/manage`);
  return {};
}

export async function deleteEmployee(
  id: string
): Promise<{ error?: string }> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { error: "You must be signed in to delete this AI Employee." };
  }

  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
