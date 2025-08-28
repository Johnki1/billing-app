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
  CircularProgress,
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
  const [loading, setLoading] = useState(false);

  // Función mejorada para manejar archivos
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Limpiar errores previos
    setError("");
    
    if (!file) {
      setNewProduct({ ...newProduct, image: null });
      setImagePreview(null);
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipo de archivo no válido. Usa JPG, PNG, GIF o WebP.");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("El archivo es demasiado grande. Máximo 5MB.");
      return;
    }

    setNewProduct({ ...newProduct, image: file });
    
    // Crear preview de forma más segura
    try {
      const objectURL = URL.createObjectURL(file);
      setImagePreview(objectURL);
    } catch (err) {
      console.error("Error creating image preview:", err);
      setError("Error al mostrar la vista previa de la imagen");
    }
  };

  // Función de validación
  const validateForm = () => {
    if (!newProduct.name.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      setError("El precio debe ser mayor a 0");
      return false;
    }
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      setError("El stock debe ser 0 o mayor");
      return false;
    }
    if (!newProduct.category) {
      setError("La categoría es requerida");
      return false;
    }
    if (!newProduct.description.trim()) {
      setError("La descripción es requerida");
      return false;
    }
    if (!newProduct.image) {
      setError("La imagen es requerida");
      return false;
    }
    return true;
  };

  const handleCreateProduct = async () => {
    // Limpiar mensajes previos
    setError("");
    setSuccessMessage("");

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        setError("No hay token de autenticación");
        setLoading(false);
        return;
      }

      // Crear FormData de forma más explícita
      const formData = new FormData();
      
      // Crear el objeto producto
      const productData = {
        nombre: newProduct.name.trim(),
        precio: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        descripcion: newProduct.description.trim(),
        tipo: newProduct.category,
      };

      // Agregar datos del producto como blob JSON
      const productBlob = new Blob([JSON.stringify(productData)], {
        type: "application/json"
      });
      
      formData.append("producto", productBlob);
      
      // Agregar imagen
      formData.append("imagen", newProduct.image, newProduct.image.name);

      console.log("Enviando producto:", productData);
      console.log("Imagen:", newProduct.image.name, newProduct.image.size, "bytes");

      const response = await api.post("/productos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // No establecer Content-Type, deja que el browser lo haga automáticamente
          // "Content-Type": "multipart/form-data", // ← Quitar esta línea
        },
        timeout: 30000, // 30 segundos de timeout
      });

      console.log("Producto creado:", response.data);
      
      setSuccessMessage("Producto creado exitosamente.");
      
      // Limpiar formulario
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: null,
      });
      
      // Limpiar preview y liberar memoria
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }

      // Navegar después de un breve delay
      setTimeout(() => {
        navigate("/productos");
      }, 1500);

    } catch (error) {
      console.error("Error creating product:", error);
      
      let errorMessage = "Error al crear el producto";
      
      if (error.response) {
        // Error del servidor
        errorMessage = error.response.data?.message || `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        // Error de red
        errorMessage = "Error de conexión. Verifica tu internet.";
      } else {
        // Otro tipo de error
        errorMessage = error.message || "Error desconocido";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar URL object cuando se desmonte el componente
  React.useEffect(() => {
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
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            disabled={loading}
          />
          
          <TextField
            label="Precio"
            fullWidth
            required
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            disabled={loading}
          />
          
          <TextField
            label="Stock"
            fullWidth
            required
            type="number"
            inputProps={{ min: 0, step: 1 }}
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            disabled={loading}
          />
          
          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              label="Categoría"
              disabled={loading}
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
            required
            multiline
            rows={3}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            disabled={loading}
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
              accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
                sx={{ 
                  maxWidth: "100%", 
                  maxHeight: 300, 
                  mt: 1,
                  borderRadius: 1,
                  border: "1px solid #ddd"
                }}
              />
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
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
