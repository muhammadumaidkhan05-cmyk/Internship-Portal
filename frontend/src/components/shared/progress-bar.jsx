export function ProgressBar({ value, className = "", showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]"
      >
        <div
          className="gradient-progress h-full rounded-full transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-9 text-right text-xs font-semibold tabular-nums text-[#64748B]">
          {clamped}%
        </span>
      )}
    </div>
  );
}
