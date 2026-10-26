import { useState } from "react";
import { Button } from "./ui";

interface Props {
  onConfirm: () => void;
  label?: string;
  disabled?: boolean;
}

/**
 * Botón de eliminar de dos pasos: primer click pide confirmación inline
 * (nada de window.confirm(), que rompe el estilo de la app), segundo click
 * confirma.
 */
export function DeleteButton({ onConfirm, label = "Eliminar", disabled = false }: Props) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--color-text-muted)]">¿Seguro?</span>
        <Button
          type="button"
          variant="danger"
          className="!py-1 !px-2.5 text-sm"
          onClick={onConfirm}
          disabled={disabled}
        >
          Sí, eliminar
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="!py-1 !px-2.5 text-sm"
          onClick={() => setConfirming(false)}
          disabled={disabled}
        >
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="!py-1 !px-2.5 text-sm !text-[var(--color-danger)]"
      onClick={() => setConfirming(true)}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
