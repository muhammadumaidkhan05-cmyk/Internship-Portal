import { useEffect, useState } from "react";
import { subscribeToast } from "../../api/client";
import { IconCheck } from "./icons";

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToast((message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const bg =
          toast.type === "error"
            ? "bg-[#DC2626] text-white"
            : toast.type === "success"
              ? "bg-[#047857] text-white"
              : "bg-[#0E2A52] text-white";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-lg transition-all ${bg}`}
          >
            {toast.type === "success" && <IconCheck size={14} />}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
