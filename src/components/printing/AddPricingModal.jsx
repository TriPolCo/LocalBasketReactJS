import { useState, useEffect } from "react";
import { X, Loader2, DollarSign } from "lucide-react";
import Select from "react-select";

export default function AddPricingModal({ isOpen, onClose, onSave, isLoading = false }) {
  const [form, setForm] = useState({
    color_type: "BLACK_WHITE",
    paper_size: "A4",
    print_side: "SINGLE",
    price_per_page: "",
    minimum_charge: "0.00"
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        color_type: "BLACK_WHITE",
        paper_size: "A4",
        print_side: "SINGLE",
        price_per_page: "",
        minimum_charge: "0.00"
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.price_per_page.trim()) return;
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

  const colorOptions = [
    { label: "BLACK & WHITE", value: "BLACK_WHITE" },
    { label: "COLOR", value: "COLOR" }
  ];

  const paperSizeOptions = [
    { label: "A4", value: "A4" },
    { label: "A3", value: "A3" },
    { label: "A5", value: "A5" }
  ];

  const printSideOptions = [
    { label: "SINGLE SIDED", value: "SINGLE" },
    { label: "DOUBLE SIDED", value: "DOUBLE" }
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

        <h3 className="text-base font-bold text-white flex items-center gap-2">
          Add Pricing Rule
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Color Type
            </label>
            <Select
              isDisabled={isLoading}
              options={colorOptions}
              value={colorOptions.find((opt) => opt.value === form.color_type)}
              onChange={(selected) => setForm({ ...form, color_type: selected.value })}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Paper Size
            </label>
            <Select
              isDisabled={isLoading}
              options={paperSizeOptions}
              value={paperSizeOptions.find((opt) => opt.value === form.paper_size)}
              onChange={(selected) => setForm({ ...form, paper_size: selected.value })}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Print Side
            </label>
            <Select
              isDisabled={isLoading}
              options={printSideOptions}
              value={printSideOptions.find((opt) => opt.value === form.print_side)}
              onChange={(selected) => setForm({ ...form, print_side: selected.value })}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Price Per Page (₹)
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="e.g. 3.00"
              value={form.price_per_page}
              onChange={(e) => setForm({ ...form, price_per_page: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>

          {/* <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Minimum Charge (₹)
            </label>
            <input
              type="text"
              disabled={isLoading}
              placeholder="e.g. 0.00"
              value={form.minimum_charge}
              onChange={(e) => setForm({ ...form, minimum_charge: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>*/}

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
              <span>Save Pricing Rule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}