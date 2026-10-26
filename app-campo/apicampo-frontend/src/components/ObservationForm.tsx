import { useState, type FormEvent } from "react";
import { observationsApi } from "../api/observations";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { ObservationDto } from "../types";
import { Button, Field, inputClass, Banner } from "./ui";

interface Props {
  idAnimal: number;
  onCreated: (observation: ObservationDto) => void;
}

export function ObservationForm({ idAnimal, onCreated }: Props) {
  const { canWrite } = useAuth();
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!weight && !description) {
      setError("Cargá al menos un peso o una descripción");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const observation = await observationsApi.create({
        idAnimal,
        weight: weight ? Number(weight) : null,
        description: description || null,
      });
      onCreated(observation);
      setWeight("");
      setDescription("");
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo guardar la observación"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Peso, kg (opcional)">
        <input
          type="number"
          step="0.1"
          min="0"
          inputMode="decimal"
          className={inputClass}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </Field>
      <Field label="Descripción (opcional)">
        <textarea
          className={inputClass}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Estado general, tratamiento aplicado, etc."
        />
      </Field>

      {error && (
        <div className="mb-4">
          <Banner kind="error">{error}</Banner>
        </div>
      )}

      <Button type="submit" disabled={submitting || !canWrite} className="w-full">
        {submitting ? "Guardando…" : !canWrite ? "Solo lectura" : "Guardar observación"}
      </Button>
    </form>
  );
}
