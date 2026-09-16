export function GradientStrokeCard({
  children,
  interactive = true,
  padding = "md",
  className = "",
  ...rest
}) {
  const pad =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "p-4"
        : padding === "lg"
          ? "p-6 sm:p-7"
          : "p-5 sm:p-6";

  return (
    <div
      {...rest}
      className={`relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.04)] ${
        interactive ? "hover-lift-card" : ""
      } ${pad} ${className}`}
    >
      <div
        aria-hidden
        className="gradient-stroke-bar pointer-events-none absolute inset-x-0 top-0 h-[3px] transition-[filter] duration-200"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #2563EB 0%, #22D3EE 50%, #DC2626 100%)",
        }}
      />

      {children}
    </div>
  );
}
