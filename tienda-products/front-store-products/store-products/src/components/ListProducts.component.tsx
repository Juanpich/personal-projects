import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import type { Product } from "../models"
import { useApi } from "../hooks"
import { deleteProduct, getAllProducts } from "../service"
import type { ProductFilters } from "../service"
import { EntityList } from "./EntityList.component"

export const ListProducts = () => {
    const navigate = useNavigate()
    const apiCall = useCallback((filters?: ProductFilters) => getAllProducts(filters), [])

    const { data, loading, error, refetch } = useApi<Product[], ProductFilters | undefined>(
        apiCall,
        { autoFetch: true, params: undefined }
    )

    const handleDelete = (id: number) => {
        if (!window.confirm("¿Seguro que querés borrar este producto?")) return
        const { call } = deleteProduct(id)
        call
            .then(() => refetch())
            .catch((err: unknown) => alert(err instanceof Error ? err.message : "No se pudo eliminar"))
    }

    return (
        <EntityList
            data={data}
            loading={loading}
            error={error}
            heading="Productos"
            createPath="/products/new"
            createLabel="+ Nuevo producto"
            onEdit={(id) => navigate(`/products/edit/${id}`)}
            onDelete={handleDelete}
            // Botón extra "Ver" que navega al detalle
            onView={(id) => navigate(`/products/${id}`)}
            renderItem={(item) => (
                <>
                    {item.img_url && (
                        <img src={item.img_url} alt={item.name} className="lp-card__img" />
                    )}
                    <div className="lp-card__body">
                        <span className="lp-card__brand">{item.brand} · {item.model}</span>
                        <h3 className="lp-card__name">{item.name}</h3>
                        <p className="lp-card__desc">{item.description}</p>
                        <div className="lp-card__footer">
                            <span className="lp-card__price">${item.price.toFixed(2)}</span>
                            <span className="lp-card__stock">Stock: {item.stock}</span>
                        </div>
                    </div>
                </>
            )}
        />
    )
}
