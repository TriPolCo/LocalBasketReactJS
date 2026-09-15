import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "../../api/services/categoryService";

export const useSubcategories = (categoryId) => {
  return useQuery({
    queryKey: ["categories", categoryId, "subcategories"],
    queryFn: () => CategoryService.getSubcategories(categoryId),
    enabled: !!categoryId,
  });
};