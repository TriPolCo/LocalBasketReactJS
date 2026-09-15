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

export default function Grocery() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["products-grocery"],
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

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryName = prod.category?.name || prod.category || "";
    const matchesCategory = categoryName.toString().toLowerCase() === "grocery";
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Grocery
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your store grocery inventory, variants, pricing, and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Grocery Item</span>
        </button>
      </div>

      <div className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-900/50 p-3 shadow-sm backdrop-blur-xl">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search grocery by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-800 bg-gray-950/60 pl-9 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-colors"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading grocery items...</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400">
          Failed to load grocery items. Please check your network or try again.
        </div>
      )}

      {!isLoading && !isError && filteredProducts.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-gray-400 space-y-2">
          <Package className="h-8 w-8 text-gray-600" />
          <p className="text-xs font-medium">No grocery items found. Click "Add Grocery Item" to create one.</p>
        </div>
      )}

      {!isLoading && !isError && filteredProducts.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-gray-800 bg-gray-900/50 shadow-sm backdrop-blur-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-950/60 text-[11px] font-medium text-gray-400">
              <tr>
                <th className="py-3 pl-4 pr-2 w-10">#</th>
                <th className="py-3 px-3 w-14">Image</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-center">Variants</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredProducts.map((product, index) => {
                const isActive = product.is_active;
                const variantsCount = product.variants?.length || 0;
                const imageUrl = product.image?.image_url || product.thumbnail;

                return (
                  <tr key={product.id || index} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 pl-4 pr-2 font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-9 w-9 rounded-md border border-gray-800 bg-gray-950 overflow-hidden flex items-center justify-center shrink-0">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <Package className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {product.name}
                    </td>
                    <td className="py-3 px-3 text-gray-400 truncate max-w-xs">
                      {product.description || "No description"}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-gray-300">
                      {variantsCount}
                    </td>
                    <td className="py-3 px-3 text-center">
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
                    <td className="py-3 pl-3 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`View details for product: ${product.name}`)}
                        className="rounded-md border border-gray-800 bg-gray-950 px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
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

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}