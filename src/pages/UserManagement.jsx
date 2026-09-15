import { useState } from "react";
import {
  Users,
  Search,
  Loader2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useUsers } from "../hooks/users/useUsers";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { users, loading: isLoading, error, refetch } = useUsers();
  const isError = Boolean(error);

  const usersList = Array.isArray(users) ? users : [];

  // Filter users based on search query (name, email, phone) and role
  const filteredUsers = usersList.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = user.phone_number || "";
    
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Frontend Pagination Calculations
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentTableData = filteredUsers.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-500" /> User Management
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor registered platform customers, admin permissions, and account statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-800 bg-gray-900/60 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all shadow-sm"
        >
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter & Search Bar Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-md border border-gray-800 bg-gray-900/60 p-4 shadow-xl backdrop-blur-xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="w-full rounded-md border border-gray-800 bg-gray-950/80 pl-10 pr-4 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all shadow-inner"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {["ALL", "CUSTOMER", "ADMIN", "VENDOR"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setRoleFilter(role);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                roleFilter === role
                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 font-semibold shadow-sm"
                  : "bg-gray-950/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading system users...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400 shadow-xl">
          {error || "Failed to load users. Please check your network connection or permissions."}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredUsers.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-xs font-medium text-gray-400 space-y-2 shadow-xl">
          <ShieldAlert className="h-8 w-8 text-gray-600" />
          <p>No registered users found matching your search or role filter.</p>
        </div>
      )}

      {/* Users Data Table */}
      {!isLoading && !isError && filteredUsers.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-x-auto overflow-y-visible rounded-md border border-gray-800 bg-gray-900/50 shadow-xl backdrop-blur-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-medium text-gray-400">
                <tr>
                  <th className="py-3 pl-4 pr-2 w-10">#</th>
                  <th className="py-3 px-3">User Full Name</th>
                  <th className="py-3 px-3">Contact Information</th>
                  <th className="py-3 px-3 text-center">Role</th>
                  <th className="py-3 px-3 text-center">Verifications</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 pl-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {currentTableData.map((user, index) => {
                  const absoluteIndex = startIndex + index + 1;
                  const firstName = user.first_name || "N/A";
                  const lastName = user.last_name || "";
                  const fullName = `${firstName} ${lastName}`.trim();
                  const isActive = user.is_active;

                  return (
                    <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 pl-4 pr-2 font-medium text-gray-500">
                        {absoluteIndex}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">
                          {fullName}
                        </div>
                        <span className="font-mono text-[10px] text-gray-500">
                          ID: {user.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="py-3 px-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Mail className="h-3 w-3 text-yellow-500 shrink-0" />
                          <span>{user.email || "No email linked"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <Phone className="h-3 w-3 text-gray-500 shrink-0" />
                          <span>{user.phone_number || "No phone"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide border ${
                          user.role === "ADMIN" 
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                            : user.role === "VENDOR"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-gray-800 text-gray-300 border-gray-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-[10px]">
                          <span title={user.email_verified ? "Email Verified" : "Email Unverified"}>
                            {user.email_verified ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-600" />
                            )}
                          </span>
                          <span title={user.phone_verified ? "Phone Verified" : "Phone Unverified"}>
                            {user.phone_verified ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-600" />
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[64px] rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide border ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 pl-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert(`View details for user: ${fullName}`)}
                          className="rounded-md border border-gray-800 bg-gray-950/60 px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-md border border-gray-800 bg-gray-900/60 px-4 py-3 shadow-lg backdrop-blur-xl">
            <span className="text-xs text-gray-400">
              Showing <span className="font-semibold text-white">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-white">
                {Math.min(startIndex + pageSize, filteredUsers.length)}
              </span>{" "}
              of <span className="font-semibold text-white">{filteredUsers.length}</span> users
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-gray-950/60 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <span className="text-xs font-medium text-gray-400 px-2">
                Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-gray-950/60 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}