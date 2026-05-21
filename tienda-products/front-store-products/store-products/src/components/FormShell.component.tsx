import type { ReactNode } from "react"

interface FormShellProps {
    /** "NUEVO" | "EDITAR" o lo que necesites */
    badgeLabel: string
    badgeColor: string
    title: string
    /** Texto del botón de cierre / volver */
    closeLabel: string
    onClose: () => void
    onSubmit: (e: React.FormEvent) => void
    submitting: boolean
    submitLabel: string
    error?: string | null
    asPage?: boolean
    children: ReactNode
}

/**
 * Contenedor visual reutilizable para cualquier formulario.
 * Se encarga del header (badge + título + botón volver),
 * el wrapper de overlay/página y los botones de acción.
 */
export function FormShell({
    badgeLabel,
    badgeColor,
    title,
    closeLabel,
    onClose,
    onSubmit,
    submitting,
    submitLabel,
    error,
    asPage = false,
    children,
}: FormShellProps) {
    const inner = (
        <div className={asPage ? "pf-page-card" : "pf-modal"} onClick={(e) => e.stopPropagation()}>
            <div className="pf-header">
                <span className="pf-badge" style={{ background: badgeColor }}>
                    {badgeLabel}
                </span>
                <h2 className="pf-title">{title}</h2>
                <button className="pf-close" onClick={onClose} aria-label={closeLabel}>
                    {asPage ? "← Volver" : "✕"}
                </button>
            </div>

            <form className="pf-form" onSubmit={onSubmit}>
                {children}

                {error && <p className="pf-error">⚠ {error}</p>}

                <div className="pf-actions">
                    <button
                        type="button"
                        className="pf-btn pf-btn--ghost"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="pf-btn pf-btn--primary"
                        disabled={submitting}
                    >
                        {submitting ? "Guardando…" : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    )

    if (!asPage) {
        return (
            <div className="pf-overlay" onClick={onClose}>
                {inner}
            </div>
        )
    }

    return <main className="pf-page">{inner}</main>
}
