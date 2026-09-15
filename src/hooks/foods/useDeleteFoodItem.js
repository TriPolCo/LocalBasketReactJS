import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodItemService } from "../../api/services/foodItemService"; 

export function useDeleteFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await FoodItemService.deleteItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
    },
  });
}