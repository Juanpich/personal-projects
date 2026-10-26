import { apiClient } from "./client";

export interface ChangeRoleRequest {
  username: string;
  role: string;
}

export const usersApi = {
  // Solo ENCARGADO. 404 si el usuario no existe.
  changeRole: async (request: ChangeRoleRequest): Promise<void> => {
    await apiClient.put("/users/changeRole", request);
  },
};
