import { useQuery } from "@tanstack/react-query";
import { OrderService } from "../../api/services/orderService";

export const ADMIN_ORDERS_QUERY_KEY = ["admin-orders"];

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEY,
    queryFn: () => OrderService.getAllOrders(),
  });
};