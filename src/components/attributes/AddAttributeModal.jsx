import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function AddAttributeModal({ isOpen, onClose, onSave, attribute, mode = "create", isLoading = false }) {
  const [form, setForm] = useState({ name: "", code: "" });

  useEffect(() => {
    if (mode === "edit" && attribute) {
      setForm({ name: attribute.name || "", code: attribute.code || "" });
    } else {
      setForm({ name: "", code: "" });
    }
  }, [isOpen, mode, attribute]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4  animate-in fade-in duration-200 text-gray-100">
      <div className="relative w-full max-w-md rounded-md border border-gray-800 bg-gray-900 p-6 shadow-2xl space-y-4">
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
          {mode === "create" ? "Add New Attribute" : "Edit Attribute"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Attribute Name
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="e.g. Size, Material, Color"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Code / Slug (Optional)
            </label>
            <input
              type="text"
              disabled={isLoading}
              placeholder="e.g. size, material"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
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
              <span>{mode === "create" ? "Create Attribute" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}