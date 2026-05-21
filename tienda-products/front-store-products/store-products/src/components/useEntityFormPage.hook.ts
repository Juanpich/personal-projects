import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface UseEntityFormPageOptions<T> {
    /** Función que carga la entidad por id cuando estamos en modo edición */
    fetchById: (id: number) => { call: Promise<{ data: T }>; controller: AbortController }
    /** Ruta a la que navegar después de guardar o cancelar */
    listPath: string
}

interface UseEntityFormPageResult<T> {
    id: string | undefined
    isEditing: boolean
    entity: T | undefined
    loading: boolean
    error: string | null
    navigate: ReturnType<typeof useNavigate>
}

/**
 * Hook genérico que maneja la lógica común de las páginas de formulario
 * (leer el :id de la URL, cargar la entidad si estamos editando, manejar errores).
 *
 * Úsalo tanto en CategoryFormPage como en ProductFormPage.
 */
export function useEntityFormPage<T>({
    fetchById,
    listPath,
}: UseEntityFormPageOptions<T>): UseEntityFormPageResult<T> {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEditing = Boolean(id)

    const [entity, setEntity] = useState<T | undefined>(undefined)
    const [loading, setLoading] = useState(isEditing)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        let isMounted = true
        const { call, controller } = fetchById(Number(id))

        call
            .then((res) => { if (isMounted) setEntity(res.data) })
            .catch((err: unknown) => {
                if (isMounted)
                    setError(err instanceof Error ? err.message : "No se pudo cargar el recurso")
            })
            .finally(() => { if (isMounted) setLoading(false) })

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
    //  fetchById es estable si el caller la pasa con useCallback o como referencia constante

    return { id, isEditing, entity, loading, error, navigate }
}
