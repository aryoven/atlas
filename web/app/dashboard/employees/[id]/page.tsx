import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/services/supabase-server";
import { getEmployeeForUser } from "@/lib/data/employees";
import {
  getEmployeeMessages,
  toChatMessage,
} from "@/lib/data/employee-messages";
import {
  getOrCreateActiveConversation,
  listEmployeeConversations,
} from "@/lib/data/employee-conversations";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmployeeWorkspaceHeader from "@/components/dashboard/employee/EmployeeWorkspaceHeader";
import EmployeeWorkspaceTabs from "@/components/dashboard/employee/EmployeeWorkspaceTabs";
import ConversationSidebar from "@/components/dashboard/employee/ConversationSidebar";
import EmployeeChatWorkspace from "@/components/dashboard/employee/EmployeeChatWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ conversation?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { title: "Chat — Atlas AI" };
  }

  const employee = await getEmployeeForUser(id, user.id);

  return {
    title: employee
      ? `Chat with ${employee.name} — Atlas AI`
      : "Chat — Atlas AI",
    description: employee
      ? `Chat with ${employee.name}, your AI ${employee.role}`
      : "AI Employee chat",
  };
}

export default async function EmployeeChatPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { conversation: conversationParam } = await searchParams;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const employee = await getEmployeeForUser(id, user.id);

  if (!employee) {
    notFound();
  }

  const activeConversation = await getOrCreateActiveConversation(
    employee.id,
    user.id,
    conversationParam ?? null
  );

  if (!conversationParam) {
    redirect(
      `/dashboard/employees/${id}?conversation=${activeConversation.id}`
    );
  }

  const conversations = await listEmployeeConversations(employee.id, user.id);

  const storedMessages = await getEmployeeMessages(
    employee.id,
    user.id,
    activeConversation.id
  );
  const initialMessages = storedMessages.map(toChatMessage);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <DashboardHeader />
      <EmployeeWorkspaceHeader employee={employee} />
      <Suspense
        fallback={
          <div className="border-b border-white/10 pb-3">
            <div className="h-10 animate-pulse rounded-lg bg-white/5" />
          </div>
        }
      >
        <EmployeeWorkspaceTabs employeeId={employee.id} />
      </Suspense>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <ConversationSidebar
          employeeId={employee.id}
          conversations={conversations}
          activeConversationId={activeConversation.id}
        />
        <EmployeeChatWorkspace
          key={activeConversation.id}
          employee={employee}
          conversationId={activeConversation.id}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
