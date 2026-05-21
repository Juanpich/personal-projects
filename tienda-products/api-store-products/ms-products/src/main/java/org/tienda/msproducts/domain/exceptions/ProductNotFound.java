package org.tienda.msproducts.domain.exceptions;

public class ProductNotFound extends RuntimeException {
    public ProductNotFound(String message) {
        super("The product with the id " + message + " was not found.");
    }
}
