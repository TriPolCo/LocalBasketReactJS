import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryService } from "../../api/services/categoryService"; 

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }) =>
      CategoryService.createSubcategory(
        categoryId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};