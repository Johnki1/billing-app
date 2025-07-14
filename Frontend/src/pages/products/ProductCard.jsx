import { useState } from 'react';
import api from "../api/axiosConfig";
import { 
  Card, 
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onProductUpdated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    nombre: product.nombre,
    precio: product.precio,
    descripcion: product.descripcion,
    stock: product.stock,
    tipo: product.tipo,
  });
  const [newImage, setNewImage] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await api.delete(`/productos/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onProductUpdated();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    handleMenuClose();
  };

  const handleUpdateClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleFileChange = (event) => {
    setNewImage(event.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('producto', new Blob([JSON.stringify({
        id: product.id,
        nombre: updatedProduct.nombre,
        precio: Number(updatedProduct.precio),
        descripcion: updatedProduct.descripcion,
        stock: Number(updatedProduct.stock),
        tipo: updatedProduct.tipo,
      })], { type: 'application/json' }));

      if (newImage) {
        formData.append('imagen', newImage);
      }

      await api.put(`/productos/${product.id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setOpenDialog(false);
      onProductUpdated();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3
        }
      }}>
        <Box sx={{ position: 'relative', paddingTop: '56.25%'}}>
          <CardMedia
            component="img"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            image={product.imageUrl}
            alt={product.nombre}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              {product.nombre}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
              sx={{ marginTop: -1, marginRight: -1 }}
            >
              <MoreVert />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {product.descripcion}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${product.precio.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stock: {product.stock}
            </Typography>
          </Box>
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleUpdateClick}>
            <Edit sx={{ mr: 1 }} /> Actualizar
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <Delete sx={{ mr: 1 }} /> Eliminar
          </MenuItem>
        </Menu>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Actualizar Producto</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={updatedProduct.nombre}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, nombre: e.target.value })}
            />
            <TextField
              label="Precio"
              fullWidth
              type="number"
              value={updatedProduct.precio}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, precio: e.target.value })}
            />
            <TextField
              label="Stock"
              fullWidth
              type="number"
              value={updatedProduct.stock}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, stock: e.target.value })}
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={updatedProduct.descripcion}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, descripcion: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={updatedProduct.tipo}
                label="Categoría"
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, tipo: e.target.value })}
              >
                <MenuItem value="FRIO">Frío</MenuItem>
                <MenuItem value="CALIENTE">Caliente</MenuItem>
                <MenuItem value="ADICIONES">Adiciones</MenuItem>
                <MenuItem value="BEBIDAS">Bebidas</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {newImage ? 'Cambiar imagen' : 'Subir nueva imagen'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {newImage && (
              <Typography variant="caption" color="text.secondary">
                Nueva imagen seleccionada: {newImage.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained">Actualizar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    tipo: PropTypes.string.isRequired,
  }).isRequired,
  onProductUpdated: PropTypes.func.isRequired,
};

export default ProductCard;