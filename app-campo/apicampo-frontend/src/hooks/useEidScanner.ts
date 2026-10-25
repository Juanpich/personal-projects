import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Lector XRS2 en modo Bluetooth "HID": el celular lo ve como un teclado
 * externo ya emparejado desde los ajustes del sistema (no hay nada que
 * hacer acá para "conectarlo" — eso pasa a nivel SO, una sola vez).
 *
 * Al escanear una caravana, el lector tipea los dígitos y manda Enter,
 * exactamente igual que si el usuario los escribiera a mano. Por eso este
 * hook no necesita distinguir "vino del lector" vs "lo tipeó la persona":
 * ambos casos son el mismo evento (texto + Enter) y se resuelven igual.
 *
 * Mantiene el input siempre enfocado mientras `enabled` sea true, para que
 * el foco no se pierda al volver de otra pestaña/app y el lector no "tipee
 * al aire".
 */
export function useEidScanner(onScan: (value: string) => void, enabled = true) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    if (enabled) inputRef.current?.focus();
  }, [enabled]);

  useEffect(() => {
    focusInput();
    window.addEventListener("focus", focusInput);
    return () => window.removeEventListener("focus", focusInput);
  }, [focusInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        onScan(trimmed);
        setValue("");
      }
    }
  };

  return {
    inputProps: {
      ref: inputRef,
      value,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onBlur: focusInput,
      inputMode: "numeric" as const,
      autoComplete: "off",
    },
    focusInput,
  };
}
