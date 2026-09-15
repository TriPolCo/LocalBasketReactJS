import apiClient from "../handler/apiClient";
import { foodCategoryEndpoints } from "../endpoints/foodCategoryEndpoints";

export class FoodCategoryService {
  static async getCategories() {
    return await apiClient.get(foodCategoryEndpoints.list);
  }

  static async getCategoryById(id) {
    return await apiClient.get(foodCategoryEndpoints.detail(id));
  }

  static async createCategory(payload) {
    return await apiClient.post(foodCategoryEndpoints.create, payload);
  }

  static async updateCategory(id, payload) {
    return await apiClient.patch(foodCategoryEndpoints.update(id), payload);
  }

  static async deleteCategory(id) {
    return await apiClient.delete(foodCategoryEndpoints.delete(id));
  }
}