package com12.facturacion.models.product;

import com12.facturacion.infra.erros.ResourceNotFoundException;
import com12.facturacion.infra.service.CloudinaryService;
import com12.facturacion.models.saledetail.SaleDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final SaleDetailRepository saleDetailRepository;
    private final Integer STOCK_MINIMO = 10;

    @Autowired
    public ProductService(ProductRepository productRepository, CloudinaryService cloudinaryService, SaleDetailRepository saleDetailRepository) {
        this.productRepository = productRepository;
        this.cloudinaryService = cloudinaryService;
        this.saleDetailRepository = saleDetailRepository;
    }

    @Transactional
    public ProductDTO crearProducto(ProductDTO productDTO, MultipartFile imagen) {
        if (productRepository.existsByName(productDTO.nombre())){
            throw new RuntimeException("El producto ya existe");
        }
        String imageUrl = cloudinaryService.uploadImage(imagen);

        Product product = new Product();
        product.setName(productDTO.nombre());
        product.setPrice(productDTO.precio());
        product.setDescription(productDTO.descripcion());
        product.setImageUrl(imageUrl);
        product.setStock(productDTO.stock());
        product.setCategory(productDTO.tipo());
        product.setCreateDate(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        return convertirProductoDTO(savedProduct);
    }

    @Transactional
    public ProductDTO actualizarProducto(Long id, ProductDTO productDTO, MultipartFile imagen) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (imagen != null) {
            String imageUrl = cloudinaryService.uploadImage(imagen);
            product.setImageUrl(imageUrl);
        }

        product.setName(productDTO.nombre());
        product.setPrice(productDTO.precio());
        product.setDescription(productDTO.descripcion());
        product.setStock(productDTO.stock());
        product.setCategory(productDTO.tipo());
        product.setLastUpdate(LocalDateTime.now());

        productRepository.save(product);
        return convertirProductoDTO(product);

    }

    @Transactional
    public void deleteProducto(Long productId){
        var producto = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(producto);

    }

    private void validarProducto(ProductDTO productDTO){
        if (productDTO.precio().compareTo(BigDecimal.ZERO)<=0){
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        if (productDTO.stock() < 0){
            throw new IllegalArgumentException("El Stock no puede ser negativo");
        }
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> buscarPorCategoria(ProductCategory category){
        return productRepository.findByCategory(category)
                .stream()
                .map(this::convertirProductoDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StockAlertaDTO> obtenerProductosStockBajo(){
        return productRepository.findByStockLessThan(STOCK_MINIMO)
                .stream()
                .map(this::convertirStockAlertaDTO)
                .collect(Collectors.toList());
    }

    private StockAlertaDTO convertirStockAlertaDTO(Product producto) {
        return new StockAlertaDTO(
                producto.getId(),
                producto.getName(),
                producto.getStock(),
                STOCK_MINIMO
        );
    }

    public List<ProductDTO> buscarTodos() {
        return productRepository.findAll()
                .stream()
                .map(this::convertirProductoDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO convertirProductoDTO(Product product){
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getDescription(),
                product.getImageUrl(),
                product.getStock(),
                product.getCategory()
        );
    }

}
