import type { Control, FieldError } from "react-hook-form"
import { useController } from "react-hook-form"
import { useCallback } from "react"
import { useApi } from "../hooks"
import { getCategories } from "../service"
import type { Category } from "../models"
import type { ProductFormValues } from "./schemas"

interface CategoryPickerProps {
    control: Control<ProductFormValues>
    error?: FieldError
}

/**
 * Selector de categorías para el formulario de producto.
 *
 * - Muestra los chips de las categorías ya asignadas (ids en el campo `categories`)
 * - Lista un <select> con las categorías disponibles que aún no están asignadas
 * - Al seleccionar una opción la agrega al array; al hacer click en un chip la quita
 *
 * Solo maneja el campo `categories: number[]` del formulario.
 * La lógica de associate/disassociate contra la API vive en ProductFormPage.
 */
export const CategoryPicker = ({ control, error }: CategoryPickerProps) => {
    // ── Cargar todas las categorías disponibles ──────────────────────────────
    const apiCall = useCallback(() => getCategories(), [])
    const { data: allCategories, loading, error: fetchError } = useApi<Category[], []>(
        apiCall,
        { autoFetch: true, params: [] }
    )

    // ── Campo RHF ────────────────────────────────────────────────────────────
    const {
        field: { value: selectedIds, onChange },
    } = useController({ name: "categories", control })

    const currentIds: number[] = selectedIds ?? []

    // Categorías actualmente asignadas (con nombre para mostrar el chip)
    const assignedCategories = (allCategories ?? []).filter((c) => currentIds.includes(c.id))

    // Categorías disponibles para agregar (las que todavía no están asignadas)
    const availableCategories = (allCategories ?? []).filter((c) => !currentIds.includes(c.id))

    const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = Number(e.target.value)
        if (!newId) return
        onChange([...currentIds, newId])
        // Resetea el select al placeholder
        e.target.value = ""
    }

    const handleRemove = (id: number) => {
        onChange(currentIds.filter((cid) => cid !== id))
    }

    return (
        <div className="pf-field pf-span2">
            <label className="pf-label">Categorías</label>

            {/* ── Chips de categorías asignadas ─────────────────────────── */}
            <div className="cp-chips">
                {assignedCategories.length === 0 ? (
                    <span className="cp-empty">Sin categorías asignadas</span>
                ) : (
                    assignedCategories.map((cat) => (
                        <span key={cat.id} className="cp-chip">
                            {cat.name}
                            <button
                                type="button"
                                className="cp-chip__remove"
                                onClick={() => handleRemove(cat.id)}
                                aria-label={`Quitar ${cat.name}`}
                            >
                                ✕
                            </button>
                        </span>
                    ))
                )}
            </div>

            {/* ── Select para agregar ────────────────────────────────────── */}
            {loading && <p className="cp-status">Cargando categorías…</p>}
            {fetchError && <p className="cp-status cp-status--error">No se pudieron cargar las categorías</p>}

            {!loading && !fetchError && (
                <select
                    className={`pf-input cp-select ${error ? "pf-input--error" : ""}`}
                    onChange={handleAdd}
                    defaultValue=""
                >
                    <option value="" disabled>
                        {availableCategories.length === 0
                            ? "— No hay más categorías disponibles —"
                            : "Agregar categoría…"}
                    </option>
                    {availableCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            )}

            {error && <p className="pf-field-error">⚠ {error.message}</p>}
        </div>
    )
}
