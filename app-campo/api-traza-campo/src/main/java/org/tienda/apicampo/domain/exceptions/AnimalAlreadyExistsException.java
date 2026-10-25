package org.tienda.apicampo.domain.exceptions;

public class AnimalAlreadyExistsException extends RuntimeException {
    public AnimalAlreadyExistsException(Long message) {
        super(
                "The animal whit caravan number " +message + " alreay exists"
        );
    }
}
