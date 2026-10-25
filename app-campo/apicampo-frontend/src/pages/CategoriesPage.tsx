import { useState, type FormEvent } from "react";
import { categoriesApi } from "../api/categories";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../hooks/useCategories";
import { Button, Card, Banner, inputClass } from "../components/ui";
import { DeleteButton } from "../components/DeleteButton";

export function CategoriesPage() {
  const { canWrite } = useAuth();
  const { categories, loading, error, refetch } = useCategories();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteErrorById, setDeleteErrorById] = useState<Record<number, string>>({});

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      await categoriesApi.create({ name: name.trim() });
      setName("");
      await refetch();
    } catch (err) {
      setCreateError(extractErrorMessage(err, "No se pudo crear la categoría"));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (idCategory: number) => {
    setDeleteErrorById((prev) => ({ ...prev, [idCategory]: "" }));
    try {
      await categoriesApi.remove(idCategory);
      await refetch();
    } catch (err) {
      // Lo más común acá: 409 porque la categoría tiene animales asociados
      // (DatabaseException del backend).
      setDeleteErrorById((prev) => ({
        ...prev,
        [idCategory]: extractErrorMessage(err, "No se pudo eliminar la categoría"),
      }));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold mb-3">Nueva categoría</h2>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Nombre, ej. Ternero"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canWrite}
          />
          <Button type="submit" disabled={creating || !name.trim() || !canWrite}>
            {creating ? "Creando…" : "Crear"}
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
        <h2 className="text-lg font-semibold mb-3">Categorías</h2>
        {loading && <p className="text-sm text-[var(--color-text-muted)]">Cargando…</p>}
        {error && <Banner kind="error">{error}</Banner>}
        {!loading && !error && categories.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">Todavía no hay categorías creadas.</p>
        )}
        <ul className="divide-y divide-[var(--color-border)]">
          {categories.map((c) => (
            <li key={c.idCategory} className="py-3 flex items-center justify-between gap-3">
              <span>{c.name}</span>
              <div>
                <DeleteButton onConfirm={() => handleDelete(c.idCategory!)} disabled={!canWrite} />
                {deleteErrorById[c.idCategory!] && (
                  <p className="text-xs text-[var(--color-danger)] mt-1 text-right">
                    {deleteErrorById[c.idCategory!]}
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
