"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-white">
        Something went wrong
      </h1>

      <p className="mt-4 text-muted">
        An unexpected error occurred.
      </p>

      <button
        onClick={() => reset()}
        className="mt-8 rounded-xl bg-primary px-6 py-3 text-white"
      >
        Try Again
      </button>
    </main>
  );
}