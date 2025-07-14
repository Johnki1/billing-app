package com12.facturacion.models.dashboard;

import java.time.LocalDateTime;

public record NotificationDTO(
        String type,
        String message,
        String details,
        LocalDateTime date
) {
}
