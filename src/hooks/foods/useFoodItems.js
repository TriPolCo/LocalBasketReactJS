import { useQuery } from "@tanstack/react-query";
import { FoodItemService } from "../../api/services/foodItemService"; 

export function useFoodItems() {
  const {
    data: items = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodItems"],
    queryFn: async () => {
      const response = await FoodItemService.getItems();
      const rawData = response?.data !== undefined ? response.data : response;
      if (Array.isArray(rawData)) return rawData;
      return rawData?.data || rawData?.items || [];
    },
  });

  return { items, loading, error: error?.message || null, refetch };
}