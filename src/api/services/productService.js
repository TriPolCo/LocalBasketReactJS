import apiClient from "../handler/apiClient";
import { productEndpoints } from "../endpoints/productEndpoints";

export class ProductService {
  static async createProduct(payload) {
    return await apiClient.post(productEndpoints.create, payload);
  }
}