package org.tienda.apicampo.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.tienda.apicampo.security.jwt.JwtFilter;
import org.tienda.apicampo.security.jwt.TokenProvider;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final TokenProvider tokenProvider;

    public SecurityConfig( TokenProvider tokenProvider ) {
        this.tokenProvider = tokenProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults()); // ← agregar esta línea
        http.csrf(AbstractHttpConfigurer::disable);

        http.sessionManagement(s ->
                s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"error\":\"Forbidden\",\"message\":\"Access denied\"}");
                })
        );

        /**http.authorizeHttpRequests(authz -> authz
                // Público
                .requestMatchers(HttpMethod.POST, "/authenticate").permitAll()
                .requestMatchers(HttpMethod.POST, "/users").permitAll()

                // Lectura: cualquier usuario autenticado (ESPECTADOR o ENCARGADO)
                .requestMatchers(HttpMethod.GET, "/animal/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/category/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/observation/**").authenticated()

                // Escritura: solo ENCARGADO
                .requestMatchers(HttpMethod.POST, "/animal/**").hasAuthority("ENCARGADO")
                .requestMatchers(HttpMethod.PUT, "/animal/**").hasAuthority("ENCARGADO")
                .requestMatchers(HttpMethod.DELETE, "/animal/**").hasAuthority("ENCARGADO")
                .requestMatchers(HttpMethod.POST, "/category/**").hasAuthority("ENCARGADO")
                .requestMatchers(HttpMethod.DELETE, "/category/**").hasAuthority("ENCARGADO")
                .requestMatchers(HttpMethod.POST, "/observation/**").hasAuthority("ENCARGADO")
                .requestMatchers(HttpMethod.DELETE, "/observation/**").hasAuthority("ENCARGADO")
                .requestMatchers(HttpMethod.PUT, "/users/**").hasAuthority("ENCARGADO")

                .anyRequest().authenticated()
        );*/
        http.authorizeHttpRequests(authz -> authz
                // Público
                .anyRequest().permitAll()
        );

        http.addFilterBefore(new JwtFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://192.168.18.*:5173"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


}
