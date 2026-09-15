import { useQuery } from "@tanstack/react-query";
import { AttributeService } from "../../api/services/attributeService";

export const useAttributes = () => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: () => AttributeService.getAttributes(),
  });
};