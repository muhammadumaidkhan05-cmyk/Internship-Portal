export function PageHeader({ title, action }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h3 className="text-[15px] font-semibold text-[#172033]">{title}</h3>
      {action}
    </div>
  );
}
