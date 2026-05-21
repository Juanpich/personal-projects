/**
 * Átomo: barra de acciones del detalle de producto.
 * Hoy tiene "← Volver" y "Editar". Diseñado para escalar:
 * agregá más ActionItem al array sin tocar el layout.
 */
import type { ReactNode } from "react"

interface ActionItem {
    key: string
    node: ReactNode
}

interface ProductDetailActionsProps {
    /** Acciones principales (derecha). Hoy: Editar. Mañana: Borrar, Duplicar, etc. */
    actions?: ActionItem[]
    /** Acción de volver (izquierda) */
    onBack: () => void
}

export function ProductDetailActions({ actions = [], onBack }: ProductDetailActionsProps) {
    return (
        <div className="pd-actions">
            <button className="lp-btn lp-btn--ghost-sm" onClick={onBack}>
                ← Volver
            </button>
            {actions.length > 0 && (
                <div className="pd-actions__right">
                    {actions.map((a) => (
                        <span key={a.key}>{a.node}</span>
                    ))}
                </div>
            )}
        </div>
    )
}
