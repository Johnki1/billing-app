package com12.facturacion.models.user;

public record RegisterUserDTO(
    String username,
    String password,
    Rol rol
) {
}
