import { z } from "zod"

// ─── Category ────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
    name:        z.string().min(1, "El nombre es requerido"),
    description: z.string(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

// ─── Product ─────────────────────────────────────────────────────────────────

export const productSchema = z.object({
    name:        z.string().min(1, "El nombre es requerido"),
    brand:       z.string().min(1, "La marca es requerida"),
    model:       z.string().min(1, "El modelo es requerido"),
    price:       z.number().min(0, "El precio debe ser mayor o igual a 0"),
    stock:       z.number().int().min(0, "El stock debe ser mayor o igual a 0"),
    img_url:     z.string(),
    description: z.string(),
    categories:  z.array(z.number()),
})

export type ProductFormValues = z.infer<typeof productSchema>