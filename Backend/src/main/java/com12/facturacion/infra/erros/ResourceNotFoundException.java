package com12.facturacion.infra.erros;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String mensaje) {
        super(mensaje);
    }
}
