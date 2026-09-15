import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../../api/services/categoryService";

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subcategoryId) => CategoryService.deleteSubcategory(subcategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};