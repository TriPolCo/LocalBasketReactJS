import { useState } from "react";
import {
  Plus,
  Loader2,
  Layers,
  Search,
  Tag,
  Pencil,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import { useFoodCategories } from "../hooks/foods/useFoodCategories";
import { useDeleteFoodCategory } from "../hooks/foods/useDeleteFoodCategory";
import AddFoodCategoryModal from "../components/food/AddFoodCategoryModal";

export default function FoodCategories() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { categories: rawCategories, loading: isLoading, error, refetch } = useFoodCategories();
  const deleteCategoryMutation = useDeleteFoodCategory();

  const categoriesList = Array.isArray(rawCategories)
    ? rawCategories
    : rawCategories?.data || [];

  const filteredCategories = categoriesList.filter((cat) => {
    const matchesSearch = cat.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategoryMutation.mutate(id, {
        onSuccess: () => {
          refetch();
        },
        onError: (err) => {
          alert(err?.message || "Failed to delete category.");
        }
      });
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-yellow-500" /> Food Categories
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage menu categories, display sequence, and category statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/60 p-3 shadow-lg backdrop-blur-xl">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950/60 pl-9 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading food categories...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400">
          {error || "Failed to load categories. Please check your network or try again."}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900/40 p-6 text-center text-xs font-medium text-gray-400 space-y-2">
          <Layers className="h-8 w-8 text-gray-600" />
          <p>No food categories found. Click "Add Category" to create one.</p>
        </div>
      )}

      {/* Categories Table Grid */}
      {!isLoading && !error && filteredCategories.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50 shadow-lg backdrop-blur-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-medium text-gray-400">
              <tr>
                <th className="py-3 pl-4 pr-2 w-10">#</th>
                <th className="py-3 px-3 w-14">Image</th>
                <th className="py-3 px-3">Category Name</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-center">Display Order</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredCategories.map((category, index) => {
                const isActive = category.is_active;
                const imageUrl = category.image_url;

                return (
                  <tr key={category.id || index} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 pl-4 pr-2 font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-9 w-9 rounded-lg border border-gray-800 bg-gray-950 overflow-hidden flex items-center justify-center shrink-0">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={category.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {category.name}
                    </td>
                    <td className="py-3 px-3 text-gray-400 truncate max-w-xs">
                      {category.description || "No description provided"}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-300">
                      {category.display_order ?? "-"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[64px] rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => alert(`Edit category: ${category.name}`)}
                        className="rounded-lg border border-gray-800 bg-gray-950/60 p-1.5 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        title="Edit Category"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id, category.name)}
                        className="rounded-lg border border-gray-800 bg-gray-950/60 p-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      <AddFoodCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}