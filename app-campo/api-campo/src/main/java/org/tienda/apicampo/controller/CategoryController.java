package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.apicampo.domain.dto.CategoryDto;
import org.tienda.apicampo.domain.exceptions.NonExistentCategoryException;
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
        try{
            return  ResponseEntity.ok(this.service.findAll());
        }catch(Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{id_category}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id_category") Long id_category) {
        CategoryDto cd = this.service.findById(id_category);
        if(cd==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cd);
    }

    @PostMapping("")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto cd) {
        try{
            return  ResponseEntity.ok(this.service.createCategory(cd));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id) {
        try{
            this.service.deleteCategory(id);
            return ResponseEntity.status(HttpStatus.OK).body("DELETED");
        }catch(NonExistentCategoryException e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
