/**
 * Molécula: tarjeta visual completa de un producto.
 * Recibe el Product ya cargado y lo renderiza.
 * No sabe nada de routing ni de API — solo presenta datos.
 * 
 * Para agregar nuevos campos en el futuro: agregá un <ProductDetailField> más.
 * Para agregar secciones (specs, reviews, etc): agregá bloques debajo del grid.
 */
import type { Product } from "../../models"
import { ProductDetailField } from "./ProductDetailField.component"

interface ProductDetailCardProps {
    product: Product
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
    return (
        <article className="pd-card">

            {/* ── Imagen ──────────────────────────────────────────────── */}
            {product.img_url && (
                <div className="pd-image-wrapper">
                    <img
                        src={product.img_url}
                        alt={product.name}
                        className="pd-image"
                    />
                </div>
            )}

            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="pd-header">
                <p className="pd-brand">{product.brand} · {product.model}</p>
                <h1 className="pd-name">{product.name}</h1>
            </div>

            {/* ── Grid de campos ──────────────────────────────────────── */}
            <div className="pd-grid">
                <ProductDetailField label="Precio"      value={`$${product.price.toFixed(2)}`} />
                <ProductDetailField label="Stock"       value={product.stock} />
                <ProductDetailField label="Descripción" value={product.description} fullWidth />
                <ProductDetailField
                    label="Categorías"
                    fullWidth
                    value={
                        product.categories.length > 0
                            ? (
                                <ul className="pd-categories">
                                    {product.categories.map((cat) => (
                                        <li key={cat} className="pd-category-chip">
                                            {cat}
                                        </li>
                                    ))}
                                </ul>
                            )
                            : null
                    }
                />
            </div>

        </article>
    )
}
