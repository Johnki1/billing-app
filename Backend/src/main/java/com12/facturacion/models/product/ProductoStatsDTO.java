package com12.facturacion.models.product;

import java.math.BigDecimal;

public record ProductoStatsDTO(
        Long productoId,
        String nombre,
        Integer cantidadVendida,
        BigDecimal ingresoTotal
) {
}
