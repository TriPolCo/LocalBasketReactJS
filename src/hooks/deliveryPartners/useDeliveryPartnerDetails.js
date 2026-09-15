import { useQuery } from "@tanstack/react-query";
import { DeliveryPartnerService } from "../../api/services/deliveryPartnerService"; 

export function useDeliveryPartnerDetails(id) {
  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["delivery-partner", id],
    queryFn: async () => {
      return await DeliveryPartnerService.getDeliveryPartner(id);
    },
    enabled: Boolean(id),
  });

  // Handle various API response nesting patterns (e.g., axios response wrappers or direct JSON payloads)
  const actualResponse = response?.data !== undefined ? response.data : response;
  
  // Extract partner object considering structures like { success, message, data: { ... } } or direct object
  const partner = 
    actualResponse?.data !== undefined 
      ? actualResponse.data 
      : actualResponse;

  return {
    partner: partner || null,
    loading,
    error: error?.message || null,
    refetch,
  };
}