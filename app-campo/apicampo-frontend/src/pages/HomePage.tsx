import { useState } from "react";
import { animalsApi } from "../api/animals";
import { extractErrorMessage, getStatusCode } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AnimalDto } from "../types";
import { EidScannerInput } from "../components/EidScannerInput";
import { AnimalPanel } from "../components/AnimalPanel";
import { CreateAnimalForm } from "../components/CreateAnimalForm";
import { Button, Card, Banner } from "../components/ui";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; caravan: string }
  | { kind: "found"; animal: AnimalDto }
  | { kind: "not-found"; caravan: string }
  | { kind: "creating"; caravan: string }
  | { kind: "error"; message: string };

export function HomePage() {
  const { canWrite } = useAuth();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const reset = () => setStatus({ kind: "idle" });

  const handleScan = async (caravan: string) => {
    setStatus({ kind: "loading", caravan });
    try {
      const animal = await animalsApi.getByCaravan(Number(caravan));
      setStatus({ kind: "found", animal });
    } catch (err) {
      if (getStatusCode(err) === 404) {
        setStatus({ kind: "not-found", caravan });
      } else {
        setStatus({ kind: "error", message: extractErrorMessage(err, "No se pudo buscar el animal") });
      }
    }
  };

  if (status.kind === "found") {
    return (
      <AnimalPanel
        animal={status.animal}
        onBack={reset}
        onUpdated={(animal) => setStatus({ kind: "found", animal })}
        onDeleted={reset}
      />
    );
  }

  if (status.kind === "creating") {
    return (
      <CreateAnimalForm
        caravanNumber={status.caravan}
        onCreated={(animal) => setStatus({ kind: "found", animal })}
        onCancel={reset}
      />
    );
  }

  return (
    <div className="space-y-4">
      <EidScannerInput onScan={handleScan} loading={status.kind === "loading"} />

      {status.kind === "not-found" && (
        <Card>
          <p className="mb-4">
            No existe ningún animal con la caravana <strong className="font-mono">{status.caravan}</strong>.
          </p>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => setStatus({ kind: "creating", caravan: status.caravan })}
              disabled={!canWrite}
              title={!canWrite ? "Necesitás permisos de encargado" : undefined}
            >
              Crear animal
            </Button>
            <Button variant="secondary" onClick={reset}>
              No hacer nada
            </Button>
          </div>
          {!canWrite && (
            <p className="text-xs text-[var(--color-text-muted)] mt-3">
              Tu cuenta tiene permisos de solo lectura.
            </p>
          )}
        </Card>
      )}

      {status.kind === "error" && (
        <Banner kind="error">
          {status.message}{" "}
          <button onClick={reset} className="underline ml-1">
            reintentar
          </button>
        </Banner>
      )}
    </div>
  );
}
