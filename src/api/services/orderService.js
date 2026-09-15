import apiClient from "../handler/apiClient";
import { orderEndpoints } from "../endpoints/orderEndpoints"; 

export class OrderService {
  static async getAllOrders() {
    return await apiClient.get(orderEndpoints.list);
  }
}