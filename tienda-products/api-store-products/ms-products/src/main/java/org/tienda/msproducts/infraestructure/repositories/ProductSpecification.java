package org.tienda.msproducts.infraestructure.repositories;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.tienda.msproducts.domain.entities.Category;
import org.tienda.msproducts.domain.entities.Product;

public class ProductSpecification {

    public static Specification<Product> hasCategory(String categoryName) {
        return (root, query, cb) -> {
            if (categoryName == null) return null;
            Join<Product, Category> categories = root.join("categories", JoinType.INNER);
            return cb.equal(cb.lower(categories.get("name")), categoryName.toLowerCase());
        };
    }

    public static Specification<Product> stockLessThan(Integer stock) {
        return (root, query, cb) -> {
            if (stock == null) return null;
            return cb.lessThan(root.get("stock"), stock);
        };
    }

    public static Specification<Product> priceGreaterThan(Double price) {
        return (root, query, cb) -> {
            if (price == null) return null;
            return cb.greaterThan(root.get("price"), price);
        };
    }

    public static Specification<Product> priceLessThan(Double price) {
        return (root, query, cb) -> {
            if (price == null) return null;
            return cb.lessThan(root.get("price"), price);
        };
    }
}
