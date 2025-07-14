package com12.facturacion.controllers;

import com12.facturacion.models.sale.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @PostMapping
    public ResponseEntity<SaleDTO> crearVenta(@RequestBody @Valid SaleRequest request) {
        return ResponseEntity.ok(saleService.crearVenta(request));
    }

    @PutMapping("/{id}/completar")
    public ResponseEntity<SaleDTO> completarVenta(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.completarVenta(id));
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<SaleDTO>> obtenerVentasUsuario(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(saleService.obtenerVentasUsuario(inicio, fin));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SaleDTO>> obtenerVentasPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(saleService.obtenerVentasPorFecha(inicio, fin));
    }

    @PutMapping("/{id}/agregarProductos")
    public ResponseEntity<SaleDTO> agregarProductos(@PathVariable Long id,
                                                    @RequestBody @Valid AgregarProductoDTO request) {
        return ResponseEntity.ok(saleService.agregarProductos(id, request));
    }

    @DeleteMapping("/{saleId}/producto/{productoId}")
    public ResponseEntity<SaleDTO> eliminarProductoDeVenta(@PathVariable Long saleId,
                                                           @PathVariable Long productoId) {
        return ResponseEntity.ok(saleService.eliminarProductoDeVenta(saleId, productoId));
    }

    @PutMapping("/{id}/actualizar")
    public ResponseEntity<SaleDTO> actualizarDescuentoYDetalle(@PathVariable Long id,
                                                               @RequestBody @Valid SaleUpdateRequest request) {
        return ResponseEntity.ok(saleService.actualizarDescuentoYDetalle(id, request.discount(), request.saleDetail()));
    }
}
