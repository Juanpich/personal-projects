import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { FieldError } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Product } from "../models"
import { productSchema, type ProductFormValues } from "./schemas"
import { FormShell } from "./FormShell.component"
import { InputField } from "./InputField.component"
import { TextareaField } from "./TextareaField.component"
import { CategoryPicker } from "./CategoryPicker.component"
import "../css/products.css"

interface ProductFormProps {
    initialData?: Product
    onSubmit: (data: ProductFormValues) => Promise<void>
    onCancel: () => void
    asPage?: boolean
}

const EMPTY_PRODUCT: ProductFormValues = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    brand: "",
    model: "",
    img_url: "",
    categories: [],
}

export const ProductForm = ({ initialData, onSubmit, onCancel, asPage = false }: ProductFormProps) => {
    const isEditing = Boolean(initialData)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        mode: "onBlur",
        defaultValues: EMPTY_PRODUCT,
    })

    useEffect(() => {
        if (initialData) {
            const { id, ...rest } = initialData
            reset(rest)
        } else {
            reset(EMPTY_PRODUCT)
        }
    }, [initialData, reset])

    const handleFormSubmit = handleSubmit(async (data) => {
        await onSubmit(data)
    })

    return (
        <FormShell
            badgeLabel={isEditing ? "EDITAR" : "NUEVO"}
            badgeColor={isEditing ? "var(--c-badge-edit)" : "var(--c-badge-new)"}
            title={isEditing ? `Editando: ${initialData?.name}` : "Crear Producto"}
            closeLabel="Volver"
            onClose={onCancel}
            onSubmit={handleFormSubmit}
            submitting={isSubmitting}
            submitLabel={isEditing ? "Guardar cambios" : "Crear producto"}
            asPage={asPage}
        >
            <div className="pf-grid">
                <InputField name="name"    control={control} label="Nombre"        required error={errors.name} />
                <InputField name="brand"   control={control} label="Marca"         required error={errors.brand} />
                <InputField name="model"   control={control} label="Modelo"        required error={errors.model} />
                <InputField name="price"   control={control} label="Precio"        required type="number" min={0} step={0.01} error={errors.price} />
                <InputField name="stock"   control={control} label="Stock"         required type="number" min={0} error={errors.stock} />
                <InputField name="img_url" control={control} label="URL de imagen" className="pf-span2" error={errors.img_url} />

                {/* Selector de categorías — ocupa todo el ancho del grid */}
                <CategoryPicker control={control} error={errors.categories as FieldError | undefined} />
            </div>

            <TextareaField
                name="description"
                control={control}
                label="Descripción"
                rows={3}
                error={errors.description}
            />
        </FormShell>
    )
}