package com12.facturacion.models.table;

import com12.facturacion.models.sale.Sale;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity(name = "Table")
@jakarta.persistence.Table(name = "tables")
public class Table {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numero;

    @Enumerated(EnumType.STRING)
    private StatusTable estado;

    @OneToMany(mappedBy = "table")
    private List<Sale> sales;
}
