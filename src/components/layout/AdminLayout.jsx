import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#030712]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}