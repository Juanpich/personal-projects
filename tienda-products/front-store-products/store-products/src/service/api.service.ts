
import type { Category, Product, UseApiCall } from "../models"
import { loadAbort } from "../utilities"
import { axiosIntance } from "./axios.service"


const PRODUCTS_URL = '/products'
const CATEGORY_URL = '/category'

export interface ProductFilters {
    category?: string;
    stockLessThan?: number;
    priceGreaterThan?: number;
    priceLessThan?: number;
}

//PRODUCTS
export const getAllProducts = (filters?: ProductFilters): UseApiCall<Product[]> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.get<Product[]>(PRODUCTS_URL, {
            params: filters,
            signal: controller.signal
        }),
        controller
    }
}

export const getProductById = (id: number): UseApiCall<Product> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.get<Product>(`${PRODUCTS_URL}/${id}`, {
            signal: controller.signal
        }),
        controller
    }
}

export const newProduct = (product: Omit<Product, 'id' | 'categories'>): UseApiCall<Product> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.post<Product>(PRODUCTS_URL, product, {
            signal: controller.signal
        }),
        controller
    }
}

export const updateProduct = (id: number, product: Partial<Product>): UseApiCall<Product> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.put<Product>(`${PRODUCTS_URL}/${id}`, product, {
            signal: controller.signal
        }),
        controller
    }
}

export const deleteProduct = (id: number): UseApiCall<void> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.delete<void>(`${PRODUCTS_URL}/${id}`, {
            signal: controller.signal
        }),
        controller
    }
}

export const associateCategory = (id_product:number, id_category: number):UseApiCall<Product> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.put<Product>(`${PRODUCTS_URL}/${id_product}/associate/${id_category}`, {
            signal: controller.signal
        }),
        controller
    }
}

export const disassociateCategory = (id_product:number, id_category: number):UseApiCall<Product> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.put<Product>(`${PRODUCTS_URL}/${id_product}/disassociate/${id_category}`, {
            signal: controller.signal
        }),
        controller
    }
}

//CATEGORY
export const getCategories = (): UseApiCall<Category[]> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.get<Category[]>(CATEGORY_URL, {
            signal: controller.signal
        }),
        controller
    }
}

export const getCategoryById = (id: number): UseApiCall<Category> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.get<Category>(`${CATEGORY_URL}/${id}`, {
            signal: controller.signal
        }),
        controller
    }
}

export const newCategory = (newCat :Omit<Category, 'id'>): UseApiCall<Category> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.post<Category>(CATEGORY_URL, newCat, {
            signal: controller.signal
        }),
        controller
    }
}

export const updateCategory = (id: number, category: Partial<Category>): UseApiCall<Category> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.put<Product>(`${CATEGORY_URL}/${id}`, category, {
            signal: controller.signal
        }),
        controller
    }
}

export const deleteCategory = (id: number): UseApiCall<void> => {
    const controller = loadAbort()
    return {
        call: axiosIntance.delete<void>(`${CATEGORY_URL}/${id}`, {
            signal: controller.signal
        }),
        controller
    }
}