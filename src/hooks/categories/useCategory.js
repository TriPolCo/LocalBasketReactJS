import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "../../api/services/categoryService"; 

export const useCategory = (categoryId) => {
  return useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => CategoryService.getCategory(categoryId),
    enabled: !!categoryId,
  });
};