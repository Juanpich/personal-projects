package org.tienda.msproducts.infraestructure.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.msproducts.application.services.ProductService;
import org.tienda.msproducts.domain.dto.ProductDto;
import org.tienda.msproducts.domain.exceptions.CategoryNotFound;
import org.tienda.msproducts.domain.exceptions.ProductNotFound;
import org.tienda.msproducts.domain.exceptions.RequiredField;
import org.tienda.msproducts.domain.exceptions.StockInvalid;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private ProductService productService;

    public ProductController(ProductService productService){
        this.productService=productService;
    }

    @GetMapping("")
    public ResponseEntity<List<ProductDto>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer stockLessThan,
            @RequestParam(required = false) Double priceGreaterThan,
            @RequestParam(required = false) Double priceLessThan) {

        return ResponseEntity.ok(
                productService.getAllProduct(category, stockLessThan, priceGreaterThan, priceLessThan)
        );
    }
    @PostMapping("")
    public ResponseEntity<?> createProduct(@RequestBody ProductDto p){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(this.productService.createProduct(p));
        }catch(RequiredField e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.productService.getById(id));
        }catch(ProductNotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody ProductDto productDto, @PathVariable Long id){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.productService.updateProduct(id, productDto));
        }catch(ProductNotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id){
        try{
            this.productService.deleteProduct(id);
            return ResponseEntity.status(HttpStatus.OK).body("DELETED");
        }catch(ProductNotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/discountstock/{stock}")
    public ResponseEntity<?> updateDiscountStock(@PathVariable Integer stock, @PathVariable Long id){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.productService.updateDiscountStock(id, stock));
        }catch(StockInvalid e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    //TODO crear el metodo para desasociar
    @PutMapping("/{id}/associate/{id_category}")
    public ResponseEntity<?> associateCategory(@PathVariable Long id, @PathVariable Long id_category){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.productService.associateCategory(id, id_category ));
        }catch(ProductNotFound | CategoryNotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/{id}/disassociate/{id_category}")
    public ResponseEntity<?> disassociateCategory(@PathVariable Long id, @PathVariable Long id_category){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.productService.disassociateCategory(id, id_category ));
        }catch(ProductNotFound | CategoryNotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
