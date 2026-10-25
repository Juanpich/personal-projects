import { useLotes } from "../hooks/useLotes";
import { inputClass } from "./ui";

interface Props {
  value: string; // id del lote como string, "" = sin lote
  onChange: (value: string) => void;
  emptyLabel?: string;
  // El selector de asignar lote usa el id; el filtro del listado usa el
  // nombre (así lo espera el query param ?lote= del backend).
  valueBy?: "id" | "name";
  disabled?: boolean;
}

export function LoteSelect({ value, onChange, emptyLabel = "Sin lote", valueBy = "id", disabled = false }: Props) {
  const { lotes, loading } = useLotes();

  return (
    <select
      className={inputClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
    >
      <option value="">{emptyLabel}</option>
      {lotes.map((l) => (
        <option key={l.id} value={valueBy === "id" ? String(l.id) : l.name}>
          {l.name}
        </option>
      ))}
    </select>
  );
}
