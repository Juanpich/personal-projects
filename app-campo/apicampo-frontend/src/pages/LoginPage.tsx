import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { extractErrorMessage } from "../api/client";
import { Button, Card, Field, inputClass, Banner } from "../components/ui";

type Mode = "login" | "register";

export function LoginPage() {
  const { login, loading, error, sessionMessage, clearSessionMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await login(userName, password);
    if (ok) navigate(from, { replace: true });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setRegisterError(null);
    try {
      await authApi.register(userName, password);
      // Registro OK -> logueamos directo para no pedirle los datos dos veces
      const ok = await login(userName, password);
      if (ok) navigate(from, { replace: true });
    } catch (err) {
      setRegisterError(extractErrorMessage(err, "No se pudo crear la cuenta"));
    } finally {
      setRegistering(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setRegisterError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">TrazaCampo</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          {mode === "login" ? "Iniciá sesión para continuar" : "Creá tu cuenta"}
        </p>

        {sessionMessage && (
          <div className="mb-4">
            <Banner kind="info">
              {sessionMessage}{" "}
              <button onClick={clearSessionMessage} className="underline ml-1">
                cerrar
              </button>
            </Banner>
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <Field label="Usuario">
              <input
                className={inputClass}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </Field>
            <Field label="Contraseña">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>

            {error && (
              <div className="mb-4">
                <Banner kind="error">{error}</Banner>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando…" : "Ingresar"}
            </Button>

            <p className="text-sm text-center text-[var(--color-text-muted)] mt-4">
              ¿No tenés cuenta?{" "}
              <button type="button" onClick={() => switchMode("register")} className="underline text-[var(--color-text)]">
                Creá una
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Field label="Usuario">
              <input
                className={inputClass}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </Field>
            <Field label="Contraseña">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={1}
              />
            </Field>

            {registerError && (
              <div className="mb-4">
                <Banner kind="error">{registerError}</Banner>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={registering}>
              {registering ? "Creando cuenta…" : "Crear cuenta"}
            </Button>

            <p className="text-xs text-center text-[var(--color-text-muted)] mt-3">
              La cuenta se crea con permisos de solo lectura. Para permisos de escritura, pedile a un
              encargado que te los habilite.
            </p>

            <p className="text-sm text-center text-[var(--color-text-muted)] mt-4">
              ¿Ya tenés cuenta?{" "}
              <button type="button" onClick={() => switchMode("login")} className="underline text-[var(--color-text)]">
                Ingresá
              </button>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
