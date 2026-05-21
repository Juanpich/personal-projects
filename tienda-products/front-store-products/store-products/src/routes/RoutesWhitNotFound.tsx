import type { ReactNode } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

interface Props{
    children:ReactNode
}

export const RoutesWhitNotFound = ({children}:Props) => {
    return(
    <Routes>
        {children}
        <Route path="*" element={<Navigate to={"404"}/>}/>
        <Route path="/404" element={<h1>pagina no encontrada</h1>}/>
    </Routes>
    )
}