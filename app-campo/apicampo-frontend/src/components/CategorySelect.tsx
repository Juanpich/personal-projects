import { useCategories } from "../hooks/useCategories";
import { inputClass } from "./ui";

interface Props {
  value: string;
  onChange: (value: string) => void;
  emptyLabel: string;
  // Los formularios de crear/editar animal necesitan el id (así lo espera
  // idCategory en el DTO). El filtro del listado necesita el nombre (así
  // lo espera el query param ?category= del backend).
  valueBy?: "id" | "name";
  disabled?: boolean;
}

export function CategorySelect({ value, onChange, emptyLabel, valueBy = "id", disabled = false }: Props) {
  const { categories, loading } = useCategories();

  return (
    <select
      className={inputClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
    >
      <option value="">{emptyLabel}</option>
      {categories.map((c) => (
        <option key={c.idCategory} value={valueBy === "id" ? String(c.idCategory) : c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
