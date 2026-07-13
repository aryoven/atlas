export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">

        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />

        <p className="text-muted">
          Loading Atlas AI...
        </p>

      </div>
    </main>
  );
}