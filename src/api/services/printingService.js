import apiClient from "../handler/apiClient";
import { printingEndpoints } from "../endpoints/printingEndpoints"; 
export class PrintingService {
  static async getAdminOrders() {
    return await apiClient.get(printingEndpoints.adminOrders);
  }
  

  static async getServices() {
      return await apiClient.get(printingEndpoints.listServices);
    }
  
    static async createService(payload) {
      return await apiClient.post(printingEndpoints.createService, payload);
    }


    static async createPricing(payload) {
        return await apiClient.post(printingEndpoints.create, payload);
      }
}