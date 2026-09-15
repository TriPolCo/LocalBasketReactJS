import { useLocation } from "react-router-dom";
import AdminProfile from "./AdminProfile";

// Map paths directly to title labels
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/analytics": "Analytics",
  "/products": "Products",
  "/orders": "Orders",
  "/settings": "Settings",
};

export default function Header() {
  const location = useLocation();

  // Match title or fallback to formatting the pathname directly
  const activeTitle =
    PAGE_TITLES[location.pathname] ||
    location.pathname.replace("/", "").replace(/-/g, " ") ||
    "Dashboard";

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-6">
      {/* Dynamic Active Route Title */}
      <div className="text-lg font-semibold capitalize text-white">
        {activeTitle}
      </div>

      <div className="flex items-center gap-4">
        <AdminProfile />
      </div>
    </header>
  );
}