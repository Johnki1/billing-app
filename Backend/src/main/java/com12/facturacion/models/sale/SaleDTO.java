package com12.facturacion.models.sale;

import com12.facturacion.models.saledetail.SaleDetailDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SaleDTO(
        Long id,
        Long userId,
        Long tableId,
        LocalDateTime date,
        BigDecimal total,
        StatusSale status,
        BigDecimal discount,
        String saleDetail,
        List<SaleDetailDTO> detail
) {
}
