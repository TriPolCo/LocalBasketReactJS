import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodItemService } from "../../api/services/foodItemService"; 

export function useUpdateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      return await FoodItemService.updateItem(id, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
      queryClient.invalidateQueries({ queryKey: ["foodItem", variables.id] });
    },
  });
}