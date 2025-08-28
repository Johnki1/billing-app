import { useState } from "react";
import api from "../../api/axiosConfig";
import {
  Container,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProduct({ ...newProduct, image: file });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const formData = new FormData();

      // Se adjuntan los campos de texto y la imagen de forma individual
      formData.append("nombre", newProduct.name);
      formData.append("precio", parseFloat(newProduct.price));
      formData.append("stock", parseInt(newProduct.stock));
      formData.append("descripcion", newProduct.description);
      formData.append("tipo", newProduct.category);

      // Se añade la imagen solo si existe
      if (newProduct.image) {
        formData.append("imagen", newProduct.image);
      }

      await api.post("/productos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Producto creado exitosamente.");
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
      navigate("/productos");
    } catch (err) {
      console.error("Error creating product:", err.response || err);
      // Puedes usar err.response.data para obtener un mensaje más específico del backend
      setError("Error al crear el producto. Intente de nuevo.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" align="center">
            Crear Producto
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <TextField
            label="Nombre"
            fullWidth
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <TextField
            label="Precio"
            fullWidth
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <TextField
            label="Stock"
            fullWidth
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              label="Categoría"
            >
              <MenuItem value="FRIO">Frío</MenuItem>
              <MenuItem value="CALIENTE">Caliente</MenuItem>
              <MenuItem value="ADICIONES">Adiciones</MenuItem>
              <MenuItem value="BEBIDAS">Bebidas</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Descripción"
            fullWidth
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <Button variant="contained" component="label" fullWidth>
            Agregar imagen
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {imagePreview && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">Vista previa:</Typography>
              <Box
                component="img"
                src={imagePreview}
                alt="Vista previa"
                sx={{ maxWidth: "100%", maxHeight: 300, mt: 1 }}
              />
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateProduct}
          >
            Crear Producto
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProductForm;
