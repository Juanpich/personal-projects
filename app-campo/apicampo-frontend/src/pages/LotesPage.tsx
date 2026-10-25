import { useState, type FormEvent } from "react";
import { lotesApi } from "../api/lotes";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLotes } from "../hooks/useLotes";
import { Button, Card, Banner, Field, inputClass } from "../components/ui";
import { DeleteButton } from "../components/DeleteButton";

export function LotesPage() {
  const { canWrite } = useAuth();
  const { lotes, loading, error, refetch } = useLotes();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteErrorById, setDeleteErrorById] = useState<Record<number, string>>({});

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      await lotesApi.create({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      await refetch();
    } catch (err) {
      setCreateError(extractErrorMessage(err, "No se pudo crear el lote"));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteErrorById((prev) => ({ ...prev, [id]: "" }));
    try {
      await lotesApi.remove(id);
      await refetch();
    } catch (err) {
      // Lo más común acá: 409 porque el lote tiene animales asociados.
      setDeleteErrorById((prev) => ({
        ...prev,
        [id]: extractErrorMessage(err, "No se pudo eliminar el lote"),
      }));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold mb-3">Nuevo lote</h2>
        <form onSubmit={handleCreate}>
          <Field label="Nombre">
            <input
              className={inputClass}
              placeholder="Ej. Lote 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canWrite}
            />
          </Field>
          <Field label="Descripción (opcional)">
            <input
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canWrite}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={creating || !name.trim() || !canWrite}>
            {creating ? "Creando…" : "Crear lote"}
          </Button>
        </form>
        {createError && (
          <div className="mt-3">
            <Banner kind="error">{createError}</Banner>
          </div>
        )}
        {!canWrite && (
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Tu cuenta tiene permisos de solo lectura.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Lotes</h2>
        {loading && <p className="text-sm text-[var(--color-text-muted)]">Cargando…</p>}
        {error && <Banner kind="error">{error}</Banner>}
        {!loading && !error && lotes.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">Todavía no hay lotes creados.</p>
        )}
        <ul className="divide-y divide-[var(--color-border)]">
          {lotes.map((l) => (
            <li key={l.id} className="py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{l.name}</p>
                {l.description && l.description !== l.name && (
                  <p className="text-sm text-[var(--color-text-muted)]">{l.description}</p>
                )}
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Creado el {l.creationDate}
                  {l.cantAnimals != null && ` · ${l.cantAnimals} animales`}
                </p>
              </div>
              <div className="shrink-0">
                <DeleteButton onConfirm={() => handleDelete(l.id)} disabled={!canWrite} />
                {deleteErrorById[l.id] && (
                  <p className="text-xs text-[var(--color-danger)] mt-1 text-right">
                    {deleteErrorById[l.id]}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
