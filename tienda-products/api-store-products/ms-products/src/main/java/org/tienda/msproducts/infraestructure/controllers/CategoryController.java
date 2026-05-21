package org.tienda.msproducts.infraestructure.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.msproducts.application.services.CategoryService;
import org.tienda.msproducts.domain.dto.CategoryDto;
import org.tienda.msproducts.domain.exceptions.CategoryNotFound;
import org.tienda.msproducts.domain.exceptions.RequiredField;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("")
    public ResponseEntity<List<CategoryDto>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(this.categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.categoryService.getById(id));
        } catch (CategoryNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @PostMapping("")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto c) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(this.categoryService.createCategory(c));
        } catch (RequiredField e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@RequestBody CategoryDto categoryDto, @PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.categoryService.updateCategory(id, categoryDto));
        } catch (CategoryNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            this.categoryService.deleteCategory(id);
            return ResponseEntity.status(HttpStatus.OK).body("DELETED");
        } catch (CategoryNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}