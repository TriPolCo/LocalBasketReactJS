import { useQuery } from "@tanstack/react-query";

import { CategoryService } from "../../api/services/categoryService"; 

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: () => CategoryService.getCategoryTree(),
  });
};