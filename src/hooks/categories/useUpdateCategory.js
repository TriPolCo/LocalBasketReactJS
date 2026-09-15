import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../../api/services/categoryService"; 

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }) =>
      CategoryService.updateCategory(categoryId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["categories", variables.categoryId],
      });
    },
  });
};