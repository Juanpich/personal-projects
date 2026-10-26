import { useCallback, useEffect, useState } from "react";
import { lotesApi } from "../api/lotes";
import type { LoteDto } from "../types";

export function useLotes() {
  const [lotes, setLotes] = useState<LoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return lotesApi
      .getAll()
      .then((data) => setLotes(data))
      .catch(() => setError("No se pudieron cargar los lotes"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const nameOf = (idLote: number | null) =>
    lotes.find((l) => l.id === idLote)?.name ?? "Sin lote";

  return { lotes, loading, error, nameOf, refetch };
}
