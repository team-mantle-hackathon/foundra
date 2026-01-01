import type { ReactNode } from "react";

export default function NotFoundPage(): ReactNode {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-10 bg-slate-950 ">
      <h1 className="text-4xl font-bold mb-4 text-emerald-400">404</h1>
      <p className="text-lg text-slate-400 mb-8">Not Found Page.</p>

      <a
        href="/"
        className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
