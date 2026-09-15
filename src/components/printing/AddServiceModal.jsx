import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Select from "react-select";

export default function AddServiceModal({ isOpen, onClose, onSave, service, mode = "create", isLoading = false }) {
  const [form, setForm] = useState({
    service_type: "PRINT",
    name: "",
    subtitle: "",
    description: "",
    display_order: 1
  });

  useEffect(() => {
    if (mode === "edit" && service) {
      setForm({
        service_type: service.service_type || "PRINT",
        name: service.name || "",
        subtitle: service.subtitle || "",
        description: service.description || "",
        display_order: service.display_order || 1
      });
    } else {
      setForm({
        service_type: "PRINT",
        name: "",
        subtitle: "",
        description: "",
        display_order: 1
      });
    }
  }, [isOpen, mode, service]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  // Custom react-select dark theme styles matching dashboard UI
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#030712", // bg-gray-950/60 approximation
      borderColor: state.isFocused ? "#eab308" : "#1f2937", // yellow-500 on focus, gray-800 default
      borderRadius: "0.5rem",
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
      borderRadius: "0.5rem",
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

  const serviceTypeOptions = [
    { label: "PRINT", value: "PRINT" },
    { label: "XEROX", value: "XEROX" },
    { label: "SCAN", value: "SCAN" },
    { label: "OTHER", value: "OTHER" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 animate-in fade-in duration-200 text-gray-100">
      <div className="relative w-full max-w-md rounded-md border border-gray-800 bg-gray-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-base font-bold text-white">
          {mode === "create" ? "Add New Print Service" : "Edit Print Service"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Service Type
            </label>
            <Select
              isDisabled={isLoading}
              options={serviceTypeOptions}
              value={serviceTypeOptions.find((opt) => opt.value === form.service_type)}
              onChange={(selected) => setForm({ ...form, service_type: selected.value })}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="e.g. Print, Xerox, Scan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              disabled={isLoading}
              placeholder="e.g. Color / B&W, Quick Copies"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              disabled={isLoading}
              placeholder="Describe document processing specifications..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Display Order
            </label>
            <input
              type="number"
              disabled={isLoading}
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm hover:bg-yellow-400 disabled:opacity-50 transition-all"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === "create" ? "Create Service" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}