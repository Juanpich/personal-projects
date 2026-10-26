import { useState, type FormEvent } from "react";
import { animalsApi } from "../api/animals";
import { extractErrorMessage } from "../api/client";
import type { AnimalDto } from "../types";
import { Button, Card, Field, inputClass, Banner } from "./ui";
import { CaravanNumberInput } from "./CaravanNumberInput";
import { CategorySelect } from "./CategorySelect";

interface Props {
  animal: AnimalDto;
  onSaved: (animal: AnimalDto) => void;
  onCancel: () => void;
}

export function EditAnimalForm({ animal, onSaved, onCancel }: Props) {
  const [caravanNumber, setCaravanNumber] = useState(String(animal.caravanNumber));
  const [idCategory, setIdCategory] = useState<string>(animal.idCategory ? String(animal.idCategory) : "");
  const [lastWeight, setLastWeight] = useState<string>(animal.lastWeight ? String(animal.lastWeight) : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!caravanNumber) {
      setError("La caravana no puede quedar vacía");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const updated = await animalsApi.update(animal.idAnimal!, {
        idAnimal: animal.idAnimal,
        caravanNumber: Number(caravanNumber),
        idCategory: idCategory ? Number(idCategory) : null,
        lastWeight: lastWeight ? Number(lastWeight) : 0,
      });
      onSaved(updated);
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo actualizar el animal"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Editar animal</h2>
      <form onSubmit={handleSubmit}>
        <CaravanNumberInput value={caravanNumber} onChange={setCaravanNumber} />

        <Field label="Categoría">
          <CategorySelect value={idCategory} onChange={setIdCategory} emptyLabel="Sin categoría" valueBy="id" />
        </Field>

        <Field label="Último peso, kg">
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
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "Guardando…" : "Guardar cambios"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
