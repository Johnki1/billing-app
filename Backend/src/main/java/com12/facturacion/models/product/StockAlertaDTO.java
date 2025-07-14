package com12.facturacion.models.product;

public record StockAlertaDTO(
        Long productoId,
        String nombre,
        Integer StockActual,
        Integer StockMinimo
) {
}
