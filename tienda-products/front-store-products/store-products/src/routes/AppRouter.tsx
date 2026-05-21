import { BrowserRouter, Route, Navigate } from "react-router-dom"
import { RoutesWhitNotFound } from "./RoutesWhitNotFound"
import {CategoryFormPage, HomePage, ListCategory, ListProducts, ProductDetailPage, ProductFormPage, } from '../components'

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <RoutesWhitNotFound>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/products" element={<ListProducts />} />
                <Route path="/products/new" element={<ProductFormPage />} />
                <Route path="/products/edit/:id" element={<ProductFormPage />} />
                <Route path= "/category" element={<ListCategory/>}/>
                <Route path="/category/new" element={<CategoryFormPage />} />
                <Route path="/category/edit/:id" element={<CategoryFormPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* <Route element={<PrivateGuard/>}>
                    <Route path="/private/*" element={<PrivateRoute/>}/>
                </Route> */}
            </RoutesWhitNotFound>
        </BrowserRouter>
    )
}