import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export function CustomSelect({ value, onChange, options, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => String(o.value) === String(value)) || options[0];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] transition-all hover:border-[#2563EB]/50 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 shadow-sm"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown 
          size={16} 
          className={`text-[#64748B] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2563EB]" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[180px] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          <ul 
            role="listbox" 
            className="max-h-60 overflow-y-auto outline-none space-y-0.5"
            tabIndex={-1}
          >
            {options.map((opt) => (
              <li key={opt.value} role="option" aria-selected={String(value) === String(opt.value)}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    String(value) === String(opt.value)
                      ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                      : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#172033]"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {String(value) === String(opt.value) && <Check size={14} className="shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
