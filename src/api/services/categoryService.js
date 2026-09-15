import apiClient from "../handler/apiClient";
import { categoryEndpoints } from "../endpoints/categoryEndpoints";

export class CategoryService {
  static async getCategories() {
    return await apiClient.get(categoryEndpoints.list);
  }

  static async getCategoryTree() {
    return await apiClient.get(categoryEndpoints.tree);
  }

  static async getCategory(categoryId) {
    return await apiClient.get(categoryEndpoints.detail(categoryId));
  }

  static async createCategory(payload) {
    return await apiClient.post(categoryEndpoints.create, payload);
  }

  static async updateCategory(categoryId, payload) {
    return await apiClient.patch(categoryEndpoints.update(categoryId), payload);
  }

  static async deleteCategory(categoryId) {
    return await apiClient.delete(categoryEndpoints.delete(categoryId));
  }

  static async getSubcategories(categoryId) {
    return await apiClient.get(categoryEndpoints.subcategories(categoryId));
  }

  static async createSubcategory(categoryId, payload) {
    return await apiClient.post(categoryEndpoints.createSubcategory(categoryId), payload);
  }

  static async updateSubcategory(subcategoryId, payload) {
    return await apiClient.patch(categoryEndpoints.updateSubcategory(subcategoryId), payload);
  }

  static async deleteSubcategory(subcategoryId) {
    return await apiClient.delete(categoryEndpoints.deleteSubcategory(subcategoryId));
  }
}