import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PrintingService } from "../../api/services/printingService"; 

export function useCreatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await PrintingService.createPricing(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printingPricing"] });
    },
  });
}