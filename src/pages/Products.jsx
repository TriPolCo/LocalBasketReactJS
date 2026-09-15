import { useState } from "react";
import {
  Plus,
  Loader2,
  Package,
  Search
} from "lucide-react";
import AddProductModal from "../components/products/AddProductModal";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/handler/apiClient";

export default function Products() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get("/products/");
      return res.data;
    },
  });

  const products = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  const filteredProducts = products.filter((prod) =>
    prod.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store inventory, variants, pricing, and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-3 shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            <span>Loading products...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-100 bg-rose-50/50 p-6 text-center text-xs font-medium text-rose-600">
          Failed to load products. Please check your network or try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProducts.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-slate-200 bg-white p-6 text-center text-slate-400 space-y-2">
          <Package className="h-8 w-8 text-slate-300" />
          <p className="text-xs font-medium">No products found. Click "Add Product" to create one.</p>
        </div>
      )}

      {/* Products Table */}
      {!isLoading && !isError && filteredProducts.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-medium text-slate-400">
              <tr>
                <th className="py-3 pl-4 pr-2 w-10">#</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-center">Variants</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product, index) => {
                const isActive = product.is_active;
                const variantsCount = product.variants?.length || 0;

                return (
                  <tr key={product.id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pl-4 pr-2 font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {product.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-xs">
                      {product.description || "No description"}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700">
                      {variantsCount}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[64px] rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide ${
                          isActive
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20"
                            : "bg-rose-50 text-rose-600 ring-1 ring-rose-500/20"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`View details for product: ${product.name}`)}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}