package org.tienda.msproducts.domain.exceptions;

public class StockInvalid extends RuntimeException {
    public StockInvalid(String message) {
        super("The stok is invalid");
    }
}
