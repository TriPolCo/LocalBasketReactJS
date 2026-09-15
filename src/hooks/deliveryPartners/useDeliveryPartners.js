import { useQuery } from "@tanstack/react-query";
import { DeliveryPartnerService } from "../../api/services/deliveryPartnerService"; 

export function useDeliveryPartners() {
  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["delivery-partners"],
    queryFn: async () => {
      return await DeliveryPartnerService.getDeliveryPartners();
    },
  });

  const rawData = response?.data !== undefined ? response.data : response;
  const deliveryPartners = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];

  return {
    deliveryPartners,
    loading,
    error: error?.message || null,
    refetch,
  };
}