package org.tienda.msproducts.infraestructure.repositories;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.tienda.msproducts.domain.dto.ProductDto;
import org.tienda.msproducts.domain.entities.Product;

import java.util.Collection;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "categories")
    List<Product> findAll(Specification<Product> spec);

    List<Product> name(String name);

}
