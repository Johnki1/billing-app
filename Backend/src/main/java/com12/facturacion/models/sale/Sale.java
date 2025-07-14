package com12.facturacion.models.sale;

import com12.facturacion.models.saledetail.SaleDetail;
import com12.facturacion.models.table.Table;
import com12.facturacion.models.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity(name = "Sale")
@jakarta.persistence.Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "table_id", nullable = false)
    private Table table;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private BigDecimal total;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleDetail> details = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private StatusSale status;

    @Column(name = "discount", nullable = false, columnDefinition = "DECIMAL(10,2) default 0.00")
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "sale_detail")
    private String saleDetail;

    @PrePersist
    protected void onCreate() {
        if (discount == null) {
            discount = BigDecimal.ZERO;
        }
        if (date == null) {
            date = LocalDateTime.now();
        }
    }
}