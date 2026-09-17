import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

// The CSS for this component uses react-datepicker's base and overrides it with Tailwind
export function CustomDatePicker({ selected, onChange, placeholderText = "Select date", className = "", ...props }) {
  return (
    <div className={`relative ${className}`}>
      <DatePicker
        selected={selected ? new Date(selected) : null}
        onChange={(date) => {
          // Format back to YYYY-MM-DD for the URL params
          if (!date) {
            onChange("");
            return;
          }
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          onChange(`${yyyy}-${mm}-${dd}`);
        }}
        placeholderText={placeholderText}
        dateFormat="yyyy-MM-dd"
        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#172033] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all hover:border-[#2563EB]/50"
        wrapperClassName="w-full"
        popperClassName="!z-50 animate-in fade-in zoom-in-95 duration-200"
        showPopperArrow={false}
        {...props}
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
        <Calendar size={16} />
      </span>
    </div>
  );
}
