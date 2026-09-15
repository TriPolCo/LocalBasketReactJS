import apiClient from "../handler/apiClient";
import { userEndpoints } from "../endpoints/userEndpoints";

export class UserService {
  static async getUsers() {
    return await apiClient.get(userEndpoints.getUsers);
  }
}