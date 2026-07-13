"use client";

import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">

        <h1 className="text-6xl font-bold text-red-500">
          Oops!
        </h1>

        <p className="mt-6 text-muted">
          Something went wrong.
        </p>

        <div className="mt-8">
          <Button onClick={() => reset()}>
            Try Again
          </Button>
        </div>

      </div>
    </main>
  );
}