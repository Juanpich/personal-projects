import { useCallback, useEffect, useState } from "react";
import { categoriesApi } from "../api/categories";
import type { CategoryDto } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return categoriesApi
      .getAll()
      .then((data) => setCategories(data))
      .catch(() => setError("No se pudieron cargar las categorías"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const nameOf = (idCategory: number | null) =>
    categories.find((c) => c.idCategory === idCategory)?.name ?? "Sin categoría";

  return { categories, loading, error, nameOf, refetch };
}
