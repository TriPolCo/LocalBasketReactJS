import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PrintingService } from "../../api/services/printingService"; 

export function usePrintingServices() {
  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["printingServices"],
    queryFn: async () => {
      const response = await PrintingService.getServices();
      const rawData = response?.data !== undefined ? response.data : response;

      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData?.success && Array.isArray(rawData.data)) {
        return rawData.data;
      }
      return rawData?.services || [];
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (newServicePayload) => {
      return await PrintingService.createService(newServicePayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printingServices"] });
    },
  });

  return {
    services,
    loading,
    error: error?.message || null,
    refetch,
    createService: createServiceMutation.mutateAsync,
    isCreating: createServiceMutation.isPending,
  };
}