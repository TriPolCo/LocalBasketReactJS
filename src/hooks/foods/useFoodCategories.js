import { useQuery } from "@tanstack/react-query";
import { FoodCategoryService } from "../../api/services/foodCategoryService"; 

export function useFoodCategories() {
  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodCategories"],
    queryFn: async () => {
      const response = await FoodCategoryService.getCategories();
      const rawData = response?.data !== undefined ? response.data : response;
      if (Array.isArray(rawData)) return rawData;
      return rawData?.data || rawData?.categories || [];
    },
  });

  return { categories, loading, error: error?.message || null, refetch };
}