import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryService } from "../../api/services/categoryService"; 

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      CategoryService.createCategory(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};