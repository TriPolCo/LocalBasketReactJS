import apiClient from "../handler/apiClient";
import { attributeEndpoints } from "../endpoints/attributeEndpoints";

export class AttributeService {
  static async getAttributes() {
    return await apiClient.get(attributeEndpoints.list);
  }

  static async createAttribute(payload) {
    return await apiClient.post(attributeEndpoints.create, payload);
  }

  static async createAttributeValue(payload) {
    return await apiClient.post(attributeEndpoints.createValue, payload);
  }
}