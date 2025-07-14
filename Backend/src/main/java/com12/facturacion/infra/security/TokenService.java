package com12.facturacion.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com12.facturacion.models.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    @Value("${api.security.secret}")
    private String apiSecret;

    public String generateToken(User user) {
        try { Algorithm algorithm = Algorithm.HMAC256(apiSecret);
            return JWT.create() .withIssuer("UNOIGUALADOS")
                    .withSubject(user.getUsername())
                    .withClaim("role", user.getRole().name())
                    .withClaim("id", user.getId())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error al crear el token JWT", exception);
        }
    }

    public String getNameToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Token es null o está vacío");
        }
        try {
            Algorithm algorithm = Algorithm.HMAC256(apiSecret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer("UNOIGUALADOS")
                    .build()
                    .verify(token);
            String subject = decodedJWT.getSubject();

            if (subject == null || subject.isEmpty()) {
                throw new RuntimeException("El subject del token es inválido");
            }

            return subject;
        } catch (JWTVerificationException exception) {
            System.err.println("Error verificando el token JWT: " + exception.getMessage());
            throw new RuntimeException("Token inválido o verificación fallida");
        }
    }

    public String getRoleFromToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Token es null o está vacío");
        }

        try {
            Algorithm algorithm = Algorithm.HMAC256(apiSecret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer("UNOIGUALADOS")
                    .build()
                    .verify(token);

            String role = decodedJWT.getClaim("role").asString();
            if (role == null || role.isEmpty()) {
                throw new RuntimeException("El rol del token es inválido");
            }
            return role;
        } catch (JWTVerificationException exception) {
            System.err.println("Error verificando el token JWT: " + exception.getMessage());
            throw new RuntimeException("Token inválido o verificación fallida");
        }
    }

}
