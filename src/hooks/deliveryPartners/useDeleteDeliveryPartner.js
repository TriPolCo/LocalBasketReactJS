import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliveryPartnerService } from "../../api/services/deliveryPartnerService"; 

export function useDeleteDeliveryPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await DeliveryPartnerService.deleteDeliveryPartner(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-partners"] });
    },
  });
}