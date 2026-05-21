import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import type { Category } from "../models"
import { useApi } from "../hooks"
import { deleteCategory, getCategories } from "../service"
import { EntityList } from "./EntityList.component"

export const ListCategory = () => {
    const navigate = useNavigate()
    const apiCall = useCallback(() => getCategories(), [])

    const { data, loading, error, refetch } = useApi<Category[], []>(apiCall, {
        autoFetch: true,
        params: [],
    })

    const handleDelete = (id: number) => {
        if (!window.confirm("¿Seguro que querés borrar esta categoría?")) return
        const { call } = deleteCategory(id)
        call
            .then(() => refetch())
            .catch((err: unknown) => alert(err instanceof Error ? err.message : "No se pudo eliminar"))
    }

    return (
        <EntityList
            data={data}
            loading={loading}
            error={error}
            heading="Categorías"
            createPath="/category/new"
            createLabel="+ Nueva categoría"
            onEdit={(id) => navigate(`/category/edit/${id}`)}
            onDelete={handleDelete}
            renderItem={(item) => (
                <div className="lp-card__body">
                    <h3 className="lp-card__name">{item.name}</h3>
                    <p className="lp-card__desc">{item.description}</p>
                </div>
            )}
        />
    )
}
