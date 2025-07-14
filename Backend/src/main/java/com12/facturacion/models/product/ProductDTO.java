package com12.facturacion.models.product;

import java.math.BigDecimal;

public record ProductDTO(
    Long id,
    String nombre,
    BigDecimal precio,
    String descripcion,
    String imageUrl,
    Integer stock,
    ProductCategory tipo
) {
}
