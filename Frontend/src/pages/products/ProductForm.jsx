import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import api from "../../api/axiosConfig";

// Constantes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const API_TIMEOUT = 30000; // 30 segundos

const CATEGORIES = [
  { value: "FRIO", label: "Frío" },
  { value: "CALIENTE", label: "Caliente" },
  { value: "ADICIONES", label: "Adiciones" },
  { value: "BEBIDAS", label: "Bebidas" }
];

const INITIAL_PRODUCT_STATE = {
  name: "",
  price: "",
  stock: "",
  category: "",
  description: "",
  image: null,
};

const ProductForm = () => {
  const navigate = useNavigate();

  // Estados
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para limpiar mensajes de estado
  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setNewProduct(INITIAL_PRODUCT_STATE);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  }, [imagePreview]);

  // Función para crear vista previa de imagen
  const createImagePreview = useCallback((file) => {
    try {
      const objectURL = URL.createObjectURL(file);
      setImagePreview(objectURL);
    } catch (err) {
      console.error("Error creating image preview:", err);
      setError("Error al mostrar la vista previa de la imagen");
    }
  }, []);

  // Validación de archivo de imagen
  const validateImageFile = useCallback((file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Tipo de archivo no válido. Usa JPG, PNG, GIF o WebP.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "El archivo es demasiado grande. Máximo 5MB.";
    }

    return null;
  }, []);

  // Manejador de cambio de archivo
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    
    clearMessages();

    if (!file) {
      setNewProduct(prev => ({ ...prev, image: null }));
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setNewProduct(prev => ({ ...prev, image: file }));
    createImagePreview(file);
  }, [clearMessages, validateImageFile, createImagePreview, imagePreview]);

  // Validación del formulario
  const validateForm = useCallback(() => {
    const { name, price, stock, category, description, image } = newProduct;

    if (!name.trim()) {
      setError("El nombre es requerido");
      return false;
    }

    if (!price || parseFloat(price) <= 0) {
      setError("El precio debe ser mayor a 0");
      return false;
    }

    if (!stock || parseInt(stock) < 0) {
      setError("El stock debe ser 0 o mayor");
      return false;
    }

    if (!category) {
      setError("La categoría es requerida");
      return false;
    }

    if (!description.trim()) {
      setError("La descripción es requerida");
      return false;
    }

    if (!image) {
      setError("La imagen es requerida");
      return false;
    }

    return true;
  }, [newProduct]);

  // Función para crear FormData
  const createFormData = useCallback(() => {
    const { name, price, stock, description, category, image } = newProduct;
    
    const productData = {
      nombre: name.trim(),
      precio: parseFloat(price),
      stock: parseInt(stock),
      descripcion: description.trim(),
      tipo: category,
    };

    const formData = new FormData();
    const productBlob = new Blob([JSON.stringify(productData)], {
      type: "application/json"
    });
    
    formData.append("producto", productBlob);
    formData.append("imagen", image, image.name);

    return { formData, productData };
  }, [newProduct]);

  // Función para obtener token de autenticación
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
    return token;
  }, []);

  // Función para manejar errores de la API
  const handleApiError = useCallback((error) => {
    console.error("Error creating product:", error);
    
    let errorMessage = "Error al crear el producto";
    
    if (error.response) {
      errorMessage = error.response.data?.message || `Error del servidor: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "Error de conexión. Verifica tu internet.";
    } else {
      errorMessage = error.message || "Error desconocido";
    }
    
    setError(errorMessage);
  }, []);

  // Función principal para crear producto
  const handleCreateProduct = useCallback(async () => {
    clearMessages();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      const { formData, productData } = createFormData();

      console.log("Enviando producto:", productData);
      console.log("Imagen:", newProduct.image.name, newProduct.image.size, "bytes");

      const response = await api.post("/productos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: API_TIMEOUT,
      });

      console.log("Producto creado:", response.data);
      
      setSuccessMessage("Producto creado exitosamente.");
      resetForm();

      setTimeout(() => {
        navigate("/productos");
      }, 1500);

    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [clearMessages, validateForm, getAuthToken, createFormData, newProduct.image, resetForm, navigate, handleApiError]);

  // Función para actualizar campos del producto
  const updateProductField = useCallback((field, value) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  }, []);

  // Cleanup de la vista previa al desmontar el componente
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
            required
            value={newProduct.name}
            onChange={(e) => updateProductField('name', e.target.value)}
            disabled={loading}
            placeholder="Ingresa el nombre del producto"
          />
          
          <TextField
            label="Precio"
            fullWidth
            required
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={newProduct.price}
            onChange={(e) => updateProductField('price', e.target.value)}
            disabled={loading}
            placeholder="0.00"
          />
          
          <TextField
            label="Stock"
            fullWidth
            required
            type="number"
            inputProps={{ min: 0, step: 1 }}
            value={newProduct.stock}
            onChange={(e) => updateProductField('stock', e.target.value)}
            disabled={loading}
            placeholder="0"
          />
          
          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={newProduct.category}
              onChange={(e) => updateProductField('category', e.target.value)}
              label="Categoría"
              disabled={loading}
            >
              {CATEGORIES.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Descripción"
            fullWidth
            required
            multiline
            rows={3}
            value={newProduct.description}
            onChange={(e) => updateProductField('description', e.target.value)}
            disabled={loading}
            placeholder="Describe tu producto..."
          />
          
          <Button 
            variant="contained" 
            component="label" 
            fullWidth
            disabled={loading}
          >
            {newProduct.image ? "Cambiar imagen" : "Agregar imagen *"}
            <input
              type="file"
              accept={ALLOWED_FILE_TYPES.join(',')}
              hidden
              onChange={handleFileChange}
            />
          </Button>
          
          {imagePreview && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" gutterBottom>
                Vista previa:
              </Typography>
              <Box
                component="img"
                src={imagePreview}
                alt="Vista previa del producto"
                sx={{ 
                  maxWidth: "100%", 
                  maxHeight: 300, 
                  mt: 1,
                  borderRadius: 1,
                  border: "1px solid #ddd",
                  objectFit: "contain"
                }}
              />
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleCreateProduct}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? "Creando..." : "Crear Producto"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProductForm;
