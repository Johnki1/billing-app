package com12.facturacion.models.sale;

import com12.facturacion.models.saledetail.SaleDetailDTO;

import java.math.BigDecimal;
import java.util.List;

public record SaleRequest(
        Long tableId,
        List<SaleDetailDTO> detail,
        BigDecimal discount,
        String saleDetail
) {
}
