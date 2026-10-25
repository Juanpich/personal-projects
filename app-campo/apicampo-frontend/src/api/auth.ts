import { apiClient } from "./client";

interface AuthenticateResponse {
  id_token: string;
}

export const authApi = {
  // Coincide con LoginDto del backend: { userName, password }
  login: async (userName: string, password: string): Promise<string> => {
    const { data } = await apiClient.post<AuthenticateResponse>("/authenticate", {
      userName,
      password,
    });
    return data.id_token;
  },

  // Coincide con RegisterDto: { username, password }
  register: async (username: string, password: string): Promise<void> => {
    await apiClient.post("/users", { username, password });
  },
};
