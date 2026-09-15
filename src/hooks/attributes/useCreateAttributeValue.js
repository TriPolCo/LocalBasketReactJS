import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AttributeService } from "../../api/services/attributeService";

export const useCreateAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => AttributeService.createAttributeValue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};