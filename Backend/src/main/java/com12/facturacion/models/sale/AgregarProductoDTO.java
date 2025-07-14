package com12.facturacion.models.sale;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AgregarProductoDTO(
        @NotEmpty List<NewSaleDetailDTO> detail
) {
}
