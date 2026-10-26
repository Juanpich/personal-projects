package org.tienda.apicampo.domain.exceptions;

public class NonExistentObservationException extends RuntimeException {
    public NonExistentObservationException(String message) {

        super("The Observation not exists, id: " + message);
    }
}
