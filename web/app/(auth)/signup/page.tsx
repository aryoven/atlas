import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up — Atlas AI",
  description: "Create your Atlas AI account",
};

export default function SignupPage() {
  return <SignupForm />;
}
