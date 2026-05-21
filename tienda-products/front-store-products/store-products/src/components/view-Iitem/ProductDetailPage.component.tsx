/**
 * Página de detalle de producto — ruta: /products/:id
 *
 * Responsabilidades de esta página:
 *  - Leer el :id de la URL
 *  - Orquestar el hook de datos
 *  - Manejar los estados loading / error
 *  - Componer los átomos/moléculas (ProductDetailCard + ProductDetailActions)
 *  - Manejar navegación (volver, ir a editar)
 *
 * Para agregar acciones futuras (borrar, duplicar, etc):
 *  - Agregá un objeto al array `actions` con su key y su nodo JSX.
 */
import { useNavigate, useParams } from "react-router-dom"
import { useProductDetail } from "./useProductDetail.hook"
import { ProductDetailCard } from "./ProductDetailCard.component"
import { ProductDetailActions } from "./ProductDetailActions.component"
import "../../css/products.css"

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { product, loading, error } = useProductDetail(Number(id))

    if (loading) return <p className="lp-status">Cargando producto…</p>
    if (error)   return <p className="lp-status lp-status--error">{error}</p>
    if (!product) return <p className="lp-status">Producto no encontrado.</p>

    return (
        <main className="pd-page">
            <ProductDetailActions
                onBack={() => navigate("/products")}
                actions={[
                    {
                        key: "edit",
                        node: (
                            <button
                                className="lp-btn lp-btn--edit"
                                onClick={() => navigate(`/products/edit/${product.id}`)}
                            >
                                Editar
                            </button>
                        ),
                    },
                    // Para agregar más acciones en el futuro:
                    // { key: "delete", node: <button ...>Borrar</button> },
                    // { key: "duplicate", node: <button ...>Duplicar</button> },
                ]}
            />

            <ProductDetailCard product={product} />
        </main>
    )
}
