package org.tienda.apicampo.domain.exceptions;

public class RequiredFieldException extends RuntimeException {
    public RequiredFieldException(String message) {
        super(
                "The "+ message  +" field is mandatory."
        );
    }
}
