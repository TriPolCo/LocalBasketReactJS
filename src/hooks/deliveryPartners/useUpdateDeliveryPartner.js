import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliveryPartnerService } from "../../api/services/deliveryPartnerService";

export function useUpdateDeliveryPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await DeliveryPartnerService.updateDeliveryPartner(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-partners"] });
    },
  });
}