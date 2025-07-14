package com12.facturacion.controllers;

import com12.facturacion.models.table.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mesas")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableDTO>> listarMesas() {
        return ResponseEntity.ok(tableService.obtenerTodasLasMesas());
    }

    @GetMapping("/libres")
    public ResponseEntity<List<TableDTO>> listarMesasLibres() {
        return ResponseEntity.ok(tableService.obtenerMesasLibres());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<TableDTO> crearMesa(@RequestBody @Valid TableDTO mesa) {
        return ResponseEntity.ok(tableService.crearMesa(mesa));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<TableDTO> actualizarEstadoMesa(
            @PathVariable Long id,
            @RequestBody StatusTable estado
    ) {
        return ResponseEntity.ok(tableService.actualizarEstadoMesa(id, estado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarMesa(@PathVariable Long id) {
        tableService.eliminarMesa(id);
        return ResponseEntity.noContent().build();
    }
}