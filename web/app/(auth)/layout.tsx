import Background from "@/components/auth/Background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Background />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
