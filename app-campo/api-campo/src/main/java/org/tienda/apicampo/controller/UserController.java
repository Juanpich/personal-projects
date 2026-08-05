package org.tienda.apicampo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tienda.apicampo.domain.dto.RegisterDto;
import org.tienda.apicampo.domain.dto.UserDto;
import org.tienda.apicampo.service.UserService;

@RequestMapping("/users")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("")
    public ResponseEntity<UserDto> register(@RequestBody RegisterDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(dto));
    }
}
