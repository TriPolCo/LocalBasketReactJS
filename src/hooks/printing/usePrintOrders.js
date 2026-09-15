import { useQuery } from "@tanstack/react-query";
import { PrintingService } from "../../api/services/printingService";

export function usePrintOrders() {
  const {
    data: orders = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["printOrders"],
    queryFn: async () => {
      const response = await PrintingService.getAdminOrders();
      const responseData = response?.data !== undefined ? response.data : response;
      
      console.log("Parsed responseData:", responseData);

      // If it's already an array, return it directly
      if (Array.isArray(responseData)) {
        return responseData;
      }

      // If it's wrapped in an object like { success: true, data: [...] }
      if (responseData?.success && Array.isArray(responseData.data)) {
        return responseData.data;
      }

      return responseData?.orders || [];
    },
  });

  return {
    orders,
    loading,
    error: error?.message || null,
    refetch,
  };
}