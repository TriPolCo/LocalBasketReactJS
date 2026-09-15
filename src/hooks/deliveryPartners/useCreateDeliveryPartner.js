import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliveryPartnerService } from "../../api/services/deliveryPartnerService";

export function useCreateDeliveryPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await DeliveryPartnerService.createDeliveryPartner(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-partners"] });
    },
  });
}