// Tipos espejados de los DTOs del backend (org.tienda.apicampo.domain.dto)

export interface CategoryDto {
  idCategory: number | null;
  name: string;
}

// Ojo: a diferencia de categoría (idCategory), el lote viene con el campo `id`.
export interface LoteDto {
  id: number;
  name: string;
  description: string | null;
  creationDate: string; // ISO date (LocalDate)
  cantAnimals: number | null; // hoy el backend lo devuelve null
}

export interface AnimalDto {
  idAnimal: number | null;
  caravanNumber: number;
  creationDate: string | null; // ISO date (LocalDate)
  lastWeight: number;
  idCategory: number | null;
}

export interface ObservationDto {
  idObservation: number;
  animal: AnimalDto;
  weight: number | null;
  description: string | null;
  dataTime: string; // ISO datetime (LocalDateTime)
}

export interface CreationObservationDto {
  idAnimal: number;
  weight: number | null;
  description: string | null;
}

// Error estándar que devuelve el GlobalExceptionHandler (texto plano en el body)
export interface ApiErrorPayload {
  status: number;
  message: string;
}
