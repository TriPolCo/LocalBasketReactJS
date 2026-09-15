import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bike,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  Calendar,
  Star,
  Package,
  AlertTriangle,
  Pencil,
  Trash2
} from "lucide-react";
import { useDeliveryPartnerDetails } from "../hooks/deliveryPartners/useDeliveryPartnerDetails";
import { useDeleteDeliveryPartner } from "../hooks/deliveryPartners/useDeleteDeliveryPartner";
import UpdateDeliveryPartnerModal from "../components/delivery/UpdateDeliveryPartnerModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";

// Dummy recent deliveries with date filtering support
const DUMMY_RECENT_DELIVERIES = [
  { id: "ORD-9821", date: "2026-09-15", customer: "Priya Sharma", items: "Chicken Biryani Special x1", amount: "₹240.00", status: "Delivered", time: "11:30 AM" },
  { id: "ORD-9815", date: "2026-09-15", customer: "Amit Patel", items: "Paneer Butter Masala x2", amount: "₹450.00", status: "Delivered", time: "10:15 AM" },
  { id: "ORD-9788", date: "2026-09-14", customer: "Sneha Roy", items: "Veg Fried Rice x1", amount: "₹180.00", status: "Delivered", time: "08:45 PM" },
  { id: "ORD-9750", date: "2026-09-13", customer: "Karan Singh", items: "Mutton Rogan Josh x1", amount: "₹380.00", status: "Cancelled", time: "02:20 PM" },
];

// Dummy customer complaints / reviews
const DUMMY_FEEDBACKS = [
  { id: "fb-1", customer: "Karan Singh", rating: 2, comment: "Order was delayed by 20 minutes past the estimated delivery window.", date: "2026-09-13", type: "Complaint" },
  { id: "fb-2", customer: "Priya Sharma", rating: 5, comment: "Very polite partner and handled the food packaging with absolute care!", date: "2026-09-15", type: "Review" },
  { id: "fb-3", customer: "Amit Patel", rating: 5, comment: "Fast delivery right on time. Excellent service.", date: "2026-09-15", type: "Review" }
];

export default function DeliveryPartnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { partner, loading: isLoading, error, refetch } = useDeliveryPartnerDetails(id);
  const deletePartnerMutation = useDeleteDeliveryPartner();
  const isError = Boolean(error);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("ALL"); // ALL, TODAY, YESTERDAY

  const filteredDeliveries = DUMMY_RECENT_DELIVERIES.filter((item) => {
    const todayStr = "2026-09-15"; // Simulated current date context
    if (dateFilter === "TODAY") return item.date === todayStr;
    if (dateFilter === "YESTERDAY") return item.date !== todayStr;
    return true;
  });

  const handleDeleteConfirm = () => {
    deletePartnerMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate("/delivery-partners"); // Redirect back to list
      },
      onError: (err) => {
        alert(err?.message || "Failed to delete delivery partner.");
      }
    });
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Header & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-800 bg-gray-900/60 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Partners</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-xs font-mono text-yellow-400">
            Partner ID: {id?.slice(0, 8)}...
          </span>
          <button
            type="button"
            onClick={() => setIsUpdateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-black shadow-sm hover:bg-yellow-400 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading delivery partner profile...</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400 shadow-xl">
          {error || "Failed to load partner details."}
        </div>
      )}

      {!isLoading && !isError && partner && (
        <>
          {/* Profile Overview Card */}
          <div className="rounded-md border border-gray-800 bg-gray-900/60 p-6 shadow-xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border border-gray-800 bg-gray-950 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                {partner.profile_image_url ? (
                  <img src={partner.profile_image_url} alt={partner.first_name} className="h-full w-full object-cover" />
                ) : (
                  <Bike className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div>
                <h1 className="text-base font-bold text-white flex items-center gap-2">
                  {partner.first_name} {partner.last_name}
                </h1>
                <span className="text-xs text-gray-400">Field Delivery Executive</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                    partner.is_available ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {partner.is_available ? "On Duty / Available" : "Off Duty / Busy"}
                  </span>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                    partner.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>
                    {partner.is_active ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-y md:border-y-0 md:border-x border-gray-800 py-4 md:py-0 md:px-6">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Phone className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                <span>{partner.phone_number || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Mail className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                <span>{partner.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                <span>DOB: {partner.date_of_birth || "N/A"} ({partner.gender || "N/A"})</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-gray-800 bg-gray-950/60 p-2.5">
                <div className="text-[10px] text-gray-400">Rating</div>
                <div className="text-sm font-bold text-yellow-400 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  {partner.average_rating || "0.00"}
                </div>
              </div>
              <div className="rounded-md border border-gray-800 bg-gray-950/60 p-2.5">
                <div className="text-[10px] text-gray-400">Completed</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {partner.completed_deliveries || 0}
                </div>
              </div>
              <div className="rounded-md border border-gray-800 bg-gray-950/60 p-2.5">
                <div className="text-[10px] text-gray-400">Cancelled</div>
                <div className="text-sm font-bold text-rose-400 mt-0.5">
                  {partner.cancelled_deliveries || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Deliveries & Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Delivery History with Date Filter */}
            <div className="lg:col-span-2 space-y-4 rounded-md border border-gray-800 bg-gray-900/60 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="h-4 w-4 text-yellow-500" /> Delivery History & Timeline
                </h3>

                {/* Date Filter Buttons */}
                <div className="flex items-center gap-1.5">
                  {["ALL", "TODAY", "YESTERDAY"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setDateFilter(filter)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                        dateFilter === filter
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 font-semibold"
                          : "bg-gray-950/40 border-gray-800 text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border border-gray-800 bg-gray-950/40">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-medium text-gray-400">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items Summary</th>
                      <th className="py-2.5 px-3 text-center">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-semibold text-yellow-400">{item.id}</td>
                          <td className="py-2.5 px-3 text-white">{item.customer}</td>
                          <td className="py-2.5 px-3 text-gray-400">{item.items}</td>
                          <td className="py-2.5 px-3 text-center font-medium text-gray-200">{item.amount}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium border ${
                              item.status === "Delivered"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500 text-xs">
                          No delivery records found for this timeframe.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 Col: Customer Feedbacks & Complaints */}
            <div className="space-y-4 rounded-md border border-gray-800 bg-gray-900/60 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" /> Customer Feedback & Complaints
              </h3>

              <div className="space-y-3">
                {DUMMY_FEEDBACKS.map((fb) => (
                  <div key={fb.id} className="rounded-md border border-gray-800 bg-gray-950/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{fb.customer}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                        fb.type === "Complaint" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {fb.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">"{fb.comment}"</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500">
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <span>{fb.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* Update Modal */}
      <UpdateDeliveryPartnerModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        partner={partner}
        onSuccess={() => {
          refetch();
          setIsUpdateModalOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Delivery Partner"
        message={`Are you sure you want to delete delivery partner "${partner?.first_name || ""} ${partner?.last_name || ""}"? This action is permanent and cannot be undone.`}
        isLoading={deletePartnerMutation.isPending}
      />
    </div>
  );
}