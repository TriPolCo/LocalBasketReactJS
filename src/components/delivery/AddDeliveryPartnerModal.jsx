import { useState, useEffect } from "react";
import { X, Loader2, Bike } from "lucide-react";
import Select from "react-select";

export default function AddDeliveryPartnerModal({ isOpen, onClose, onSuccess, isLoading = false }) {
  const vehicleTypeOptions = [
    { label: "Electric Scooter", value: "Electric Scooter" },
    { label: "Motorcycle", value: "Motorcycle" },
    { label: "Bicycle", value: "Bicycle" },
    { label: "Car / Van", value: "Car / Van" }
  ];

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    vehicle_type: vehicleTypeOptions[0],
    vehicle_number: "",
    current_location: ""
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        vehicle_type: vehicleTypeOptions[0],
        vehicle_number: "",
        current_location: ""
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.phone_number.trim()) {
      alert("Please provide at least a first name and phone number.");
      return;
    }

    const payload = {
      ...form,
      vehicle_type: form.vehicle_type?.value || "Electric Scooter"
    };

    if (onSuccess) {
      onSuccess(payload);
    } else {
      console.log("New Delivery Partner Payload:", payload);
      alert(`Delivery Partner "${form.first_name} ${form.last_name}" added successfully!`);
      onClose();
    }
  };

  // Custom dark theme styles matching dashboard UI
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#030712",
      borderColor: state.isFocused ? "#eab308" : "#1f2937",
      borderRadius: "0.375rem",
      padding: "1px 2px",
      fontSize: "12px",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: state.isFocused ? "#eab308" : "#374151"
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#030712",
      border: "1px solid #1f2937",
      borderRadius: "0.375rem",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      zIndex: 50
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#eab308"
        : state.isFocused
        ? "#111827"
        : "#030712",
      color: state.isSelected ? "#000000" : "#f3f4f6",
      fontSize: "12px",
      cursor: "pointer",
      padding: "8px 12px"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f3f4f6",
      fontSize: "12px"
    }),
    input: (provided) => ({
      ...provided,
      color: "#f3f4f6",
      fontSize: "12px"
    }),
    indicatorSeparator: () => ({
      display: "none"
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#f3f4f6"
      }
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 animate-in fade-in duration-200 text-gray-100">
      <div className="relative w-full max-w-lg rounded-md border border-gray-800 bg-gray-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bike className="h-4 w-4 text-yellow-500" /> Add New Delivery Partner
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="e.g. Rahul"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="e.g. Verma"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled={isLoading}
                placeholder="rahul.verma@deliver.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="9876543210"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Vehicle Type
              </label>
              <Select
                isDisabled={isLoading}
                options={vehicleTypeOptions}
                value={form.vehicle_type}
                onChange={(selected) => setForm({ ...form, vehicle_type: selected })}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Vehicle Number / Plate
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="DL-08-EV-4321"
                value={form.vehicle_number}
                onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Initial Operating Location / Base Hub
            </label>
            <input
              type="text"
              disabled={isLoading}
              placeholder="e.g. Noida Sector 62"
              value={form.current_location}
              onChange={(e) => setForm({ ...form, current_location: e.target.value })}
              className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-gray-800 bg-gray-950/60 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm hover:bg-yellow-400 disabled:opacity-50 transition-all"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Delivery Partner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}