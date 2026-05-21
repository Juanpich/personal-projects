import { associateCategory, disassociateCategory, getProductById, newProduct, updateProduct } from "../service"
import { ProductForm } from "./ProductForm.component"
import { useEntityFormPage } from "./useEntityFormPage.hook"
import type { ProductFormValues } from "./schemas"
import "../css/products.css"

/**
 * Lógica de asociación de categorías:
 *
 * CREAR:
 *   1. Crea el producto → obtiene el nuevo productId
 *   2. Por cada categoryId seleccionado → associateCategory(productId, categoryId)
 *
 * EDITAR:
 *   1. Actualiza el producto (campos básicos)
 *   2. Calcula diff entre categorías anteriores y nuevas
 *      - Las que estaban y ya no están  → disassociateCategory
 *      - Las que no estaban y ahora sí  → associateCategory
 */
export const ProductFormPage = () => {
    const { id, isEditing, entity, loading, error, navigate } = useEntityFormPage({
        fetchById: getProductById,
        listPath: "/products",
    })

    const syncCategories = async (productId: number, nextIds: number[], prevIds: number[] = []) => {
        const toAdd    = nextIds.filter((cid) => !prevIds.includes(cid))
        const toRemove = prevIds.filter((cid) => !nextIds.includes(cid))

        await Promise.all([
            ...toAdd.map((cid)    => associateCategory(productId, cid).call),
            ...toRemove.map((cid) => disassociateCategory(productId, cid).call),
        ])
    }

    const handleSubmit = async (data: ProductFormValues) => {
        const { categories: nextCategoryIds, ...productData } = data

        if (isEditing && id) {
            // 1. Actualizar datos del producto
            await updateProduct(Number(id), productData)
            // 2. Sincronizar categorías (solo las que cambiaron)
            const prevCategoryIds = entity?.categories ?? []
            await syncCategories(Number(id), nextCategoryIds, prevCategoryIds)
        } else {
            // 1. Crear producto → la API devuelve el producto creado con su id
            const { call } = newProduct(productData)
            const response = await call
            const newProductId = response.data.id
            // 2. Asociar todas las categorías seleccionadas al nuevo producto
            await syncCategories(newProductId, nextCategoryIds)
        }

        navigate("/products")
    }

    if (loading) return <p className="lp-status">Cargando producto…</p>
    if (error)   return <p className="lp-status lp-status--error">{error}</p>

    return (
        <ProductForm
            initialData={entity}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/products")}
            asPage
        />
    )
}