import axios, { AxiosError } from "axios";
import { getAuthToken, clearAuthToken, SESSION_EXPIRED_EVENT } from "../context/AuthContext";

// La URL base se define por variable de entorno (.env / .env.production).
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// El backend devuelve 401 cuando falta el token o es inválido, y 498
// (código propio de JwtFilter) cuando expiró. En ambos casos cerramos la
// sesión localmente y avisamos a AuthContext vía evento — un interceptor
// de axios no es un componente de React, no puede llamar a setState
// directamente.
//
// OJO: un 401 en POST /authenticate no es "sesión vencida", es "usuario
// o contraseña incorrectos" (intento de login fallido). Hay que excluirlo
// explícitamente, si no cada intento de login con mal password dispara el
// mensaje de "tu sesión expiró", que es confuso y falso.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes("/authenticate");

    if ((status === 401 || status === 498) && !isAuthEndpoint) {
      clearAuthToken();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

// El GlobalExceptionHandler del backend devuelve el mensaje como texto plano
// en el body (no como JSON). El JwtFilter (expiración de token) devuelve
// JSON con un campo "message". Esta función cubre ambos casos.
export function extractErrorMessage(error: unknown, fallback = "Ocurrió un error inesperado"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim().length > 0) return data;
    if (data && typeof data === "object" && "message" in data) {
      return String((data as { message: unknown }).message);
    }
    if (error.response?.status === 403) return "No tenés permisos para hacer esta acción";
    if (error.response?.status === 404) return "No se encontró el recurso";
    if (!error.response) return "No se pudo conectar con el servidor";
  }
  return fallback;
}

export function getStatusCode(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) return error.response?.status;
  return undefined;
}
