import { useQuery } from "@tanstack/react-query";
import { FoodItemService } from "../../api/services/foodItemService"; 

export function useFoodItemDetail(id) {
  const {
    data: item = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodItem", id],
    queryFn: async () => {
      const response = await FoodItemService.getItemById(id);
      const rawData = response?.data !== undefined ? response.data : response;
      return rawData?.data || rawData;
    },
    enabled: !!id,
  });

  return { item, loading, error: error?.message || null, refetch };
}