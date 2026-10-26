import { useEidScanner } from "../hooks/useEidScanner";

interface Props {
  onScan: (caravanNumber: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function EidScannerInput({ onScan, disabled = false, loading = false }: Props) {
  const { inputProps } = useEidScanner(onScan, !disabled && !loading);

  return (
    <div className="w-full">
      <label htmlFor="eid-scanner" className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
        Escaneá la caravana con el lector, o escribí el número
      </label>
      <div className="relative">
        <input
          id="eid-scanner"
          {...inputProps}
          disabled={disabled || loading}
          placeholder="N° de caravana"
          className="w-full rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border)]
                     text-[var(--color-text)] text-3xl font-mono tracking-widest text-center
                     py-6 px-4 placeholder:text-[var(--color-text-muted)]/50
                     focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/80 rounded-xl">
            <span className="text-[var(--color-accent)] animate-pulse font-medium">Buscando…</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        Presioná Enter después de escribir a mano. El lector XRS2 lo hace solo.
      </p>
    </div>
  );
}
