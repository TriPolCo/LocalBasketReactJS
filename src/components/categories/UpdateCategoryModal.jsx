import { useState, useEffect } from "react";
import { X, Pencil, Check, Loader2 } from "lucide-react";
import { useUpdateCategory } from "../../hooks/categories/useUpdateCategory"; 

export default function UpdateCategoryModal({ isOpen, onClose, category }) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  const { mutate: updateCategory, isPending } = useUpdateCategory();

  // Populate form with existing category data when modal opens
  useEffect(() => {
    if (isOpen && category) {
      setName(category.name || "");
      setIsActive(Boolean(category.is_active));
      setError("");
    }
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Category name must be at least 2 characters.");
      return;
    }

    // Trigger update mutation
    updateCategory(
      {
        categoryId: category.id,
        payload: {
          name: trimmedName,
          is_active: isActive,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to update category. Please try again.";
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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
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
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Edit Category
            </h3>
            <p className="text-xs text-slate-500">
              Update details for{" "}
              <span className="font-semibold text-violet-700">
                {category.name}
              </span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="editCategoryName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="editCategoryName"
              type="text"
              autoFocus
              disabled={isPending}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Vegetables, Grocery"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:bg-slate-50"
            />
            {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
          </div>

          {/* Status Toggle Field */}
          <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">Category Status</p>
              <p className="text-[11px] text-slate-400">
                Enable or disable this category and all its items
              </p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                isActive ? "bg-violet-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}