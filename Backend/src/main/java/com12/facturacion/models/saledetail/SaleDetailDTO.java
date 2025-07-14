package com12.facturacion.models.saledetail;

import java.math.BigDecimal;

public record SaleDetailDTO(
       Long productoId,
       Integer cantidad,
       BigDecimal precioUnitario,
       BigDecimal subtotal
) {
}
