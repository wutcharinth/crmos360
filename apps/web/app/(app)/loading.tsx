export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="h-8 w-40 animate-pulse rounded bg-paper-2" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-paper-2" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-paper-2" />
    </main>
  );
}
