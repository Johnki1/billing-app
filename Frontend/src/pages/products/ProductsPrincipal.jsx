import { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';
import api from "../../api/axiosConfig";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Debug: Confirmar que estamos en el componente correcto
  console.log('=== PRODUCTS COMPONENT RENDERED ===');
  console.log('Products state:', products);
  console.log('FilteredProducts state:', filteredProducts);

  useEffect(() => {
    console.log('Products useEffect triggered');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const token = localStorage.getItem('jwtToken');
      const response = await api.get('/productos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('API Response:', response.data);
      console.log('Response type:', typeof response.data);
      console.log('Is array:', Array.isArray(response.data));
      
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductUpdated = () => {
    console.log('handleProductUpdated called');
    fetchProducts(); 
  };

  // Verificar si tenemos productos
  if (products.length === 0) {
    console.log('No products found or still loading...');
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>
      
      {/* Debug info visible */}
      <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 2 }}>
        DEBUG: Componente Products cargado correctamente. 
        Productos: {products.length} | Filtrados: {filteredProducts.length}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProductFilters products={products} setFilteredProducts={setFilteredProducts} />
          <ProductList products={filteredProducts} onProductUpdated={handleProductUpdated} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;
