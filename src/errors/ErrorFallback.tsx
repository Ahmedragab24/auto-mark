import React from "react";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>حدث خطأ في تحميل النموذج:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>أعد المحاولة</button>
    </div>
  );
}
