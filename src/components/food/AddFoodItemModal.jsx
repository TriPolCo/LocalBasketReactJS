import { useState, useEffect } from "react";
import { X, Loader2, UtensilsCrossed, Plus, Trash2, Upload } from "lucide-react";
import Select from "react-select";
import { useFoodCategories } from "../../hooks/foods/useFoodCategories";
import { useCreateFoodItem } from "../../hooks/foods/useCreateFoodItem";

export default function AddFoodItemModal({ isOpen, onClose, onSuccess }) {
  const { categories: rawCategories, loading: categoriesLoading } = useFoodCategories();
  const createFoodItemMutation = useCreateFoodItem();

  const categoriesList = Array.isArray(rawCategories)
    ? rawCategories
    : rawCategories?.data || [];

  const categoryOptions = categoriesList.map((cat) => ({
    label: cat.name,
    value: cat.id
  }));

  const foodTypeOptions = [
    { label: "VEG", value: "VEG" },
    { label: "NON_VEG", value: "NON_VEG" }
  ];

  const [form, setForm] = useState({
    name: "",
    category: null,
    description: "",
    food_type: "VEG",
    preparation_time: "25",
    is_available: true,
    is_active: true,
    is_bestseller: false,
    is_recommended: false,
    image_url: "",
    cloudinary_public_id: "",
    variants: [
      { name: "Half", price: "", is_default: true, is_available: true, display_order: 1 },
      { name: "Full", price: "", is_default: false, is_available: true, display_order: 2 }
    ],
    addons: []
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        category: null,
        description: "",
        food_type: "VEG",
        preparation_time: "25",
        is_available: true,
        is_active: true,
        is_bestseller: false,
        is_recommended: false,
        image_url: "",
        cloudinary_public_id: "",
        variants: [
          { name: "Half", price: "", is_default: true, is_available: true, display_order: 1 },
          { name: "Full", price: "", is_default: false, is_available: true, display_order: 2 }
        ],
        addons: []
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Cloudinary image upload handler matching your product modal implementation format
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "localbasket_preset"); // Update preset as needed

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dup5b38zp/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setForm((prev) => ({
        ...prev,
        image_url: data.secure_url,
        cloudinary_public_id: data.public_id,
      }));
    } catch (error) {
      alert(error.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddAddon = () => {
    setForm({
      ...form,
      addons: [
        ...form.addons,
        { name: "", price: "", max_quantity: 2, is_required: false, is_available: true, display_order: form.addons.length + 1 }
      ]
    });
  };

  const handleRemoveAddon = (index) => {
    const updatedAddons = form.addons.filter((_, i) => i !== index);
    setForm({ ...form, addons: updatedAddons });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      alert("Please provide a name and select a category.");
      return;
    }

    const payload = {
      category: form.category.value,
      name: form.name,
      description: form.description,
      food_type: form.food_type,
      image_url: form.image_url,
      cloudinary_public_id: form.cloudinary_public_id,
      is_available: form.is_available,
      is_active: form.is_active,
      is_bestseller: form.is_bestseller,
      is_recommended: form.is_recommended,
      preparation_time: parseInt(form.preparation_time) || 15,
      variants: form.variants.map((v, i) => ({
        ...v,
        display_order: i + 1
      })),
      addons: form.addons.map((a, i) => ({
        ...a,
        display_order: i + 1
      }))
    };

    createFoodItemMutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        alert(error?.message || "Failed to create food item.");
      }
    });
  };

  const isLoading = createFoodItemMutation.isPending || isUploading;

  // Custom select styles matching your dark theme layout
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "32px",
      height: "32px",
      fontSize: "12px",
      backgroundColor: "#0b0f19",
      borderColor: state.isFocused ? "#eab308" : "#1e293b",
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "#eab308" : "#334155",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 8px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f8fafc",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      color: "#f8fafc",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#64748b",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
      color: "#64748b",
      "&:hover": { color: "#94a3b8" },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "4px",
      color: "#64748b",
      "&:hover": { color: "#94a3b8" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0b0f19",
      border: "1px solid #1e293b",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      backgroundColor: state.isSelected 
        ? "#eab308" 
        : state.isFocused 
        ? "#1e293b" 
        : "#0b0f19",
      color: state.isSelected ? "#030712" : "#f8fafc",
      "&:active": {
        backgroundColor: "#ca8a04",
      },
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-md border border-slate-800 bg-[#030712] p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto text-slate-100">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h3 className="text-base font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-yellow-500" /> Add New Food Item
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name</label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="e.g. Chicken Biryani Special"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-slate-800 bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <Select
                isDisabled={isLoading || categoriesLoading}
                options={categoryOptions}
                value={form.category}
                onChange={(selected) => setForm({ ...form, category: selected })}
                styles={customSelectStyles}
                placeholder="Select category..."
                isSearchable={true}
                isClearable
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Food Type</label>
              <Select
                isDisabled={isLoading}
                options={foodTypeOptions}
                value={foodTypeOptions.find((opt) => opt.value === form.food_type)}
                onChange={(selected) => setForm({ ...form, food_type: selected.value })}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prep Time (minutes)</label>
              <input
                type="number"
                disabled={isLoading}
                value={form.preparation_time}
                onChange={(e) => setForm({ ...form, preparation_time: e.target.value })}
                className="w-full rounded-md border border-slate-800 bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-yellow-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Item Image</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0b0f19] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition">
                  <Upload className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isLoading} />
                </label>
                {form.image_url && <span className="text-[10px] text-emerald-400 truncate max-w-[120px]">Uploaded!</span>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="2"
              disabled={isLoading}
              placeholder="Aromatic basmati rice cooked with tender chicken..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-slate-800 bg-[#0b0f19] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500 transition"
            />
          </div>

          {/* Variants Section */}
          <div className="space-y-2 border-t border-slate-800/80 pt-3">
            <label className="block text-xs font-bold text-yellow-500 uppercase tracking-wider">
              Variants (First variant is Default)
            </label>
            {form.variants.map((variant, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-md border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 w-16">
                  {index === 0 ? "Default" : `Var ${index + 1}`}
                </span>
                <input
                  type="text"
                  required
                  placeholder="Variant Name (e.g. Half)"
                  value={variant.name}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[index].name = e.target.value;
                    setForm({ ...form, variants: newVariants });
                  }}
                  className="w-1/2 rounded-md border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-yellow-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Price (₹)"
                  value={variant.price}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[index].price = e.target.value;
                    setForm({ ...form, variants: newVariants });
                  }}
                  className="w-1/2 rounded-md border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-yellow-500"
                />
              </div>
            ))}
          </div>

          {/* Addons Section */}
          <div className="space-y-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-yellow-500 uppercase tracking-wider">
                Addons (Optional)
              </label>
              <button
                type="button"
                onClick={handleAddAddon}
                className="inline-flex items-center gap-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs font-semibold text-yellow-400 hover:bg-yellow-500/20 transition"
              >
                <Plus className="h-3 w-3" /> Add Addon
              </button>
            </div>

            {form.addons.map((addon, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <input
                  type="text"
                  required
                  placeholder="Addon Name (e.g. Extra Raita)"
                  value={addon.name}
                  onChange={(e) => {
                    const newAddons = [...form.addons];
                    newAddons[index].name = e.target.value;
                    setForm({ ...form, addons: newAddons });
                  }}
                  className="w-3/5 rounded-md border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-yellow-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Price (₹)"
                  value={addon.price}
                  onChange={(e) => {
                    const newAddons = [...form.addons];
                    newAddons[index].price = e.target.value;
                    setForm({ ...form, addons: newAddons });
                  }}
                  className="w-2/5 rounded-md border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-yellow-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAddon(index)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-slate-800/80">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={form.is_bestseller}
                onChange={(e) => setForm({ ...form, is_bestseller: e.target.checked })}
                className="rounded-md border-slate-800 bg-[#0b0f19] text-yellow-500 focus:ring-0"
              />
              Bestseller
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={form.is_recommended}
                onChange={(e) => setForm({ ...form, is_recommended: e.target.checked })}
                className="rounded-md border-slate-800 bg-[#0b0f19] text-yellow-500 focus:ring-0"
              />
              Recommended
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-slate-800 bg-transparent px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-[#030712] shadow-lg shadow-yellow-500/10 hover:bg-yellow-400 disabled:opacity-50 transition"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Food Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}