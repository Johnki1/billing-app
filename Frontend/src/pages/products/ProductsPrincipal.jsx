import { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';
import api from "../../api/axiosConfig";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get('/productos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductUpdated = () => {
    fetchProducts(); 
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
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
