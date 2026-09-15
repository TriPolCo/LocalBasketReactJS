import apiClient from "../handler/apiClient";
import { accountEndpoints } from "../endpoints/accountEndpoints";

export class AccountService {
  static async login(loginPayload) {
    return await apiClient.post(accountEndpoints.login, loginPayload);
  }
}