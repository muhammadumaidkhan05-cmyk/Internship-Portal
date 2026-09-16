import { GradientStrokeCard } from "./gradient-stroke-card";

const TONE_RING = {
  blue: "bg-[#EFF6FF] text-[#2563EB]",
  cyan: "bg-[#ECFEFF] text-[#0891B2]",
  red: "bg-[#FEF2F2] text-[#DC2626]",
  amber: "bg-[#FFFBEB] text-[#F59E0B]",
  violet: "bg-[#F5F3FF] text-[#8B5CF6]",
  green: "bg-[#ECFDF5] text-[#10B981]",
};

const TONE_VALUE = {
  blue: "text-[#2563EB]",
  cyan: "text-[#0891B2]",
  red: "text-[#DC2626]",
  amber: "text-[#F59E0B]",
  violet: "text-[#8B5CF6]",
  green: "text-[#10B981]",
};

export function KpiCard({
  icon: Icon,
  value,
  label,
  description,
  tone = "blue",
}) {
  return (
    <GradientStrokeCard className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className={`grid h-11 w-11 place-items-center rounded-xl ${TONE_RING[tone]}`}
        >
          <Icon size={20} />
        </div>
      </div>
      <div>
        <div
          className={`text-3xl font-semibold leading-none ${TONE_VALUE[tone]}`}
        >
          {value}
        </div>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
          {label}
        </div>
        {description ? (
          <div className="mt-1 text-xs text-[#64748B]">{description}</div>
        ) : null}
      </div>
    </GradientStrokeCard>
  );
}
