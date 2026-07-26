package org.tienda.apicampo.domain.exceptions;

public class NonExistentAnimalException extends RuntimeException {
    public NonExistentAnimalException(String message) {
        super(
                "The animal not exists, id:" + message
        );
    }
}
