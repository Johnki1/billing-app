package com12.facturacion.models.dashboard;

import java.math.BigDecimal;

public record BestSellingProduct(
        String name,
        Integer quantitySold,
        BigDecimal totalIncome
) {
}
