package com12.facturacion.models.sale;

import jakarta.validation.constraints.NotNull;

public record NewSaleDetailDTO(
        @NotNull Long productoId,
        @NotNull Integer cantidad
) {
}
