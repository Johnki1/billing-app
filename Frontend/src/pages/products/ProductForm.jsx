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
    console.log("TOKEN ENVIADO:", token); // 👈 Verifica en móvil si sale null

    const formData = new FormData();
    formData.append(
      "producto",
      new Blob([JSON.stringify({
        nombre: newProduct.name,
        precio: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        descripcion: newProduct.description,
        tipo: newProduct.category,
      })], { type: "application/json" }) // volvemos al Blob para máxima compatibilidad
    );

    if (newProduct.image) {
      formData.append("imagen", newProduct.image);
    }

    const response = await api.post("/productos", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("RESPUESTA:", response.data);

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
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      setError("Error: " + JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error("Error request:", error.request);
      setError("Error de red o sin respuesta del servidor");
    } else {
      console.error("Error mensaje:", error.message);
      setError("Error: " + error.message);
    }
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
