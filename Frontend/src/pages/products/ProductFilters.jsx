import { MenuItem, FormControl, InputLabel, Select, Button } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductFilters = ({ products, setFilteredProducts }) => {
  const [category, setCategory] = useState('');

  const handleFilter = () => {
    if (category) {
      setFilteredProducts(products.filter((p) => p.tipo === category));
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Categoría</InputLabel>
      <Select value={category} onChange={(e) => setCategory(e.target.value)}>
        <MenuItem value="">Todas</MenuItem>
        <MenuItem value="FRIO">Frío</MenuItem>
        <MenuItem value="CALIENTE">Caliente</MenuItem>
        <MenuItem value="ADICIONES">Adiciones</MenuItem>
        <MenuItem value="BEBIDAS">Bebidas</MenuItem>
        
      </Select>
      <Button variant="contained" onClick={handleFilter}>Filtrar</Button>
    </FormControl>
  );
};

ProductFilters.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      precio: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      tipo: PropTypes.string.isRequired,
    })
  ).isRequired,
  setFilteredProducts: PropTypes.func.isRequired,
};

export default ProductFilters;