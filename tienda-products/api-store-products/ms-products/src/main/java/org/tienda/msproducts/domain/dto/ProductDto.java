package org.tienda.msproducts.domain.dto;

import lombok.Data;
import org.tienda.msproducts.domain.entities.Category;
import org.tienda.msproducts.domain.entities.Product;

import java.util.ArrayList;
import java.util.List;


@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String brand;
    private String model;
    private String img_url;
    private List<String> categories;
}
