package org.tienda.apicampo.domain.exceptions;

public class NonExistentLoteException extends RuntimeException {
    public NonExistentLoteException(String message) {
        super(
                "The Lote not exists, id: " +message);
    }
}
