import { Grid, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import PropTypes from 'prop-types';

const ProductList = ({ products, onProductUpdated }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Lista de Productos</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} onProductUpdated={onProductUpdated} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
ProductList.propTypes = {
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
      })
    ).isRequired,
    onProductUpdated: PropTypes.func.isRequired,
  };
  

export default ProductList;