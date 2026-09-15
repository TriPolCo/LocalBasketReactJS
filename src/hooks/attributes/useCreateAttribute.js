import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AttributeService } from "../../api/services/attributeService"; 

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => AttributeService.createAttribute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};