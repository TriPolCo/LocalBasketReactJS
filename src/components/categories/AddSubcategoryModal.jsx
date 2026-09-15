import { useState, useEffect } from "react";
import { X, FolderTree, Plus, Loader2 } from "lucide-react";
import { useCreateSubcategory } from "../../hooks/categories/useCreateSubcategory"; 

export default function AddSubcategoryModal({ isOpen, onClose, category }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { mutate: createSubcategory, isPending } = useCreateSubcategory();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Subcategory name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Subcategory name must be at least 2 characters.");
      return;
    }

    // Trigger mutation: { categoryId, payload }
    createSubcategory(
      {
        categoryId: category.id,
        payload: { name: trimmedName },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to create subcategory. Please try again.";
          setError(message);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={!isPending ? onClose : undefined}
        className="fixed inset-0 bg-slate-900/50  transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-slate-100 bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          disabled={isPending}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <FolderTree className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Add Subcategory
            </h3>
            <p className="text-xs text-slate-500">
              Adding item under{" "}
              <span className="font-semibold text-violet-700">
                {category.name}
              </span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="subcategoryName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Subcategory Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="subcategoryName"
              type="text"
              autoFocus
              disabled={isPending}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Leafy Vegetables, Root Vegetables"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:bg-slate-50"
            />
            {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Subcategory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}