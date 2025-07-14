package com12.facturacion.models.product;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity(name = "Product")
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    private String description;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Integer stock;

    @Enumerated(EnumType.STRING)
    private ProductCategory category;

    @Column(name = "fecha_creacion")
    private LocalDateTime createDate;

    @Column(name = "ultima_actualizacion")
    private LocalDateTime lastUpdate;

}
