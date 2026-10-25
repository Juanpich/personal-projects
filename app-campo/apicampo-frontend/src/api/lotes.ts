import { apiClient } from "./client";
import type { LoteDto } from "../types";

// Body que se manda al crear un lote. La fecha de creación y el id los
// resuelve el backend.
export interface CreateLoteRequest {
  name: string;
  description?: string | null;
}

export const lotesApi = {
  getAll: async (): Promise<LoteDto[]> => {
    const { data } = await apiClient.get<LoteDto[]>("/lote");
    return data;
  },

  getById: async (id: number): Promise<LoteDto> => {
    const { data } = await apiClient.get<LoteDto>(`/lote/${id}`);
    return data;
  },

  create: async (lote: CreateLoteRequest): Promise<LoteDto> => {
    const { data } = await apiClient.post<LoteDto>("/lote", lote);
    return data;
  },

  // Puede fallar con 409 si el lote tiene animales asociados.
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/lote/${id}`);
  },
};
