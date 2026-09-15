import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../../api/services/categoryService";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => CategoryService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};