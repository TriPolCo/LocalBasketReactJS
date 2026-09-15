import { useState } from "react";
import {
  Plus,
  Loader2,
  UtensilsCrossed,
  Search,
  Tag,
  Clock,
  Flame,
  ChevronDown,
  Filter
} from "lucide-react";
import AddFoodItemModal from "../components/food/AddFoodItemModal";
import { useFoodItems } from "../hooks/foods/useFoodItems";

export default function FoodItems() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Filter states for Veg and Non-Veg checkboxes
  const [filterVeg, setFilterVeg] = useState(true);
  const [filterNonVeg, setFilterNonVeg] = useState(true);

  const { items: foodItems, loading: isLoading, error } = useFoodItems();
  const isError = Boolean(error);

  const itemsList = Array.isArray(foodItems) ? foodItems : [];

  const filteredItems = itemsList.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isNonVeg = item.food_type === "NON_VEG";
    const isVeg = !isNonVeg;

    let matchesType = false;
    if (isVeg && filterVeg) matchesType = true;
    if (isNonVeg && filterNonVeg) matchesType = true;

    return matchesSearch && matchesType;
  });

  const handleStatusChange = (itemId, newActiveStatus, e) => {
    e.stopPropagation();
    console.log(`Updating food item ID: ${itemId} status to: ${newActiveStatus ? "Active" : "Inactive"}`);
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Food Menu Items
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your restaurant or store menu items, variants, pricing, and availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Premium Filter & Search Bar Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-xl backdrop-blur-xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search food items by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950/80 pl-10 pr-4 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all shadow-inner"
          />
        </div>

        {/* Premium Veg / Non-Veg Toggle Filter Cards */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mr-2 font-medium">
            <Filter className="h-3.5 w-3.5 text-yellow-500" />
            <span>Filter:</span>
          </div>

          <label className={`flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-all select-none ${
            filterVeg 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm" 
              : "bg-gray-950/40 border-gray-800 text-gray-500 hover:border-gray-700"
          }`}>
            <input
              type="checkbox"
              checked={filterVeg}
              onChange={(e) => setFilterVeg(e.target.checked)}
              className="hidden"
            />
            <span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block shadow-sm" />
            <span className="text-xs font-semibold tracking-wide">Veg</span>
          </label>

          <label className={`flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-all select-none ${
            filterNonVeg 
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-sm" 
              : "bg-gray-950/40 border-gray-800 text-gray-500 hover:border-gray-700"
          }`}>
            <input
              type="checkbox"
              checked={filterNonVeg}
              onChange={(e) => setFilterNonVeg(e.target.checked)}
              className="hidden"
            />
            <span className="h-3 w-3 rounded-sm bg-rose-500 inline-block shadow-sm" />
            <span className="text-xs font-semibold tracking-wide">Non-Veg</span>
          </label>
        </div>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/40 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading food items...</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400 shadow-xl">
          {error || "Failed to load food items. Please check your network or try again."}
        </div>
      )}

      {!isLoading && !isError && filteredItems.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900/40 p-6 text-center text-xs font-medium text-gray-400 space-y-2 shadow-xl">
          <UtensilsCrossed className="h-8 w-8 text-gray-600" />
          <p className="text-xs font-medium">No food items found matching your filter criteria.</p>
        </div>
      )}

      {!isLoading && !isError && filteredItems.length > 0 && (
        <div className="overflow-x-auto overflow-y-visible rounded-xl border border-gray-800 bg-gray-900/50 shadow-xl backdrop-blur-xl min-h-[300px]">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-medium text-gray-400">
              <tr>
                <th className="py-3 pl-4 pr-2 w-10">#</th>
                <th className="py-3 px-3 w-14">Image</th>
                <th className="py-3 px-3">Item Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Variants & Pricing</th>
                <th className="py-3 px-3 text-center">Prep Time</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredItems.map((item, index) => {
                const isActive = item.is_active;
                const isAvailable = item.is_available;
                const imageUrl = item.image_url;
                const categoryName = item.category_name || "General";
                const variants = item.variants || [];
                const itemId = item.id || index;
                const isDropdownOpen = activeDropdown === itemId;

                return (
                  <tr key={itemId} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 pl-4 pr-2 font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-9 w-9 rounded-lg border border-gray-800 bg-gray-950 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={item.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <UtensilsCrossed className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {item.name}
                        {item.food_type === "NON_VEG" ? (
                          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500 inline-block shrink-0 shadow-sm" title="Non-Veg" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block shrink-0 shadow-sm" title="Veg" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {item.is_bestseller && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.2 rounded border border-yellow-500/20 font-medium">
                            <Flame className="h-2.5 w-2.5" /> Bestseller
                          </span>
                        )}
                        {item.is_recommended && (
                          <span className="inline-flex items-center text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/20 font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-800/80 px-2 py-0.5 text-[11px] text-yellow-400">
                        <Tag className="h-3 w-3" /> {categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        {variants.map((variant) => (
                          <div key={variant.id} className="flex items-center justify-between text-[11px] gap-2">
                            <span className="text-gray-300 font-medium">{variant.name}:</span>
                            <span className="text-yellow-400 font-semibold">₹{variant.price}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-gray-300">
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <Clock className="h-3 w-3 text-gray-400" /> {item.preparation_time}m
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center relative">
                      <div className="inline-block">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(isDropdownOpen ? null : itemId)}
                          className={`inline-flex items-center justify-center gap-1 min-w-[76px] rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide border transition-all ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                          }`}
                        >
                          <span>{isActive ? "Active" : "Inactive"}</span>
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute right-1/2 translate-x-1/2 mt-1 w-28 rounded-md border border-gray-800 bg-gray-950 p-1 shadow-2xl z-50 text-left">
                            <button
                              type="button"
                              onClick={(e) => handleStatusChange(itemId, true, e)}
                              className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-between"
                            >
                              <span>Active</span>
                              {isActive && <span className="text-xs">✓</span>}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleStatusChange(itemId, false, e)}
                              className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-rose-400 hover:bg-rose-500/10 flex items-center justify-between"
                            >
                              <span>Inactive</span>
                              {!isActive && <span className="text-xs">✓</span>}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isAvailable ? "text-emerald-400" : "text-rose-400"}`}>
                        {isAvailable ? "Available" : "Unavailable"}
                      </div>
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`View details for food item: ${item.name}`)}
                        className="rounded-lg border border-gray-800 bg-gray-950/60 px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
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

      <AddFoodItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}