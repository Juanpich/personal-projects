package org.tienda.msproducts.application.services;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.tienda.msproducts.domain.entities.Category;
import org.tienda.msproducts.domain.exceptions.CategoryNotFound;
import org.tienda.msproducts.domain.exceptions.ProductNotFound;
import org.tienda.msproducts.domain.exceptions.RequiredField;
import org.tienda.msproducts.domain.dto.ProductDto;
import org.tienda.msproducts.domain.entities.Product;
import org.tienda.msproducts.domain.exceptions.StockInvalid;
import org.tienda.msproducts.infraestructure.repositories.CategoryRepository;
import org.tienda.msproducts.infraestructure.repositories.ProductRepository;
import org.tienda.msproducts.infraestructure.repositories.ProductSpecification;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private ProductRepository productRepo;
    private CategoryRepository categoryRepo;

    public ProductService(ProductRepository pr, CategoryRepository cr) {
        this.productRepo = pr;
        this.categoryRepo = cr;
    }

    @Transactional()
    public List<ProductDto> getAllProduct(String category, Integer stockLessThan,
                                          Double priceGreaterThan, Double priceLessThan) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.hasCategory(category))
                .and(ProductSpecification.stockLessThan(stockLessThan))
                .and(ProductSpecification.priceGreaterThan(priceGreaterThan))
                .and(ProductSpecification.priceLessThan(priceLessThan));

        return this.productRepo.findAll(spec)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional()
    public ProductDto getById(Long id){
        Product p = this.productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFound(id.toString()));
        return toDto(p);
    }
    @Transactional
    public ProductDto createProduct(ProductDto p){

        if(p.getName().isEmpty() || p.getDescription().isEmpty() || p.getBrand().isEmpty() || p.getModel().isEmpty() || p.getPrice() == null || p.getStock() == null)
            throw new RequiredField("Todos los campos deben estar completos");

        Product pro =  new Product();
        pro.setName(p.getName());
        pro.setDescription(p.getDescription());
        pro.setBrand(p.getBrand());
        pro.setModel(p.getModel());
        pro.setPrice(p.getPrice());
        pro.setImg_url(p.getImg_url());
        pro.setStock(p.getStock());
        return this.toDto(this.productRepo.save(pro));
    }
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto p) {
        Product pOld = this.productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFound(id.toString()));

        if (p.getName() != null && !p.getName().isEmpty())
            pOld.setName(p.getName());
        if (p.getDescription() != null && !p.getDescription().isEmpty())
            pOld.setDescription(p.getDescription());
        if (p.getBrand() != null && !p.getBrand().isEmpty())
            pOld.setBrand(p.getBrand());
        if (p.getModel() != null && !p.getModel().isEmpty())
            pOld.setModel(p.getModel());
        if (p.getImg_url() != null && !p.getImg_url().isEmpty())
            pOld.setImg_url(p.getImg_url());
        if (p.getPrice() != null)
            pOld.setPrice(p.getPrice());
        if (p.getStock() != null)
            pOld.setStock(p.getStock());

        return toDto(this.productRepo.save(pOld));
    }
    @Transactional()
    public void deleteProduct(Long id){
        //verificar que el producto con ese id exista
        Product pOld = this.productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFound(id.toString()));
        this.productRepo.delete(pOld);
    }

    @Transactional()
    public ProductDto updateDiscountStock(Long id, Integer stock) {
        Product pOld = this.productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFound(id.toString()));
        if((pOld.getStock() - stock) < 0 )
            throw new StockInvalid("");
        pOld.setStock(pOld.getStock() - stock);
        this.productRepo.save(pOld);
        return toDto(pOld);
    }

    @Transactional
    public ProductDto associateCategory(Long id, Long idCategory) {
        Product pOld = this.productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFound(id.toString()));

        Category category = this.categoryRepo.findById(idCategory)
                .orElseThrow(() -> new CategoryNotFound(idCategory.toString()));

        boolean alreadyExists = pOld.getCategories()
                .stream()
                .anyMatch(c -> c.getId().equals(idCategory));
        //TODO crear una excepcion nueva
        if (alreadyExists)
            throw new RequiredField("Category already associated to this product");

        pOld.getCategories().add(category);

        return toDto(this.productRepo.save(pOld));
    }
    @Transactional
    public ProductDto disassociateCategory(Long id, Long idCategory) {
        Product pOld = this.productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFound(id.toString()));

        Category category = this.categoryRepo.findById(idCategory)
                .orElseThrow(() -> new CategoryNotFound(idCategory.toString()));

        boolean alreadyExists = pOld.getCategories()
                .stream()
                .anyMatch(c -> c.getId().equals(idCategory));
        //TODO crear una excepcion nueva
        if (!alreadyExists)
            throw new RequiredField("Category already disassociate to this product");

        pOld.getCategories().remove(category);

        return toDto(this.productRepo.save(pOld));
    }

    //convercion de entidad a dto
    private ProductDto toDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setStock(p.getStock());
        dto.setBrand(p.getBrand());
        dto.setModel(p.getModel());
        dto.setImg_url(p.getImg_url());
        dto.setCategories(
                p.getCategories()
                        .stream()
                        .map(Category::getName)
                        .collect(Collectors.toList())
        );
        return dto;
    }
}
