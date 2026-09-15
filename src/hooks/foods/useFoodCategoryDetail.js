import { useQuery } from "@tanstack/react-query";
import { FoodCategoryService } from "../../api/services/foodCategoryService"; 

export function useFoodCategoryDetail(id) {
  const {
    data: category = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodCategory", id],
    queryFn: async () => {
      const response = await FoodCategoryService.getCategoryById(id);
      const rawData = response?.data !== undefined ? response.data : response;
      return rawData?.data || rawData;
    },
    enabled: !!id,
  });

  return { category, loading, error: error?.message || null, refetch };
}