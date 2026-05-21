package org.tienda.msproducts.domain.exceptions;

public class RequiredField extends RuntimeException {
    public RequiredField(String message) {
        super("Todos los campos son obligatorios: " + message);
    }
}
