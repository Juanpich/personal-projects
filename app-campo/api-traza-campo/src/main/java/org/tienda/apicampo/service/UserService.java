package org.tienda.apicampo.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.tienda.apicampo.domain.dto.RegisterDto;
import org.tienda.apicampo.domain.dto.UserDto;
import org.tienda.apicampo.domain.entities.Role;
import org.tienda.apicampo.domain.entities.User;
import org.tienda.apicampo.domain.exceptions.NonExistentUserException;
import org.tienda.apicampo.domain.exceptions.RequiredFieldException;
import org.tienda.apicampo.domain.exceptions.UserAlreadyExistsException;
import org.tienda.apicampo.repository.UserRepository;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    public UserService(UserRepository repository, PasswordEncoder pass) {
        this.repository = repository;
        this.passwordEncoder = pass;

    }
    @Transactional
    public UserDto register(RegisterDto dto) {
        User user = new User();
        if(this.repository.existsByUsername(dto.getUsername())) {
            throw new UserAlreadyExistsException(dto.getUsername());
        }
        user.setUsername(dto.getUsername());
        if(dto.getPassword() == null || dto.getPassword().isEmpty()) {
            throw new RequiredFieldException("Password required");
        }
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.ESPECTADOR);
        User u = this.repository.save(user);
        return new UserDto(user);
    }

    @Transactional
    public UserDto findByUserName(String userName){
        return new UserDto(this.repository.findByUsername(userName).orElseThrow(()-> new NonExistentUserException(userName)));
    }
    @Transactional
    public UserDto changeRole(String userName,String role){
        User user = this.repository.findByUsername(userName).orElseThrow(()-> new NonExistentUserException(userName));
        try {
            Role newRole = Role.valueOf(role.toUpperCase());
            user.setRole(newRole);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RequiredFieldException(role);
        }
        return new UserDto(this.repository.save(user));
    }
    @Transactional()
    public List<UserDto> getAllUser() {
        return this.repository.findAll().stream().map(UserDto::new).toList();
    }
}
