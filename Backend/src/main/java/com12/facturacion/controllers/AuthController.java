package com12.facturacion.controllers;

import com12.facturacion.infra.security.DataJWTToken;
import com12.facturacion.infra.security.TokenService;
import com12.facturacion.models.user.AuthUserData;
import com12.facturacion.models.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<DataJWTToken> autenticacion(@RequestBody @Valid AuthUserData dataAutenticationUser) {
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                dataAutenticationUser.username(), dataAutenticationUser.password()
        );

        Authentication usuarioAutenticado = authenticationManager.authenticate(authToken);
        User user = (User) usuarioAutenticado.getPrincipal();
        String token = tokenService.generateToken(user);

        return ResponseEntity.ok(new DataJWTToken(token));
    }
}
