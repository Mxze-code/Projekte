"use client";

import { useEffect } from "react";

/**
 * Verhindert, dass native Events (z.B. von Image-Loading) als unbehandelte
 * Rejections an Next.js DevTools weitergeleitet werden und dort [object Event]
 * verursachen.
 */
export function UnhandledRejectionHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      if (reason instanceof Event || (typeof reason === "object" && reason !== null && "type" in reason && typeof (reason as Event).type === "string")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("unhandledrejection", handler, true);
    return () => window.removeEventListener("unhandledrejection", handler, true);
  }, []);

  return <>{children}</>;
}
