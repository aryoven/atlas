"use client";

export default function GlobalError() {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Atlas AI
          </h1>

          <p className="mt-4 text-muted">
            A critical error occurred.
          </p>
        </div>
      </body>
    </html>
  );
}