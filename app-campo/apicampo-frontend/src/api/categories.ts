import { apiClient } from "./client";
import type { CategoryDto } from "../types";

export const categoriesApi = {
  getAll: async (): Promise<CategoryDto[]> => {
    const { data } = await apiClient.get<CategoryDto[]>("/category");
    return data;
  },

  getById: async (idCategory: number): Promise<CategoryDto> => {
    const { data } = await apiClient.get<CategoryDto>(`/category/${idCategory}`);
    return data;
  },

  create: async (category: Partial<CategoryDto>): Promise<CategoryDto> => {
    const { data } = await apiClient.post<CategoryDto>("/category", category);
    return data;
  },

  // Puede fallar con 409 si la categoría tiene animales asociados.
  remove: async (idCategory: number): Promise<void> => {
    await apiClient.delete(`/category/${idCategory}`);
  },
};
