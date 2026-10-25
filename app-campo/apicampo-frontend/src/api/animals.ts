import { apiClient } from "./client";
import type { AnimalDto } from "../types";

// Objeto en vez de parámetro suelto: cuando se sume el próximo filtro
// (peso, fecha de alta, etc.) alcanza con agregar un campo acá, sin tocar
// las llamadas existentes.
export interface AnimalFilters {
  category?: string;
  lote?: string;
}

export const animalsApi = {
  getAll: async (filters?: AnimalFilters): Promise<AnimalDto[]> => {
    const { data } = await apiClient.get<AnimalDto[]>("/animal", {
      // Solo se mandan los filtros con valor; se pueden combinar.
      params: {
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.lote ? { lote: filters.lote } : {}),
      },
    });
    return data;
  },

  // Lanza 404 (via GlobalExceptionHandler -> NonExistentAnimalException) si
  // no existe. El caller debe capturarlo para ofrecer "crear animal".
  getByCaravan: async (caravanNumber: number): Promise<AnimalDto> => {
    const { data } = await apiClient.get<AnimalDto>(`/animal/caravan/${caravanNumber}`);
    return data;
  },

  create: async (animal: Partial<AnimalDto>): Promise<AnimalDto> => {
    const { data } = await apiClient.post<AnimalDto>("/animal", animal);
    return data;
  },

  update: async (idAnimal: number, animal: Partial<AnimalDto>): Promise<AnimalDto> => {
    const { data } = await apiClient.put<AnimalDto>(`/animal/${idAnimal}`, animal);
    return data;
  },

    // Endpoint dedicado: el PUT /animal/{id} no toca el lote. Con idLote null
  // se saca al animal de su lote actual.
  assignLote: async (idAnimal: number, idLote: number | null): Promise<AnimalDto> => {
    const { data } = await apiClient.put<AnimalDto>(`/animal/${idAnimal}/lote`, { idLote });
    return data;
  },

  // Puede fallar con 409 si el animal tiene observaciones asociadas.
  remove: async (idAnimal: number): Promise<void> => {
    await apiClient.delete(`/animal/${idAnimal}`);
  },
};
