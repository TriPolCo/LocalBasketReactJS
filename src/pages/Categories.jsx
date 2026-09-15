import { useState, useEffect, useRef } from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronRight,
  Leaf,
  ShoppingBag,
  Utensils,
  Tv,
  Printer,
  BookOpen,
  Layers,
  Loader2,
  Power,
} from "lucide-react";
import AddMainCategoryModal from "../components/categories/AddMainCategoryModal";
import AddSubcategoryModal from "../components/categories/AddSubcategoryModal";
import UpdateCategoryModal from "../components/categories/UpdateCategoryModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";

import { useCategoryTree } from "../hooks/categories/useCategoryTree";
import { useDeleteCategory } from "../hooks/categories/useDeleteCategory";
import { useDeleteSubcategory } from "../hooks/categories/useDeleteSubcategory";

const getCategoryDesign = (name = "") => {
  const normalized = name.toLowerCase();

  if (normalized.includes("veg")) {
    return { icon: Leaf, iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" };
  }
  if (normalized.includes("grocery") || normalized.includes("rice")) {
    return { icon: ShoppingBag, iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20" };
  }
  if (normalized.includes("food")) {
    return { icon: Utensils, iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20" };
  }
  if (normalized.includes("electronic")) {
    return { icon: Tv, iconBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
  }
  if (normalized.includes("print") || normalized.includes("stationery")) {
    return { icon: Printer, iconBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" };
  }
  if (normalized.includes("book")) {
    return { icon: BookOpen, iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20" };
  }

  return { icon: Layers, iconBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" };
};

export default function Categories() {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [subModalState, setSubModalState] = useState({
    isOpen: false,
    selectedCategory: null,
  });
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    category: null,
  });

  // Universal Delete Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    type: null, // "category" or "subcategory"
    id: null,
    title: "",
    message: "",
  });

  // Track which card's 3-dot action menu is open
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const { data: response, isLoading, isError } = useCategoryTree();
  
  const deleteCategoryMutation = useDeleteCategory();
  const deleteSubcategoryMutation = useDeleteSubcategory();

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  const handleEditMainCategory = (category) => {
    setActiveMenuId(null);
    setEditModalState({
      isOpen: true,
      category: category,
    });
  };

  const promptDeleteCategory = (category) => {
    setActiveMenuId(null);
    setDeleteModalState({
      isOpen: true,
      type: "category",
      id: category.id,
      title: "Delete Category?",
      message: `Are you sure you want to delete "${category.name}" and all of its subcategories?`,
    });
  };

  const promptDeleteSubcategory = (sub) => {
    setDeleteModalState({
      isOpen: true,
      type: "subcategory",
      id: sub.id,
      title: "Delete Subcategory?",
      message: `Are you sure you want to remove subcategory "${sub.name}"?`,
    });
  };

  const handleConfirmDelete = () => {
    const { type, id } = deleteModalState;

    if (type === "category") {
      deleteCategoryMutation.mutate(id, {
        onSuccess: () => {
          setDeleteModalState({ isOpen: false, type: null, id: null, title: "", message: "" });
        },
        onError: (error) => {
          alert(error?.message || "Failed to delete category.");
        },
      });
    } else if (type === "subcategory") {
      deleteSubcategoryMutation.mutate(id, {
        onSuccess: () => {
          setDeleteModalState({ isOpen: false, type: null, id: null, title: "", message: "" });
        },
        onError: (error) => {
          alert(error?.message || "Failed to delete subcategory.");
        },
      });
    }
  };

  const handleToggleStatus = (category) => {
    setActiveMenuId(null);
    console.log("Toggle Status for Category:", category.id, !category.is_active);
  };

  const handleEditSubcategory = (sub, parentCategory) => {
    console.log("Edit Subcategory:", sub.name, "under parent:", parentCategory.name);
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Categories
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage all product categories, subcategories and their order.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMainModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Main Category</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading categories...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400">
          Failed to load category tree. Please check your network or try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-gray-400 space-y-2">
          <Layers className="h-8 w-8 text-gray-600" />
          <p className="text-xs font-medium">No categories found. Click "Add Main Category" to create one.</p>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {categories.map((category) => {
            const { icon: Icon, iconBg } = getCategoryDesign(category.name);
            const subcategories = category.subcategories || [];
            const subCount = category.subcategory_count ?? subcategories.length;
            const isMenuOpen = activeMenuId === category.id;

            return (
              <div
                key={category.id}
                className="flex flex-col justify-between rounded-md border border-gray-800 bg-gray-900/50 shadow-sm backdrop-blur-xl"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-gray-800 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-md shadow-sm ${iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">
                        {category.name}
                      </h2>
                      <p className="text-[11px] text-gray-400">
                        {subCount} Subcategories
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 relative">
                    <button
                      type="button"
                      onClick={() =>
                        setSubModalState({
                          isOpen: true,
                          selectedCategory: category,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white focus:outline-none"
                    >
                      <Plus className="h-3 w-3 text-gray-400" />
                      <span>Add Subcategory</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(isMenuOpen ? null : category.id)
                      }
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition focus:outline-none"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* 3-Dot Dropdown Menu */}
                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-9 z-20 w-44 rounded-md border border-gray-800 bg-gray-950 py-1.5 shadow-xl"
                      >
                        <button
                          type="button"
                          onClick={() => handleEditMainCategory(category)}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
                        >
                          <Pencil className="h-3.5 w-3.5 text-gray-400" />
                          <span>Edit Name</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(category)}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
                        >
                          <Power className="h-3.5 w-3.5 text-gray-400" />
                          <span>
                            Set as {category.is_active ? "Inactive" : "Active"}
                          </span>
                        </button>

                        <div className="my-1 border-t border-gray-800" />

                        <button
                          type="button"
                          onClick={() => promptDeleteCategory(category)}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                          <span>Delete Category</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subcategories Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="border-b border-gray-800 bg-gray-950/60 text-[11px] font-medium text-gray-400">
                      <tr>
                        <th className="py-2.5 pl-4 pr-2 w-10">#</th>
                        <th className="py-2.5 px-3">Subcategory Name</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-center">Products</th>
                        <th className="py-2.5 pl-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {subcategories.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-xs text-gray-500"
                          >
                            No subcategories added yet.
                          </td>
                        </tr>
                      ) : (
                        subcategories.map((sub, index) => {
                          const isActive = sub.is_active;
                          return (
                            <tr
                              key={sub.id}
                              className="hover:bg-gray-800/40 transition-colors"
                            >
                              <td className="py-2.5 pl-4 pr-2 font-medium text-gray-500">
                                {index + 1}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-white">
                                {sub.name}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`inline-flex items-center justify-center min-w-[64px] rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide border ${
                                    isActive
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  }`}
                                >
                                  {isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center text-gray-300">
                                {sub.product_count ?? 0}
                              </td>
                              <td className="py-2.5 pl-3 pr-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditSubcategory(sub, category)}
                                    title="Edit subcategory"
                                    className="rounded-md border border-gray-800 bg-gray-950 p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => promptDeleteSubcategory(sub)}
                                    title="Delete subcategory"
                                    className="rounded-md border border-gray-800 bg-gray-950 p-1 text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Card Footer */}
                <div className="border-t border-gray-800 px-4 py-2.5 bg-gray-950/30">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-xs font-medium text-yellow-500 hover:text-yellow-400 transition"
                  >
                    <span>View All ({subCount})</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Main Category Modal */}
      <AddMainCategoryModal
        isOpen={isMainModalOpen}
        onClose={() => setIsMainModalOpen(false)}
      />

      {/* Update Main Category Modal */}
      <UpdateCategoryModal
        isOpen={editModalState.isOpen}
        category={editModalState.category}
        onClose={() => setEditModalState({ isOpen: false, category: null })}
      />

      {/* Add Subcategory Modal */}
      <AddSubcategoryModal
        isOpen={subModalState.isOpen}
        category={subModalState.selectedCategory}
        onClose={() =>
          setSubModalState({ isOpen: false, selectedCategory: null })
        }
      />

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        isLoading={
          deleteCategoryMutation.isPending || deleteSubcategoryMutation.isPending
        }
        onClose={() =>
          setDeleteModalState({ isOpen: false, type: null, id: null, title: "", message: "" })
        }
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}