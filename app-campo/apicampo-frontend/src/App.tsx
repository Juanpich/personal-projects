import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { AnimalsListPage } from "./pages/AnimalsListPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { LotesPage } from "./pages/LotesPage";
import { UsersPage } from "./pages/UsersPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/animales"
            element={
              <ProtectedRoute>
                <Layout>
                  <AnimalsListPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoriesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lotes"
            element={
              <ProtectedRoute>
                <Layout>
                  <LotesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
