import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../../api/services/categoryService";

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subcategoryId, payload }) => CategoryService.updateSubcategory(subcategoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};