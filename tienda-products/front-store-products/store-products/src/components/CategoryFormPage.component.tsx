import { getCategoryById, updateCategory, newCategory } from "../service"
import { CategoryForm } from "./CategoryForm.component"
import { useEntityFormPage } from "./useEntityFormPage.hook"

import "../css/products.css"
import type { CategoryFormValues } from "./schemas"

export const CategoryFormPage = () => {
    const { id, isEditing, entity, loading, error, navigate } = useEntityFormPage({
        fetchById: getCategoryById,
        listPath: "/category",
    })

    const handleSubmit = async (data: CategoryFormValues) => {
        if (isEditing && id) {
            await updateCategory(Number(id), data)
        } else {
            await newCategory(data)
        }
        navigate("/category")
    }

    if (loading) return <p className="lp-status">Cargando categoría…</p>
    if (error)   return <p className="lp-status lp-status--error">{error}</p>

    return (
        <CategoryForm
            initialData={entity}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/category")}
            asPage
        />
    )
}
