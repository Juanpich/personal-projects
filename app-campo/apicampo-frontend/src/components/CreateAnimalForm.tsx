import { useState, type FormEvent } from "react";
import { animalsApi } from "../api/animals";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AnimalDto } from "../types";
import { Button, Card, Field, inputClass, Banner } from "./ui";
import { CategorySelect } from "./CategorySelect";

interface Props {
  caravanNumber: string;
  onCreated: (animal: AnimalDto) => void;
  onCancel: () => void;
}

export function CreateAnimalForm({ caravanNumber, onCreated, onCancel }: Props) {
  const { canWrite } = useAuth();
  const [idCategory, setIdCategory] = useState<string>("");
  const [lastWeight, setLastWeight] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const animal = await animalsApi.create({
        caravanNumber: Number(caravanNumber),
        idCategory: idCategory ? Number(idCategory) : null,
        lastWeight: lastWeight ? Number(lastWeight) : 0,
      });
      onCreated(animal);
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo crear el animal"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Nuevo animal — caravana {caravanNumber}</h2>
      <form onSubmit={handleSubmit}>
        <Field label="Categoría (opcional)">
          <CategorySelect value={idCategory} onChange={setIdCategory} emptyLabel="Sin categoría" valueBy="id" />
        </Field>
        <Field label="Último peso, kg (opcional)">
          <input
            type="number"
            step="0.1"
            min="0"
            className={inputClass}
            value={lastWeight}
            onChange={(e) => setLastWeight(e.target.value)}
          />
        </Field>

        {error && (
          <div className="mb-4">
            <Banner kind="error">{error}</Banner>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting || !canWrite} className="flex-1">
            {submitting ? "Creando…" : "Crear animal"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
