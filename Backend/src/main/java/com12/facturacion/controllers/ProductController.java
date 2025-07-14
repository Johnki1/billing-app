package com12.facturacion.controllers;

import com12.facturacion.models.product.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> listarProductos() {
        return ResponseEntity.ok(productService.buscarTodos());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ProductDTO>> listarPorCategoria(@PathVariable ProductCategory categoria) {
        return ResponseEntity.ok(productService.buscarPorCategoria(categoria));
    }

    @GetMapping("/stock-bajo")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<StockAlertaDTO>> obtenerProductosStockBajo() {
        return ResponseEntity.ok(productService.obtenerProductosStockBajo());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProductDTO> crearProducto(
            @RequestPart("producto") @Valid ProductDTO producto,
            @RequestPart("imagen") MultipartFile imagen
    ) {
        return ResponseEntity.ok(productService.crearProducto(producto, imagen));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProductDTO> actualizarProducto(
            @PathVariable Long id,
            @RequestPart("producto") @Valid ProductDTO producto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen
    ) {
        return ResponseEntity.ok(productService.actualizarProducto(id, producto, imagen));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}