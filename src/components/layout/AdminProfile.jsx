import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ADMIN_USER = {
  name: "Alex Morgan",
  email: "alex.morgan@company.com",
  role: "Super Admin",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
};

export default function AdminProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full p-1 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <img
          src={ADMIN_USER.avatarUrl}
          alt={ADMIN_USER.name}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200"
        />
        <div className="hidden text-left sm:block">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{ADMIN_USER.name}</p>
          <p className="text-[11px] text-slate-500 font-medium leading-tight">{ADMIN_USER.role}</p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg z-50">
          <div className="border-b border-slate-100 px-4 pb-3 pt-1">
            <p className="text-xs font-semibold text-slate-800">{ADMIN_USER.name}</p>
            <p className="truncate text-xs text-slate-500">{ADMIN_USER.email}</p>
          </div>

          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              ⚙️ Account Settings
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                alert("Logged out");
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}