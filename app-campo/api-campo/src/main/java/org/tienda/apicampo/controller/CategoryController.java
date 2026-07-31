package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.apicampo.domain.dto.CategoryDto;
import org.tienda.apicampo.service.CategoryService;

@RequestMapping("/category")
@RestController
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllCategories() {
            return  ResponseEntity.ok(this.service.findAll());
    }

    @GetMapping("/{id_category}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id_category") Long id_category) {
        return ResponseEntity.ok(this.service.findById(id_category));
    }

    @PostMapping("")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto cd) {
        return  ResponseEntity.status(HttpStatus.CREATED).body(this.service.createCategory(cd));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id) {
        this.service.deleteCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body("DELETED");
    }
}
