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

 const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 800; // ancho máximo permitido
      const scaleSize = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            setNewProduct({ ...newProduct, image: compressedFile });
            setImagePreview(URL.createObjectURL(compressedFile));
          }
        },
        "image/jpeg",
        0.7 
      );
    };
  } catch (err) {
    console.error("Error comprimiendo imagen:", err);
    setNewProduct({ ...newProduct, image: file });
    setImagePreview(URL.createObjectURL(file));
  }
};

const handleCreateProduct = async () => {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.image) {
      setError("Todos los campos y la imagen son obligatorios.");
      return;
    }

    const precio = parseFloat(newProduct.price);
    const stock = parseInt(newProduct.stock);

    if (isNaN(precio) || isNaN(stock)) {
      setError("Precio y stock deben ser números válidos.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "producto",
      new Blob(
        [JSON.stringify({
          nombre: newProduct.name,
          precio,
          stock,
          descripcion: newProduct.description,
          tipo: newProduct.category
        })],
        { type: "application/json" }
      )
    );
    formData.append("imagen", newProduct.image);

    const response = await api.post("/productos", formData, {
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
