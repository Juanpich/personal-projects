package org.tienda.apicampo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tienda.apicampo.domain.dto.CategoryDto;
import org.tienda.apicampo.domain.entities.Category;
import org.tienda.apicampo.repository.CategoryRepository;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repository;

    public CategoryService (CategoryRepository repo) {
        this.repository = repo;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> findAll() {
        return repository.findAll().stream().map(CategoryDto::new).toList();
    }
    @Transactional(readOnly = true)
    public CategoryDto findById(Long id) {
        return this.repository.findById(id).map(CategoryDto::new).orElse(null);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        this.repository.save(category);
        return new CategoryDto(category);
    }


}
