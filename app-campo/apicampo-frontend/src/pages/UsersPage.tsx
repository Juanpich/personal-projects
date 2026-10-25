import { useState, type FormEvent } from "react";
import { usersApi } from "../api/users";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ROLES, canManageUsers } from "../config/permissions";
import { Button, Card, Banner, Field, inputClass } from "../components/ui";

export function UsersPage() {
  const { roles } = useAuth();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!canManageUsers(roles)) {
    return <Banner kind="info">Solo un encargado puede administrar usuarios.</Banner>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await usersApi.changeRole({ username: name, role });
      const label = ROLES.find((r) => r.value === role)?.label ?? role;
      setSuccess(`Ahora ${name} tiene el rol ${label}.`);
      setUsername("");
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo cambiar el rol"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-1">Cambiar rol de un usuario</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        El rol viaja dentro del token de sesión, así que el cambio se aplica cuando ese usuario
        vuelva a iniciar sesión.
      </p>

      <form onSubmit={handleSubmit}>
        <Field label="Usuario">
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            required
          />
        </Field>
        <Field label="Rol">
          <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>

        {error && (
          <div className="mb-4">
            <Banner kind="error">{error}</Banner>
          </div>
        )}
        {success && (
          <div className="mb-4">
            <Banner kind="info">{success}</Banner>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={saving || !username.trim()}>
          {saving ? "Guardando…" : "Cambiar rol"}
        </Button>
      </form>
    </Card>
  );
}
