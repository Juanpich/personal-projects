package org.tienda.apicampo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tienda.apicampo.domain.entities.Category;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CategoryDto {
    private Long idCategory;
    private String name;

    public CategoryDto(Category category) {
        this.idCategory = category.getIdCategory();
        this.name = category.getName();

    }
}
