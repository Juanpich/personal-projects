package org.tienda.msproducts.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.Data;
import org.tienda.msproducts.domain.dto.ProductDto;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String brand;
    private String model;
    private String img_url;

    @ManyToMany
    @JoinTable(
            name = "product_category",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();


}
