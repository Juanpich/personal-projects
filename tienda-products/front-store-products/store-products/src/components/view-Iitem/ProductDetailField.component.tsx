/**
 * Átomo: muestra un campo label + valor en el detalle de producto.
 * Acepta cualquier ReactNode como valor para escalar (badges, links, etc).
 */
import type { ReactNode } from "react"

interface ProductDetailFieldProps {
    label: string
    value: ReactNode
    /** Ocupa ancho completo en el grid */
    fullWidth?: boolean
}

export function ProductDetailField({ label, value, fullWidth = false }: ProductDetailFieldProps) {
    return (
        <div className={`pd-field ${fullWidth ? "pd-field--full" : ""}`}>
            <span className="pd-field__label">{label}</span>
            <span className="pd-field__value">{value ?? <em className="pd-field__empty">—</em>}</span>
        </div>
    )
}
