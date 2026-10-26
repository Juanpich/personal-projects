package org.tienda.apicampo.domain.exceptions;

public class DatabaseException extends RuntimeException {
    public DatabaseException(String message) {
        super("An unexpected error occurred." + message);
    }
}
