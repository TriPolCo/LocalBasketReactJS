import { useState, useEffect } from "react";
import { X, Loader2, Layers, Upload } from "lucide-react";
import { useCreateFoodCategory } from "../../hooks/foods/useCreateFoodCategory";

export default function AddFoodCategoryModal({ isOpen, onClose, onSuccess }) {
  const createCategoryMutation = useCreateFoodCategory();

  const [form, setForm] = useState({
    name: "",
    description: "",
    display_order: 1,
    is_active: true,
    image_url: "",
    cloudinary_public_id: ""
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        description: "",
        display_order: 1,
        is_active: true,
        image_url: "",
        cloudinary_public_id: ""
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "localbasket_preset"); // Update to your preset

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dup5b38zp/image/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setForm((prev) => ({
        ...prev,
        image_url: data.secure_url,
        cloudinary_public_id: data.public_id
      }));
    } catch (error) {
      alert(error.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name,
      description: form.description,
      display_order: parseInt(form.display_order) || 1,
      is_active: form.is_active,
      image_url: form.image_url,
      cloudinary_public_id: form.cloudinary_public_id
    };

    createCategoryMutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        alert(error?.message || "Failed to create food category.");
      }
    });
  };

  const isLoading = createCategoryMutation.isPending || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-[#030712] p-6 shadow-2xl space-y-4 my-8 text-slate-100">
        
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Layers className="h-4 w-4 text-yellow-500" /> Add New Food Category
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name</label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="e.g. Biryani & Rice"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
              <input
                type="number"
                disabled={isLoading}
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-yellow-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category Image</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0b0f19] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition">
                  <Upload className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{isUploading ? "Uploading..." : "Upload"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isLoading} />
                </label>
                {form.image_url && <span className="text-[10px] text-emerald-400 truncate max-w-[100px]">Uploaded!</span>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="2"
              disabled={isLoading}
              placeholder="Biryani and rice dishes..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500 transition"
            />
          </div>

          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border-slate-800 bg-[#0b0f19] text-yellow-500 focus:ring-0"
              />
              Active Status
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-slate-800 bg-transparent px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-[#030712] shadow-lg shadow-yellow-500/10 hover:bg-yellow-400 disabled:opacity-50 transition"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}