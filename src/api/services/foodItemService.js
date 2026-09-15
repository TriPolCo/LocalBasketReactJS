import apiClient from "../handler/apiClient";
import { foodItemEndpoints } from "../endpoints/foodItemEndpoints";

export class FoodItemService {
  static async getItems() {
    return await apiClient.get(foodItemEndpoints.list);
  }

  static async getItemById(id) {
    return await apiClient.get(foodItemEndpoints.detail(id));
  }

  static async createItem(payload) {
    return await apiClient.post(foodItemEndpoints.create, payload);
  }

  static async updateItem(id, payload) {
    return await apiClient.patch(foodItemEndpoints.update(id), payload);
  }

  static async deleteItem(id) {
    return await apiClient.delete(foodItemEndpoints.delete(id));
  }
}