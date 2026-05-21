package org.tienda.msproducts.domain.exceptions;

public class CategoryNotFound extends RuntimeException {
    public CategoryNotFound(String message) {
        super("Category with id " + message + " not found");
    }
}
