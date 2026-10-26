import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { authApi } from "../api/auth";
import { extractErrorMessage } from "../api/client";
import { rolesFromToken } from "../utils/jwt";
import { hasWriteAccess } from "../config/permissions";

/**
 * Autenticación real contra POST /authenticate (JWT).
 * El resto de la app no necesita saber nada de esto: api/client.ts ya lee
 * el token acá adentro y lo manda solo en cada request.
 */

const TOKEN_STORAGE_KEY = "apicampo_token";

// Evento que dispara api/client.ts cuando el backend responde 401/498
// (token vencido o inválido). AuthProvider lo escucha para cerrar la
// sesión y actualizar el estado de React — un interceptor de axios no es
// un componente, así que no puede llamar a setToken() directamente.
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

// Funciones standalone para que api/client.ts pueda leer el token sin
// depender de React (los interceptores de axios no son componentes).
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  roles: string[];
  canWrite: boolean;
  loading: boolean;
  error: string | null;
  sessionMessage: string | null;
  login: (userName: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearSessionMessage: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
  }, []);

  const login = useCallback(async (userName: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newToken = await authApi.login(userName, password);
      setAuthToken(newToken);
      setToken(newToken);
      setSessionMessage(null);
      return true;
    } catch (err) {
      setError(extractErrorMessage(err, "Usuario o contraseña incorrectos"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Escucha el evento que dispara api/client.ts ante un 401/498 del
  // backend (token vencido o inválido) y cierra la sesión localmente.
  useEffect(() => {
    const handleExpired = () => {
      logout();
      setSessionMessage("Tu sesión expiró. Iniciá sesión de nuevo.");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [logout]);

  const roles = useMemo(() => (token ? rolesFromToken(token) : []), [token]);
  const canWrite = useMemo(() => hasWriteAccess(roles), [roles]);
  const isAuthenticated = token !== null;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        roles,
        canWrite,
        loading,
        error,
        sessionMessage,
        login,
        logout,
        clearSessionMessage: () => setSessionMessage(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
