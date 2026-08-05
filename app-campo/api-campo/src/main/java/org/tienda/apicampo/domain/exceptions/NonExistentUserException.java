package org.tienda.apicampo.domain.exceptions;

public class NonExistentUserException extends RuntimeException {
    public NonExistentUserException(String message) {
        super(
                "The user: " + message + " does not exist");
    }
}
