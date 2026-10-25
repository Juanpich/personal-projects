package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.tienda.apicampo.domain.exceptions.*;
import org.springframework.security.core.AuthenticationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({NonExistentAnimalException.class,
            NonExistentCategoryException.class,
            NonExistentObservationException.class,
            NonExistentLoteException.class,
            NonExistentUserException.class})            // ← faltaba
    public ResponseEntity<String> handleNotFound(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)     // ← faltaba
    public ResponseEntity<String> handleAuthentication(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
    }

    @ExceptionHandler({AnimalAlreadyExistsException.class, DatabaseException.class, UserAlreadyExistsException.class})
    public ResponseEntity<String> handleConflict(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(RequiredFieldException.class)
    public ResponseEntity<String> handleBadRequest(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno"+ e.getMessage());
    }
}
