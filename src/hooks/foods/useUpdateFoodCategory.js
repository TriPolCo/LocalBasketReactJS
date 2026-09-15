import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodCategoryService } from "../../api/services/foodCategoryService";

export function useUpdateFoodCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      return await FoodCategoryService.updateCategory(id, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["foodCategories"] });
      queryClient.invalidateQueries({ queryKey: ["foodCategory", variables.id] });
    },
  });
}