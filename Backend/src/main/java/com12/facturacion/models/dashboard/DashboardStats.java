package com12.facturacion.models.dashboard;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardStats(
        BigDecimal dailySales,
        BigDecimal weeklySales,
        BigDecimal monthlySales,
        Integer totalProducts,
        Integer lowStockProducts,
        List<BestSellingProduct> bestSellingProducts,
        Map<String, BigDecimal> salesByCategory
) {
}
