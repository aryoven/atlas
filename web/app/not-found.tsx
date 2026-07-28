import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>

      <h2 className="mt-6 text-3xl font-bold text-white">
        Page not found
      </h2>

      <p className="mt-4 max-w-md text-muted">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary px-6 py-3 text-white hover:opacity-90"
      >
        Back to Home
      </Link>
    </main>
  );
}