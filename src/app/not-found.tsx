import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg text-white flex items-center justify-center px-5">
      <div className="text-center">
        <div className="text-5xl mb-5">🔍</div>
        <h1 className="text-2xl font-extrabold mb-3">Page Not Found</h1>
        <p className="text-muted2 text-sm mb-6">The page you are looking for does not exist.</p>
        <Link href="/" className="inline-block px-6 py-3 rounded-lg gradient-bg text-white font-bold text-sm">
          Go Home
        </Link>
      </div>
    </main>
  );
}
