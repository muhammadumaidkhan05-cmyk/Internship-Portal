import { GradientStrokeCard } from "./gradient-stroke-card";

const TONE_BG = {
  blue: "bg-[#EFF6FF] text-[#1D4ED8]",
  cyan: "bg-[#ECFEFF] text-[#0E7490]",
  red: "bg-[#FEF2F2] text-[#B91C1C]",
  amber: "bg-[#FFFBEB] text-[#B45309]",
  violet: "bg-[#F5F3FF] text-[#6D28D9]",
  green: "bg-[#ECFDF5] text-[#047857]",
};

export function HeroCard({
  eyebrow,
  title,
  description,
  badge,
  eyebrowTone = "blue",
}) {
  return (
    <GradientStrokeCard
      padding="lg"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.1em] ${TONE_BG[eyebrowTone]}`}
        >
          {eyebrow}
        </span>
        <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)] font-semibold leading-tight text-[#172033]">
          {title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-[#64748B]">{description}</p>
      </div>
      {badge ? <div className="shrink-0">{badge}</div> : null}
    </GradientStrokeCard>
  );
}
