package com12.facturacion.models.sale;

import java.math.BigDecimal;

public record SaleUpdateRequest(
        BigDecimal discount, String saleDetail
) {
}
