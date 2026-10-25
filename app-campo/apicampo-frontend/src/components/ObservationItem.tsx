import { useState } from "react";
import { observationsApi } from "../api/observations";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { ObservationDto } from "../types";
import { Banner } from "./ui";
import { DeleteButton } from "./DeleteButton";

interface Props {
  observation: ObservationDto;
  onDeleted: (idObservation: number) => void;
}

export function ObservationItem({ observation, onDeleted }: Props) {
  const { canWrite } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await observationsApi.remove(observation.idObservation);
      onDeleted(observation.idObservation);
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo eliminar la observación"));
      setDeleting(false);
    }
  };

  return (
    <li className="border-t border-[var(--color-border)] pt-3 first:border-0 first:pt-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex justify-between items-center text-sm text-left"
      >
        <span className="text-[var(--color-text-muted)]">
          {new Date(observation.dataTime).toLocaleString("es-AR")}
        </span>
        <span className="flex items-center gap-2">
          {observation.weight != null && <span className="font-mono">{observation.weight} kg</span>}
          <span className="text-[var(--color-text-muted)]">{expanded ? "▲" : "▼"}</span>
        </span>
      </button>

      {expanded && (
        <div className="mt-2">
          <p className="text-sm">
            {observation.description || <span className="text-[var(--color-text-muted)]">Sin descripción.</span>}
          </p>
          {error && (
            <div className="mt-2">
              <Banner kind="error">{error}</Banner>
            </div>
          )}
          <div className="mt-2">
            <DeleteButton
              onConfirm={handleDelete}
              disabled={deleting || !canWrite}
              label="Eliminar observación"
            />
          </div>
        </div>
      )}
    </li>
  );
}
