import { useCallback, useEffect, useState } from "react"
import { useApi } from "../hooks"
import type { Category } from "../models"
import { associateCategory, disassociateCategory, getCategories } from "../service"
import '../css/categorySelector.css'

interface CategorySelectorProps {
    /** ID del producto. En modo creación llega undefined hasta que se guarda. */
    productId: number | undefined
    /** Categorías que el producto ya tiene (nombres como strings, según el modelo) */
    currentCategories: string[]
    /** Modo: "edit" = tiempo real | "create" = acumula IDs para aplicar después */
    mode: "edit" | "create"
    /** Solo en modo create: callback para que ProductFormPage aplique las asociaciones */
    onPendingChange?: (ids: number[]) => void
}

/**
 * Muestra las categorías actuales del producto y un select para asociar/desasociar.
 *
 * - Modo "edit":  cada acción llama a la API inmediatamente.
 * - Modo "create": acumula los IDs seleccionados y los expone vía onPendingChange
 *                  para que el padre los aplique una vez creado el producto.
 */
export const CategorySelector = ({
    productId,
    currentCategories,
    mode,
    onPendingChange,
}: CategorySelectorProps) => {
    // ── Carga el catálogo de categorías disponibles ──────────────────────────
    const apiCall = useCallback(() => getCategories(), [])
    const { data: allCategories, loading, error } = useApi<Category[], []>(apiCall, {
        autoFetch: true,
        params: [],
    })

    // ── Estado de categorías asociadas al producto (por nombre) ──────────────
    const [associated, setAssociated] = useState<string[]>(currentCategories)

    // ── IDs pendientes (solo modo "create") ──────────────────────────────────
    const [pendingIds, setPendingIds] = useState<number[]>([])

    // ── Feedback por ítem ────────────────────────────────────────────────────
    const [busyId, setBusyId] = useState<number | null>(null)
    const [feedbackId, setFeedbackId] = useState<{ id: number; ok: boolean } | null>(null)

    // Sincroniza si llegan nuevas currentCategories desde afuera (ej: después de reload)
    useEffect(() => {
        setAssociated(currentCategories)
    }, [currentCategories])

    const showFeedback = (id: number, ok: boolean) => {
        setFeedbackId({ id, ok })
        setTimeout(() => setFeedbackId(null), 1400)
    }

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleToggle = async (cat: Category) => {
        const isAssociated = associated.includes(cat.name)

        if (mode === "create") {
            // Solo acumula / quita del array de pendientes
            const next = isAssociated
                ? pendingIds.filter((id) => id !== cat.id)
                : [...pendingIds, cat.id]
            setPendingIds(next)
            setAssociated(
                isAssociated
                    ? associated.filter((n) => n !== cat.name)
                    : [...associated, cat.name]
            )
            onPendingChange?.(next)
            return
        }

        // Modo "edit": llamada inmediata a la API
        if (!productId) return
        setBusyId(cat.id)
        try {
            if (isAssociated) {
                await disassociateCategory(productId, cat.id).call
                setAssociated((prev) => prev.filter((n) => n !== cat.name))
            } else {
                await associateCategory(productId, cat.id).call
                setAssociated((prev) => [...prev, cat.name])
            }
            showFeedback(cat.id, true)
        } catch {
            showFeedback(cat.id, false)
        } finally {
            setBusyId(null)
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
    if (loading) return <p className="cs-status">Cargando categorías…</p>
    if (error)   return <p className="cs-status cs-status--error">No se pudieron cargar las categorías.</p>

    const availableToAdd = allCategories?.filter((c) => !associated.includes(c.name)) ?? []
    const associatedCats = allCategories?.filter((c) => associated.includes(c.name)) ?? []

    return (
        <div className="cs-wrapper">
            {/* ── Categorías actuales ── */}
            <div className="cs-section">
                <p className="cs-label">
                    Categorías asociadas
                    {associatedCats.length > 0 && (
                        <span className="cs-count">{associatedCats.length}</span>
                    )}
                </p>

                {associatedCats.length === 0 ? (
                    <p className="cs-empty">Sin categorías asignadas.</p>
                ) : (
                    <ul className="cs-tags">
                        {associatedCats.map((cat) => {
                            const busy = busyId === cat.id
                            const fb = feedbackId?.id === cat.id
                            return (
                                <li key={cat.id} className={`cs-tag ${fb ? (feedbackId!.ok ? "cs-tag--ok" : "cs-tag--err") : ""}`}>
                                    <span className="cs-tag__name">{cat.name}</span>
                                    <button
                                        type="button"
                                        className="cs-tag__remove"
                                        onClick={() => handleToggle(cat)}
                                        disabled={busy}
                                        aria-label={`Desasociar ${cat.name}`}
                                    >
                                        {busy ? "…" : "✕"}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {/* ── Agregar categoría ── */}
            {availableToAdd.length > 0 && (
                <div className="cs-section">
                    <p className="cs-label">Agregar categoría</p>
                    <div className="cs-add-row">
                        <select
                            className="cs-select"
                            defaultValue=""
                            onChange={(e) => {
                                const id = Number(e.target.value)
                                const cat = allCategories?.find((c) => c.id === id)
                                if (cat) {
                                    handleToggle(cat)
                                    // Reset el select visualmente
                                    e.target.value = ""
                                }
                            }}
                        >
                            <option value="" disabled>
                                Seleccioná una categoría…
                            </option>
                            {availableToAdd.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}
