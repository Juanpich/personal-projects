package org.tienda.apicampo.security;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.tienda.apicampo.domain.dto.UserDto;
import org.tienda.apicampo.security.jwt.UserPrincipal;
import org.tienda.apicampo.service.UserService;

@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);
    private final UserService userService;

    public DomainUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String username) {
        log.debug("Authenticating {}", username);
        UserDto dto = this.userService.findByUserName(username);
        if( dto == null ) {
            throw new UsernameNotFoundException("El usuario " + username + " no existe");
        }
        return new UserPrincipal(dto);

    }
}

