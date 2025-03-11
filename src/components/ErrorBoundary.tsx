"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-destructive/10 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Что-то пошло не так!</h2>
        <p className="mb-4 text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="rounded bg-primary px-4 py-2 text-primary-foreground"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}