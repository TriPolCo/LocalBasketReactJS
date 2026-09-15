import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodItemService } from "../../api/services/foodItemService"; 

export function useCreateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await FoodItemService.createItem(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
    },
  });
}