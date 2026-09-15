import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodCategoryService } from "../../api/services/foodCategoryService"; 

export function useCreateFoodCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await FoodCategoryService.createCategory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodCategories"] });
    },
  });
}