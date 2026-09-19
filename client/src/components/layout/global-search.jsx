import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconSearch } from "../shared/icons";
import { useUsers, usePrograms } from "../../api"; // Audit logs require user ID, let's stick to Users and Programs

export function GlobalSearch({ placeholder = "Search..." }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shouldSearch = debouncedQuery.trim().length >= 2;

  const { data: usersData, isFetching: isUsersLoading } = useUsers({
    search: shouldSearch ? debouncedQuery : "",
    limit: 5,
  });

  const { data: programsData, isFetching: isProgramsLoading } = usePrograms({
    search: shouldSearch ? debouncedQuery : "",
    limit: 5,
  });

  const users = shouldSearch ? (usersData?.data || []) : [];
  const programs = shouldSearch ? (programsData?.data || []) : [];
  
  const isLoading = isUsersLoading || isProgramsLoading;
  const hasResults = users.length > 0 || programs.length > 0;

  const handleSelect = (url) => {
    setIsOpen(false);
    setQuery("");
    navigate(url);
  };

  return (
    <div className="relative w-full sm:max-w-xs shrink-0" ref={containerRef}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
        <IconSearch size={16} />
      </span>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length > 0) setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            e.preventDefault();
            handleSelect(`/admin/users?search=${encodeURIComponent(query.trim())}`);
          }
        }}
        placeholder={placeholder}
        aria-label="Search"
        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#172033] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
      />

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute right-0 top-full mt-2 w-full sm:w-[350px] z-50 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-[#64748B]">Searching...</div>
            ) : !hasResults ? (
              <div className="p-4 text-center text-sm text-[#64748B]">No results found for "{query}"</div>
            ) : (
              <>
                {users.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Users</div>
                    <ul className="mt-1 space-y-1">
                      {users.map(u => (
                        <li key={u.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(`/admin/users?search=${encodeURIComponent(query)}`)}
                            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-[#F8FAFC]"
                          >
                            <div>
                              <div className="font-semibold text-[#172033]">{u.name}</div>
                              <div className="text-xs text-[#64748B]">{u.email}</div>
                            </div>
                            <span className="text-[10px] font-medium text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">{u.role}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {programs.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Programs</div>
                    <ul className="mt-1 space-y-1">
                      {programs.map(p => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(`/admin/programs?search=${encodeURIComponent(query)}`)}
                            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-[#F8FAFC]"
                          >
                            <div>
                              <div className="font-semibold text-[#172033]">{p.name}</div>
                              <div className="text-xs text-[#64748B]">{p.cohortSize} Interns</div>
                            </div>
                            <span className="text-[10px] font-medium text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-full">{p.status}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          
          {hasResults && (
            <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-center">
              <span className="text-xs text-[#64748B]">Press <kbd className="font-mono bg-[#E2E8F0] px-1 rounded">Enter</kbd> to view all results</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
