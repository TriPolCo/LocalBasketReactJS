import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Bike,
  Layers,
  Carrot,
  ShoppingBag,
  Printer,
  Image as ImageIcon,
  BadgePercent,
  Ticket,
  ShoppingCart,
  ShieldCheck,
  Utensils,
  Copyright,
  SlidersHorizontal
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Orders",
    items: [
      { label: "Orders", path: "/orders", icon: ShoppingCart },
      { label: "Print Orders", path: "/print-orders", icon: Printer },
    ],
  },
  {
    title: "User Management",
    items: [
      { label: "Users", path: "/users", icon: Users },
      // { label: "Vendors", path: "/vendors", icon: Store },
      { label: "Delivery Partners", path: "/delivery-partners", icon: Bike },
    ],
  },
  {
    title: "Grocery & Vegetables Section",
    items: [
      { label: "Categories", path: "/categories", icon: Layers },
      { label: "Brands", path: "/brands", icon: Copyright },
      { label: "Product Attributes", path: "/attributes", icon: SlidersHorizontal },
      { label: "Vegetables", path: "/vegetables", icon: Carrot },
      { label: "Grocery", path: "/grocery", icon: ShoppingBag },      
    ],
  },
  {
    title: "Food Section",
    items: [
      { label: "Categories", path: "/food-categories", icon: Layers },
      { label: "Food", path: "/food", icon: Utensils },
    ],
  },
  {
    title: "Print Section",
    items: [
      { label: "Printing Services", path: "/printing-services", icon: Printer },
    ],
  },
  {
    title: "Promotions",
    items: [
      { label: "Banners", path: "/banners", icon: ImageIcon },
      { label: "Offers", path: "/offers", icon: BadgePercent },
      { label: "Coupons", path: "/coupons", icon: Ticket },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-800 bg-gray-900 shadow-xl select-none text-gray-100">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-500 text-black shadow-md shadow-yellow-500/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-white"> <span>Daily</span> <span className="text-orange-600">Drops</span></span>
          <span className="text-xs font-medium text-gray-400">Admin Panel</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-800">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-yellow-500">
              {group.title}
            </h2>

            <div className="space-y-1 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-yellow-500 text-black font-semibold shadow-sm"
                          : "text-gray-400 hover:bg-gray-800/70 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / System Status */}
      <div className="shrink-0 border-t border-gray-800 p-3">
        <div className="flex items-center gap-2.5 rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-gray-400">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}