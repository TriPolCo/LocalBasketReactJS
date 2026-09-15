import apiClient from "../handler/apiClient";
import { deliveryPartnerEndpoints } from "../endpoints/deliveryPartnerEndpoints";

export class DeliveryPartnerService {
  static async getDeliveryPartners() {
    const response = await apiClient.get(deliveryPartnerEndpoints.getDeliveryPartners);
    return response.data;
  }

  static async getDeliveryPartner(id) {
    const response = await apiClient.get(deliveryPartnerEndpoints.getDeliveryPartner(id));
    return response.data;
  }

  static async createDeliveryPartner(data) {
    const response = await apiClient.post(deliveryPartnerEndpoints.createDeliveryPartner, data);
    return response.data;
  }

  static async updateDeliveryPartner(id, data) {
    const response = await apiClient.put(deliveryPartnerEndpoints.updateDeliveryPartner(id), data);
    return response.data;
  }

  static async deleteDeliveryPartner(id) {
    const response = await apiClient.delete(deliveryPartnerEndpoints.deleteDeliveryPartner(id));
    return response.data;
  }
}