import { useEffect } from "react";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  icon,
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-4 sm:slide-in-from-bottom-0">
        <div className="p-6 text-center">
          {/* Icon Circle */}
          {icon && (
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDestructive ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#EFF6FF] text-[#2563EB]"}`}
            >
              {icon}
            </div>
          )}

          <h2 className="mb-2 text-lg font-bold text-[#172033]">{title}</h2>
          <p className="mb-6 text-sm text-[#64748B] leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all sm:w-auto ${
                isDestructive
                  ? "bg-[#DC2626] hover:bg-[#B91C1C] focus:ring-4 focus:ring-[#DC2626]/20 disabled:bg-[#DC2626]/50"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] focus:ring-4 focus:ring-[#2563EB]/20 disabled:bg-[#2563EB]/50"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                confirmLabel
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] shadow-sm ring-1 ring-inset ring-[#E2E8F0] hover:bg-[#F8FAFC] transition-all sm:w-auto"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
