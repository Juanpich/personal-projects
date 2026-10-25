package org.tienda.apicampo.domain.exceptions;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username) {
        super("Ya existe un usuario con username: " + username);
    }
}
