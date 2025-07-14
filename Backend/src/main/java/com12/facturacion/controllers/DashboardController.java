package com12.facturacion.controllers;

import com12.facturacion.models.dashboard.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR')")
    public ResponseEntity<DashboardStats> obtenerEstadisticas() {
        return ResponseEntity.ok(dashboardService.getStatistics());
    }

    @MessageMapping("/notificaciones")
    @SendTo("/topic/notificaciones")
    public NotificationDTO enviarNotificacion(NotificationDTO notification) {
        dashboardService.sendNotification(notification);
        return notification;
    }
}