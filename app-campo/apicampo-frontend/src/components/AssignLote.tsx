import { useEffect, useState } from "react";
import { animalsApi } from "../api/animals";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AnimalDto } from "../types";
import { Button, Banner } from "./ui";
import { LoteSelect } from "./LoteSelect";

interface Props {
  animal: AnimalDto;
  onUpdated: (animal: AnimalDto) => void;
}

const toValue = (idLote: number | null) => (idLote != null ? String(idLote) : "");

export function AssignLote({ animal, onUpdated }: Props) {
  const { canWrite } = useAuth();
  const [value, setValue] = useState(toValue(animal.idLote));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si el animal cambia desde afuera (por ejemplo, tras editarlo), el select
  // vuelve a reflejar el lote que realmente tiene.
  useEffect(() => {
    setValue(toValue(animal.idLote));
  }, [animal.idLote]);

  const changed = value !== toValue(animal.idLote);

  const handleMove = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await animalsApi.assignLote(animal.idAnimal!, value ? Number(value) : null);
      onUpdated(updated);
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo asignar el lote"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4">
      <span className="block text-sm text-[var(--color-text-muted)] mb-1.5">Lote</span>
      <div className="flex gap-2">
        <div className="flex-1">
          <LoteSelect value={value} onChange={setValue} disabled={!canWrite || saving} />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleMove}
          disabled={!changed || saving || !canWrite}
          title={!canWrite ? "Necesitás permisos de encargado" : undefined}
        >
          {saving ? "Moviendo…" : "Mover"}
        </Button>
      </div>
      {error && (
        <div className="mt-2">
          <Banner kind="error">{error}</Banner>
        </div>
      )}
    </div>
  );
}
