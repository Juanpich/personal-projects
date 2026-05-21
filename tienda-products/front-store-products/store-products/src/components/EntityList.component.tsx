import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface EntityListProps<T extends { id: number }> {
    data: T[] | undefined | null
    loading: boolean
    error: Error | null
    heading: string
    createPath: string
    createLabel: string
    homePath?: string
    renderItem: (item: T) => ReactNode
    onDelete: (id: number) => void
    onEdit: (id: number) => void
    /** Opcional — si se pasa, aparece un botón "Ver" en cada card */
    onView?: (id: number) => void
}

export function EntityList<T extends { id: number }>({
    data,
    loading,
    error,
    heading,
    createPath,
    createLabel,
    homePath = "/home",
    renderItem,
    onDelete,
    onEdit,
    onView,
}: EntityListProps<T>) {
    const navigate = useNavigate()

    if (loading) return <p className="lp-status">Cargando {heading.toLowerCase()}…</p>
    if (error)   return <p className="lp-status lp-status--error">Error: {error.message}</p>

    return (
        <section className="lp-section">
            <div className="lp-topbar">
                <div className="lp-topbar-left">
                    <button className="lp-btn lp-btn--ghost-sm" onClick={() => navigate(homePath)}>
                        ← Home
                    </button>
                    <h1 className="lp-heading">{heading}</h1>
                </div>
                <button className="lp-btn lp-btn--create" onClick={() => navigate(createPath)}>
                    {createLabel}
                </button>
            </div>

            <ul className="lp-list">
                {data?.map((item) => (
                    <li key={item.id} className="lp-card">
                        {renderItem(item)}
                        <div className="lp-card__actions">
                            {onView && (
                                <button className="lp-btn lp-btn--view" onClick={() => onView(item.id)}>
                                    Ver
                                </button>
                            )}
                            <button className="lp-btn lp-btn--edit" onClick={() => onEdit(item.id)}>
                                Editar
                            </button>
                            <button className="lp-btn lp-btn--delete" onClick={() => onDelete(item.id)}>
                                Borrar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
