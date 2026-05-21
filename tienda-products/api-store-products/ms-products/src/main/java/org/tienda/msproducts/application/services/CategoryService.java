package org.tienda.msproducts.application.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.tienda.msproducts.domain.dto.CategoryDto;
import org.tienda.msproducts.domain.entities.Category;
import org.tienda.msproducts.domain.exceptions.CategoryNotFound;
import org.tienda.msproducts.domain.exceptions.RequiredField;
import org.tienda.msproducts.infraestructure.repositories.CategoryRepository;

import java.util.List;

@Service
public class CategoryService {
    private CategoryRepository categoryRepo;

    public CategoryService(CategoryRepository cr) {
        this.categoryRepo = cr;
    }

    @Transactional
    public List<CategoryDto> getAllCategories() {
        return this.categoryRepo.findAll()
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public CategoryDto getById(Long id) {
        Category category = this.categoryRepo.findById(id)
                .orElseThrow(() -> new CategoryNotFound(id.toString()));
        return toDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto c) {
        if (c.getName().isEmpty() || c.getDescription().isEmpty())
            throw new RequiredField("");
        Category cat = new Category();
        cat.setName(c.getName());
        cat.setDescription(c.getDescription());
        return toDto(this.categoryRepo.save(cat));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto c) {
        Category catOld = this.categoryRepo.findById(id)
                .orElseThrow(() -> new CategoryNotFound(id.toString()));
        if (c.getName() != null && !c.getName().isEmpty())
            catOld.setName(c.getName());
        if (c.getDescription() != null && !c.getDescription().isEmpty())
            catOld.setDescription(c.getDescription());
        return toDto(this.categoryRepo.save(catOld));
    }

    @Transactional
    public void deleteCategory(Long id) {
        //TODO que se hace con los productos asociados a esa categoria
        Category cat = this.categoryRepo.findById(id)
                .orElseThrow(() -> new CategoryNotFound(id.toString()));
        this.categoryRepo.delete(cat);
    }

    private CategoryDto toDto(Category c) {
        CategoryDto dto = new CategoryDto();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDescription(c.getDescription());
        return dto;
    }
}