import { apiClient } from "./client";
import type { CreationObservationDto, ObservationDto } from "../types";

export const observationsApi = {
  getAll: async (): Promise<ObservationDto[]> => {
    const { data } = await apiClient.get<ObservationDto[]>("/observation");
    return data;
  },

  getById: async (idObservation: number): Promise<ObservationDto> => {
    const { data } = await apiClient.get<ObservationDto>(`/observation/${idObservation}`);
    return data;
  },

  getByAnimal: async (idAnimal: number): Promise<ObservationDto[]> => {
    const { data } = await apiClient.get<ObservationDto[]>(`/observation/animal/${idAnimal}`);
    return data;
  },

  create: async (observation: CreationObservationDto): Promise<ObservationDto> => {
    const { data } = await apiClient.post<ObservationDto>("/observation", observation);
    return data;
  },

  remove: async (idObservation: number): Promise<void> => {
    await apiClient.delete(`/observation/${idObservation}`);
  },
};
