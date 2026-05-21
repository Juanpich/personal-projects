import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Category } from "../models"

import { FormShell } from "./FormShell.component"
import { InputField } from "./InputField.component"
import { TextareaField } from "./TextareaField.component"
import "../css/products.css"
import { categorySchema, type CategoryFormValues } from "./schemas"

interface CategoryFormProps {
    initialData?: Category
    onSubmit: (data: CategoryFormValues) => Promise<void>
    onCancel: () => void
    asPage?: boolean
}

export const CategoryForm = ({ initialData, onSubmit, onCancel, asPage = false }: CategoryFormProps) => {
    const isEditing = Boolean(initialData)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        mode: "onBlur",
        defaultValues: { name: "", description: "" },
    })

    // Sincroniza el formulario cuando llegan datos de edición
    useEffect(() => {
        if (initialData) {
            const { id, ...rest } = initialData
            reset(rest)
        } else {
            reset({ name: "", description: "" })
        }
    }, [initialData, reset])

    const handleFormSubmit = handleSubmit(async (data) => {
        await onSubmit(data)
    })

    return (
        <FormShell
            badgeLabel={isEditing ? "EDITAR" : "NUEVO"}
            badgeColor={isEditing ? "var(--c-badge-edit)" : "var(--c-badge-new)"}
            title={isEditing ? `Editando: ${initialData?.name}` : "Crear Categoría"}
            closeLabel="Volver"
            onClose={onCancel}
            onSubmit={handleFormSubmit}
            submitting={isSubmitting}
            submitLabel={isEditing ? "Guardar cambios" : "Crear categoría"}
            asPage={asPage}
        >
            <div className="pf-grid">
                <InputField
                    name="name"
                    control={control}
                    label="Nombre"
                    required
                    error={errors.name}
                />
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
