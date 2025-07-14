package com12.facturacion.models.dashboard;

import com12.facturacion.models.product.Product;
import com12.facturacion.models.product.ProductRepository;
import com12.facturacion.models.sale.Sale;
import com12.facturacion.models.sale.SaleRepository;
import com12.facturacion.models.sale.StatusSale;
import com12.facturacion.models.saledetail.SaleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public DashboardService(SaleRepository saleRepository, ProductRepository productRepository, SimpMessagingTemplate messagingTemplate) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional(readOnly = true)
    public DashboardStats getStatistics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusWeeks(1);
        LocalDateTime startOfMonth = now.minusMonths(1);

        BigDecimal dailySales = calculateSalesInPeriod(startOfDay, now);
        BigDecimal weeklySales = calculateSalesInPeriod(startOfWeek, now);
        BigDecimal monthlySales = calculateSalesInPeriod(startOfMonth, now);

        Integer totalProducts = productRepository.findAll().size();
        Integer lowStockProducts = productRepository.findByStockLessThan(10).size();

        List<BestSellingProduct> bestSellingProducts = getBestSellingProducts();
        Map<String, BigDecimal> salesByCategory = getSalesByCategory();

        return new DashboardStats(
                dailySales,
                weeklySales,
                monthlySales,
                totalProducts,
                lowStockProducts,
                bestSellingProducts,
                salesByCategory
        );
    }

    private Map<String, BigDecimal> getSalesByCategory() {
        return saleRepository.findAll().stream()
                .filter(sale -> sale.getStatus() == StatusSale.COMPLETADA)
                .flatMap(sale -> sale.getDetails().stream())
                .collect(Collectors.groupingBy(
                        detail -> detail.getProduct().getCategory().name(),
                        Collectors.mapping(
                                SaleDetail::getSubtotal,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));
    }

    private List<BestSellingProduct> getBestSellingProducts() {
        return saleRepository.findAll().stream()
                .filter(sale -> sale.getStatus() == StatusSale.COMPLETADA)
                .flatMap(sale -> sale.getDetails().stream())
                .collect(Collectors.groupingBy(
                        detail -> detail.getProduct().getName(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                details -> new BestSellingProduct(
                                        details.get(0).getProduct().getName(),
                                        details.stream().mapToInt(SaleDetail::getCantidad).sum(),
                                        details.stream().map(SaleDetail::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add)
                                )
                        )
                ))
                .values()
                .stream()
                .sorted(Comparator.comparing(BestSellingProduct::totalIncome).reversed())
                .limit(10)
                .toList();
    }

    private BigDecimal calculateSalesInPeriod(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findByDateBetweenAndStatus(start, end, StatusSale.COMPLETADA)
                .stream()
                .map(Sale::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Anota el método programado con @Transactional para tener una sesión activa
    @Scheduled(fixedRate = 60000)
    @Transactional(readOnly = true)
    public void updateDashboard() {
        DashboardStats stats = getStatistics();
        messagingTemplate.convertAndSend("/topic/dashboard", stats);
    }

    public void sendNotification(NotificationDTO notification) {
        messagingTemplate.convertAndSend("/topic/notificaciones", notification);
    }

    @Scheduled(fixedRate = 300000)
    public void verificarStockYNotificar() {
        List<Product> productosStockBajo = productRepository.findByStockLessThan(10);

        productosStockBajo.forEach(product -> {
            NotificationDTO notification = new NotificationDTO(
                    "ALERTA",
                    "Stock bajo",
                    "El producto " + product.getName() + " tiene un stock de " + product.getStock(),
                    LocalDateTime.now()
            );
            sendNotification(notification);
        });
    }
}
