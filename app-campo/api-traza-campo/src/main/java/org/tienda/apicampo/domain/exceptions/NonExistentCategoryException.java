package org.tienda.apicampo.domain.exceptions;

public class NonExistentCategoryException extends RuntimeException {
    public NonExistentCategoryException(String message) {

        super("The Ctaegory not exists, id: " + message);
    }
}
