const TONE = {
  blue: "bg-[#EFF6FF] text-[#1D4ED8] ring-[#BFDBFE]",
  cyan: "bg-[#ECFEFF] text-[#0E7490] ring-[#A5F3FC]",
  red: "bg-[#FEF2F2] text-[#B91C1C] ring-[#FECACA]",
  amber: "bg-[#FFFBEB] text-[#B45309] ring-[#FDE68A]",
  violet: "bg-[#F5F3FF] text-[#6D28D9] ring-[#DDD6FE]",
  green: "bg-[#ECFDF5] text-[#047857] ring-[#A7F3D0]",
  neutral: "bg-[#F1F5F9] text-[#475569] ring-[#E2E8F0]",
};

export function StatusBadge({ tone, children, dot = true, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${TONE[tone]} ${className}`}
    >
      {dot && (
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}

export function statusToneFor(value) {
  const v = value.toLowerCase();
  if (v === "active" || v === "ok" || v === "healthy") return "blue";
  if (v === "in_progress" || v === "in progress" || v === "pending")
    return "cyan";
  if (v === "completed" || v === "approved") return "green";
  if (v === "inactive") return "amber";
  if (v === "suspended" || v === "failed" || v === "critical") return "red";
  if (v === "archived") return "neutral";
  return "neutral";
}
