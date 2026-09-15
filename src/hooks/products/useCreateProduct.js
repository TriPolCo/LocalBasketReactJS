import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../../api/services/productService"; 

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => ProductService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};