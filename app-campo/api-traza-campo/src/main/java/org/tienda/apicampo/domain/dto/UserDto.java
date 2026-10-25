package org.tienda.apicampo.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tienda.apicampo.domain.entities.Role;
import org.tienda.apicampo.domain.entities.User;

@Data
@NoArgsConstructor
public class UserDto {
    private Long idUser;
    private String username;
    @JsonIgnore // nunca sale en las respuestas JSON
    private String password;
    private Role role;

    public UserDto(User user) {
        this.idUser = user.getIdUser();
        this.username = user.getUsername();
        this.role = user.getRole();
        this.password = user.getPassword();
    }

    // Constructor tipado, reemplaza al de (Object, Object, Role)
    public UserDto(String username, String password, Role role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

