import { useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * A diferencia de useEidScanner (pensado para la pantalla de búsqueda, que
 * dispara una acción y limpia el campo en cada Enter), este es un campo
 * controlado normal: el lector "tipea" los dígitos + Enter igual que
 * siempre, pero acá el Enter solo confirma el valor en el campo — no
 * manda el formulario que lo contiene. Así, si estás editando un animal y
 * volvés a escanear para corregir la caravana, no se guarda nada todavía;
 * el usuario revisa y confirma con el botón "Guardar".
 */
export function CaravanNumberInput({ value, onChange, label = "N° de caravana" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label className="block mb-4">
      <span className="block text-sm text-[var(--color-text-muted)] mb-1.5">{label}</span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        onKeyDown={(e) => {
          // El lector manda Enter al terminar de escanear. Lo bloqueamos acá
          // para que no dispare el submit del formulario por accidente.
          if (e.key === "Enter") e.preventDefault();
        }}
        inputMode="numeric"
        autoComplete="off"
        className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]
                   text-[var(--color-text)] font-mono text-lg py-2.5 px-3
                   focus:border-[var(--color-accent)] transition-colors"
      />
      <span className="block text-xs text-[var(--color-text-muted)] mt-1">
        Podés volver a escanear con el lector para corregir el número.
      </span>
    </label>
  );
}
