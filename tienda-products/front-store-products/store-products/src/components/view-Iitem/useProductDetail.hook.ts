/**
 * Hook de datos para el detalle de producto.
 * Separa la lógica de fetch del componente visual.
 * Reutilizable si en el futuro querés el detalle en otro contexto
 * (modal, sidebar, widget embebido, etc).
 */
import { useEffect, useState } from "react"
import { getProductById } from "../../service"
import type { Product } from "../../models"

interface UseProductDetailResult {
    product: Product | undefined
    loading: boolean
    error: string | null
}

export function useProductDetail(id: number): UseProductDetailResult {
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [loading, setLoading]  = useState(true)
    const [error, setError]      = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        const { call, controller } = getProductById(id)

        call
            .then((res) => { if (isMounted) setProduct(res.data) })
            .catch((err: unknown) => {
                if (isMounted)
                    setError(err instanceof Error ? err.message : "No se pudo cargar el producto")
            })
            .finally(() => { if (isMounted) setLoading(false) })

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [id])

    return { product, loading, error }
}
