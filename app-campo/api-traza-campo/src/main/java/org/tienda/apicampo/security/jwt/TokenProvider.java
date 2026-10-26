package org.tienda.apicampo.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.tienda.apicampo.domain.dto.UserDto;
import org.tienda.apicampo.domain.entities.Role;
import org.tienda.apicampo.domain.entities.User;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class TokenProvider {
    private final Logger log = LoggerFactory.getLogger(TokenProvider.class);

    private static final String AUTHORITIES_KEY = "auth";

    private static final String INVALID_JWT_TOKEN = "Invalid JWT token.";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int tokenValidityInMilliseconds;

    private SecretKey key;
    private JwtParser jwtParser;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.jwtParser = Jwts.parser().verifyWith(key).build();
    }

    public String createToken( Authentication authentication ) {
        String authorities = authentication.getAuthorities().stream().map( GrantedAuthority::getAuthority ).collect( Collectors.joining(",") );

        long now = ( new Date() ).getTime();
        Date validity = new Date( now + this.tokenValidityInMilliseconds );

        return Jwts
                .builder()
                .subject( authentication.getName() )
                .claim( AUTHORITIES_KEY, authorities )
                .signWith( key )
                .expiration(validity)
                .issuedAt( new Date() )
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        String username = claims.getSubject(); // ← faltaba esto

        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .filter(auth -> !auth.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        UserPrincipal principal = new UserPrincipal(
                new UserDto(username, null, Role.valueOf(authorities.iterator().next().getAuthority()))
        );

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(this.key).build().parseSignedClaims(authToken);
            return true;
        } catch (ExpiredJwtException e) {
            log.trace("Token expirado", e);
        } catch (JwtException | IllegalArgumentException e) {
            log.trace(INVALID_JWT_TOKEN, e);
        }
        return false;
    }

    private void checkTokenExpiration( Jws<Claims> token ){
        try {
            final var payload = token.getPayload();
            if ( payload.getExpiration().before(new Date()) || payload.getIssuedAt().after( new Date((new Date()).getTime() + this.tokenValidityInMilliseconds) ) )
                throw new ExpiredJwtException(null, null, null);
        } catch ( Exception e ) {
            throw new ExpiredJwtException(null, null, null);
        }
    }
}
