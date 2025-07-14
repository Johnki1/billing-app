package com12.facturacion.infra.service;

import com12.facturacion.models.sale.SaleService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.time.LocalDateTime;



@EnableScheduling 
@Service
public class TareaMensualService {

    private final SaleService saleService;

    public TareaMensualService(SaleService saleService) {
        this.saleService = saleService;
    }

    @Scheduled(cron = "0 0 3 1 * *") 
    public void limpiarVentasAntiguas() {
        LocalDateTime haceUnMes = LocalDateTime.now().minusMonths(1);
        saleService.eliminarVentasAnterioresA(haceUnMes);
    }
}
