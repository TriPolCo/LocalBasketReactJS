import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodCategoryService } from "../../api/services/foodCategoryService";

export function useDeleteFoodCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await FoodCategoryService.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodCategories"] });
    },
  });
}