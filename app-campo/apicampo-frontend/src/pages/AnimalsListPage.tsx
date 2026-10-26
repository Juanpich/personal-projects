import { useEffect, useState } from "react";
import { animalsApi } from "../api/animals";
import { extractErrorMessage } from "../api/client";
import { useCategories } from "../hooks/useCategories";
import { useLotes } from "../hooks/useLotes";
import type { AnimalDto } from "../types";
import { Card, Banner } from "../components/ui";
import { AnimalPanel } from "../components/AnimalPanel";
import { CategorySelect } from "../components/CategorySelect";
import { LoteSelect } from "../components/LoteSelect";

export function AnimalsListPage() {
  const { nameOf } = useCategories();
  const { nameOf: loteNameOf } = useLotes();
  const [animals, setAnimals] = useState<AnimalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loteFilter, setLoteFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setExpandedId(null);
    animalsApi
      .getAll({ category: categoryFilter, lote: loteFilter })
      .then((data) => {
        if (!cancelled) setAnimals(data);
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, "No se pudieron cargar los animales"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryFilter, loteFilter]);

  const updateAnimalInList = (updated: AnimalDto) => {
    setAnimals((prev) => prev.map((a) => (a.idAnimal === updated.idAnimal ? updated : a)));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <CategorySelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          emptyLabel="Todas las categorías"
          valueBy="name"
        />
        <LoteSelect
          value={loteFilter}
          onChange={setLoteFilter}
          emptyLabel="Todos los lotes"
          valueBy="name"
        />
      </div>

      {loading && <p className="text-sm text-[var(--color-text-muted)]">Cargando…</p>}
      {error && <Banner kind="error">{error}</Banner>}
      {!loading && !error && animals.length === 0 && (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">
            {categoryFilter || loteFilter
              ? "No hay animales que coincidan con los filtros."
              : "Todavía no hay animales cargados. Escaneá una caravana para crear el primero."}
          </p>
        </Card>
      )}

      {!loading &&
        !error &&
        animals.map((animal) => {
          const isExpanded = expandedId === animal.idAnimal;
          return (
            <div key={animal.idAnimal}>
              {isExpanded ? (
                <AnimalPanel
                  animal={animal}
                  onBack={() => setExpandedId(null)}
                  onUpdated={(updated) => {
                    updateAnimalInList(updated);
                  }}
                  onDeleted={(idAnimal) => {
                    setAnimals((prev) => prev.filter((a) => a.idAnimal !== idAnimal));
                    setExpandedId(null);
                  }}
                />
              ) : (
                <button
                  onClick={() => setExpandedId(animal.idAnimal)}
                  className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)]
                             rounded-2xl p-4 flex items-center justify-between hover:border-[var(--color-accent)]
                             transition-colors"
                >
                  <div>
                    <p className="font-mono text-xl font-bold">{animal.caravanNumber}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{nameOf(animal.idCategory)} · {loteNameOf(animal.idLote)}</p>
                  </div>
                  <span className="text-[var(--color-text-muted)]">›</span>
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
