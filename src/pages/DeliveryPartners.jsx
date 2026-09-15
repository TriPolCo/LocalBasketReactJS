import { useState } from "react";
import {
  Bike,
  Search,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Pencil
} from "lucide-react";
import AddDeliveryPartnerModal from "../components/delivery/AddDeliveryPartnerModal";
import UpdateDeliveryPartnerModal from "../components/delivery/UpdateDeliveryPartnerModal";

// Dummy data for individual delivery partners matching the system theme
const INITIAL_DELIVERY_PARTNERS = [
  {
    id: "dp-101",
    first_name: "Rahul",
    last_name: "Verma",
    email: "rahul.verma@deliver.com",
    phone_number: "9876543210",
    vehicle_type: "Electric Scooter",
    vehicle_number: "DL-08-EV-4321",
    rating: 4.8,
    total_deliveries: 1420,
    is_online: true,
    is_active: true,
    current_location: "Noida Sector 62",
    joined_date: "2025-03-12"
  },
  {
    id: "dp-102",
    first_name: "Amit",
    last_name: "Kumar",
    email: "amit.kumar@deliver.com",
    phone_number: "8765432109",
    vehicle_type: "Motorcycle",
    vehicle_number: "UP-16-AB-9876",
    rating: 4.6,
    total_deliveries: 980,
    is_online: true,
    is_active: true,
    current_location: "Noida Sector 18",
    joined_date: "2025-06-15"
  },
  {
    id: "dp-103",
    first_name: "Suresh",
    last_name: "Yadav",
    email: "suresh.y@deliver.com",
    phone_number: "7654321098",
    vehicle_type: "Bicycle",
    vehicle_number: "N/A (Eco Rider)",
    rating: 4.9,
    total_deliveries: 610,
    is_online: false,
    is_active: true,
    current_location: "Indirapuram",
    joined_date: "2025-09-01"
  },
  {
    id: "dp-104",
    first_name: "Vikram",
    last_name: "Singh",
    email: "vikram.s@deliver.com",
    phone_number: "6543210987",
    vehicle_type: "Motorcycle",
    vehicle_number: "DL-03-XY-1234",
    rating: 4.2,
    total_deliveries: 340,
    is_online: false,
    is_active: false,
    current_location: "Mayur Vihar",
    joined_date: "2026-01-10"
  },
  {
    id: "dp-105",
    first_name: "Manoj",
    last_name: "Gupta",
    email: "manoj.g@deliver.com",
    phone_number: "9988776655",
    vehicle_type: "Electric Scooter",
    vehicle_number: "UP-14-EV-8899",
    rating: 4.7,
    total_deliveries: 1150,
    is_online: true,
    is_active: true,
    current_location: "Noida Sector 15",
    joined_date: "2025-04-20"
  }
];

export default function DeliveryPartners() {
  const [partnersList, setPartnersList] = useState(INITIAL_DELIVERY_PARTNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ONLINE, OFFLINE
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const isLoading = false;
  const isError = false;

  // Filter partners based on search query and online/offline status
  const filteredPartners = partnersList.filter((partner) => {
    const fullName = `${partner.first_name} ${partner.last_name}`.toLowerCase();
    const email = partner.email.toLowerCase();
    const phone = partner.phone_number;
    const vehicle = partner.vehicle_type.toLowerCase();

    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      vehicle.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ONLINE" && partner.is_online) ||
      (statusFilter === "OFFLINE" && !partner.is_online);

    return matchesSearch && matchesStatus;
  });

  // Frontend Pagination Calculations
  const totalPages = Math.ceil(filteredPartners.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentTableData = filteredPartners.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddSuccess = (newPartnerData) => {
    const newPartner = {
      id: `dp-${Date.now()}`,
      ...newPartnerData,
      rating: 5.0,
      total_deliveries: 0,
      is_online: false,
      joined_date: new Date().toISOString().split("T")[0]
    };
    setPartnersList([newPartner, ...partnersList]);
    setIsAddModalOpen(false);
  };

  const handleUpdateSuccess = (updatedData) => {
    setPartnersList((prev) =>
      prev.map((item) => (item.id === updatedData.id ? { ...item, ...updatedData } : item))
    );
    setIsUpdateModalOpen(false);
    setSelectedPartner(null);
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bike className="w-5 h-5 text-yellow-500" /> Delivery Partners
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage individual field delivery personnel, track active statuses, and fleet ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        >
          <Bike className="h-3.5 w-3.5" />
          <span>Add Delivery Partner</span>
        </button>
      </div>

      {/* Filter & Search Bar Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-md border border-gray-800 bg-gray-900/60 p-4 shadow-xl backdrop-blur-xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners by name, phone, or vehicle..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-gray-800 bg-gray-950/80 pl-10 pr-4 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all shadow-inner"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {["ALL", "ONLINE", "OFFLINE"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                statusFilter === status
                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 font-semibold shadow-sm"
                  : "bg-gray-950/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading delivery fleet...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400 shadow-xl">
          Failed to load delivery partners. Please try again later.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredPartners.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-xs font-medium text-gray-400 space-y-2 shadow-xl">
          <Bike className="h-8 w-8 text-gray-600" />
          <p>No delivery partners found matching your search criteria.</p>
        </div>
      )}

      {/* Partners Data Table */}
      {!isLoading && !isError && filteredPartners.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-x-auto overflow-y-visible rounded-md border border-gray-800 bg-gray-900/50 shadow-xl backdrop-blur-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-medium text-gray-400">
                <tr>
                  <th className="py-3 pl-4 pr-2 w-10">#</th>
                  <th className="py-3 px-3">Partner Name</th>
                  <th className="py-3 px-3">Contact Information</th>
                  <th className="py-3 px-3">Vehicle Details</th>
                  <th className="py-3 px-3 text-center">Performance</th>
                  <th className="py-3 px-3 text-center">Duty Status</th>
                  <th className="py-3 pl-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {currentTableData.map((partner, index) => {
                  const absoluteIndex = startIndex + index + 1;
                  const fullName = `${partner.first_name} ${partner.last_name}`;
                  const isOnline = partner.is_online;

                  return (
                    <tr key={partner.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 pl-4 pr-2 font-medium text-gray-500">
                        {absoluteIndex}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {fullName}
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                          <MapPin className="h-3 w-3 text-yellow-500 shrink-0" /> {partner.current_location}
                        </span>
                      </td>
                      <td className="py-3 px-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Phone className="h-3 w-3 text-gray-500 shrink-0" />
                          <span>{partner.phone_number}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <Mail className="h-3 w-3 text-gray-500 shrink-0" />
                          <span>{partner.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-200">{partner.vehicle_type}</div>
                        <span className="font-mono text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                          {partner.vehicle_number}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 font-semibold text-yellow-400">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span>{partner.rating}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {partner.total_deliveries} orders completed
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[72px] rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide border ${
                            isOnline
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-gray-800 text-gray-400 border-gray-700"
                          }`}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </span>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {partner.is_active ? "Account Active" : "Account Suspended"}
                        </div>
                      </td>
                      <td className="py-3 pl-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setIsUpdateModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-gray-950/60 px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
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
                {Math.min(startIndex + pageSize, filteredPartners.length)}
              </span>{" "}
              of <span className="font-semibold text-white">{filteredPartners.length}</span> partners
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

      {/* Add Modal */}
      <AddDeliveryPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Update Modal */}
      <UpdateDeliveryPartnerModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}