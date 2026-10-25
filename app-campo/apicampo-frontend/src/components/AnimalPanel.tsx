import { useEffect, useState } from "react";
import { animalsApi } from "../api/animals";
import { observationsApi } from "../api/observations";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../hooks/useCategories";
import type { AnimalDto, ObservationDto } from "../types";
import { Card, Button, Banner } from "./ui";
import { ObservationForm } from "./ObservationForm";
import { EditAnimalForm } from "./EditAnimalForm";
import { ObservationItem } from "./ObservationItem";
import { DeleteButton } from "./DeleteButton";
import { AssignLote } from "./AssignLote";

interface Props {
  animal: AnimalDto;
  onBack: () => void;
  onUpdated: (animal: AnimalDto) => void;
  onDeleted: (idAnimal: number) => void;
}

export function AnimalPanel({ animal, onBack, onUpdated, onDeleted }: Props) {
  const { canWrite } = useAuth();
  const { nameOf } = useCategories();
  const [editing, setEditing] = useState(false);
  const [observations, setObservations] = useState<ObservationDto[]>([]);
  const [loadingObs, setLoadingObs] = useState(true);
  const [obsError, setObsError] = useState<string | null>(null);
  const [deleteAnimalError, setDeleteAnimalError] = useState<string | null>(null);
  const [deletingAnimal, setDeletingAnimal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingObs(true);
    observationsApi
      .getByAnimal(animal.idAnimal!)
      .then((data) => {
        if (!cancelled) setObservations(data);
      })
      .catch(() => {
        if (!cancelled) setObsError("No se pudo cargar el historial de observaciones");
      })
      .finally(() => {
        if (!cancelled) setLoadingObs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [animal.idAnimal]);

  const handleDeleteAnimal = async () => {
    setDeletingAnimal(true);
    setDeleteAnimalError(null);
    try {
      await animalsApi.remove(animal.idAnimal!);
      onDeleted(animal.idAnimal!);
    } catch (err) {
      // Lo más común: 409 porque el animal tiene observaciones asociadas
      // (DatabaseException del backend) — no se puede borrar sin borrar
      // antes el historial.
      setDeleteAnimalError(extractErrorMessage(err, "No se pudo eliminar el animal"));
      setDeletingAnimal(false);
    }
  };

  if (editing) {
    return (
      <EditAnimalForm
        animal={animal}
        onCancel={() => setEditing(false)}
        onSaved={(updated) => {
          onUpdated(updated);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Caravana</p>
            <p className="text-3xl font-mono font-bold">{animal.caravanNumber}</p>
          </div>
          <Button variant="ghost" onClick={onBack} className="!py-1.5 !px-3 text-sm">
            ← Escanear otro
          </Button>
        </div>
        <dl className="grid grid-cols-2 gap-y-2 mt-4 text-sm">
          <dt className="text-[var(--color-text-muted)]">Categoría</dt>
          <dd>{nameOf(animal.idCategory)}</dd>
          <dt className="text-[var(--color-text-muted)]">Último peso</dt>
          <dd>{animal.lastWeight ? `${animal.lastWeight} kg` : "—"}</dd>
          <dt className="text-[var(--color-text-muted)]">Alta</dt>
          <dd>{animal.creationDate ?? "—"}</dd>
        </dl>

         <AssignLote animal={animal} onUpdated={onUpdated} />

        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => setEditing(true)}
            className="flex-1"
            disabled={!canWrite}
            title={!canWrite ? "Necesitás permisos de encargado" : undefined}
          >
            Editar animal
          </Button>
          <DeleteButton
            label="Eliminar animal"
            onConfirm={handleDeleteAnimal}
            disabled={!canWrite || deletingAnimal}
          />
        </div>
        {deleteAnimalError && (
          <div className="mt-3">
            <Banner kind="error">{deleteAnimalError}</Banner>
          </div>
        )}
        {!canWrite && (
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Tu cuenta tiene permisos de solo lectura.
          </p>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Nueva observación</h3>
        <ObservationForm
          idAnimal={animal.idAnimal!}
          onCreated={(obs) => setObservations((prev) => [obs, ...prev])}
        />
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Historial</h3>
        {loadingObs && <p className="text-sm text-[var(--color-text-muted)]">Cargando…</p>}
        {obsError && <Banner kind="error">{obsError}</Banner>}
        {!loadingObs && !obsError && observations.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">Todavía no hay observaciones cargadas.</p>
        )}
        <ul className="space-y-3">
          {observations.map((obs) => (
            <ObservationItem
              key={obs.idObservation}
              observation={obs}
              onDeleted={(idObservation) =>
                setObservations((prev) => prev.filter((o) => o.idObservation !== idObservation))
              }
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}
