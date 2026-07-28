package org.tienda.apicampo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tienda.apicampo.domain.dto.CategoryDto;
import org.tienda.apicampo.domain.entities.Category;
import org.tienda.apicampo.domain.exceptions.DatabaseException;
import org.tienda.apicampo.domain.exceptions.NonExistentCategoryException;
import org.tienda.apicampo.repository.AnimalRepository;
import org.tienda.apicampo.repository.CategoryRepository;

import java.sql.SQLException;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repository;
    private final AnimalRepository animalRepository;

    public CategoryService(CategoryRepository categoryRepository, AnimalRepository animalRepository) {
        this.repository = categoryRepository;
        this.animalRepository = animalRepository;
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

    @Transactional
    public void deleteCategory(Long id) throws NonExistentCategoryException, DatabaseException {
        if(!this.repository.existsById(id)) {
            throw new NonExistentCategoryException(id.toString());
        }
        if(this.animalRepository.existsByCategory_IdCategory(id)){
            throw new DatabaseException("The category is associated");
        }
        this.repository.deleteById(id);
    }
}
