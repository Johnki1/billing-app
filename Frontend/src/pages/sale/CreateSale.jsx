import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  ButtonGroup,
  Box,
  Alert,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CreateSale = () => {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newSale, setNewSale] = useState({ tableId: "", detail: [], discount: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [tableError, setTableError] = useState("");
  const [saleDetailOption, setSaleDetailOption] = useState("Pago en efectivo");
  const [saleDetailCustom, setSaleDetailCustom] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const [tablesResponse, productsResponse] = await Promise.all([
          api.get("/mesas", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/productos", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setTables(tablesResponse.data);
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "TODOS") {
      filtered = filtered.filter((p) => p.tipo === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, products, searchTerm]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleTableChange = (event) => {
    const selectedTableId = event.target.value;
    const selectedTable = tables.find((table) => table.id === selectedTableId);
    if (selectedTable && selectedTable.estado === "OCUPADA") {
      setTableError("Esta mesa está ocupada. Por favor, seleccione otra mesa.");
      setNewSale({ ...newSale, tableId: "" });
    } else {
      setTableError("");
      setNewSale({ ...newSale, tableId: selectedTableId });
    }
  };

  const handleCreateSale = async () => {
    if (newSale.detail.length === 0) {
      console.error("Selecciona al menos un producto");
      return;
    }
    const saleDetail = saleDetailOption === "Otro" ? saleDetailCustom : saleDetailOption;
    const formattedSale = {
      tableId: newSale.tableId,
      discount: parseFloat(newSale.discount) || 0,
      saleDetail: saleDetail || "Sin detalle",
      detail: newSale.detail.map(({ productoId, cantidad }) => ({
        productoId,
        cantidad,
      })),
    };
    try {
      const token = localStorage.getItem("jwtToken");
      await api.post("/ventas", formattedSale, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewSale({ tableId: "", detail: [], discount: 0 });
      setSaleDetailOption("Pago en efectivo");
      setSaleDetailCustom("");
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating sale:", error.response?.data || error.message);
    }
  };

  const handleChangeQuantity = (productoId, action) => {
    setNewSale((prev) => {
      const updatedDetail = [...prev.detail];
      const existingDetail = updatedDetail.find((d) => d.productoId === productoId);
      if (existingDetail) {
        if (action === "increase") {
          existingDetail.cantidad += 1;
        } else if (action === "decrease" && existingDetail.cantidad > 0) {
          existingDetail.cantidad -= 1;
        }
        if (existingDetail.cantidad === 0) {
          return { ...prev, detail: updatedDetail.filter((d) => d.productoId !== productoId) };
        }
      } else if (action === "increase") {
        updatedDetail.push({ productoId, cantidad: 1 });
      }
      return { ...prev, detail: updatedDetail };
    });
  };

  const isConfirmButtonDisabled = !newSale.tableId || tableError || newSale.detail.length === 0;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Crear Nueva Venta</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Nueva Venta
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nueva Venta</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Seleccionar Mesa:</Typography>
          <Select fullWidth value={newSale.tableId} onChange={handleTableChange}>
            {tables.map((table) => (
              <MenuItem key={table.id} value={table.id}>
                Mesa {table.numero} {table.estado === "OCUPADA" ? "(Ocupada)" : ""}
              </MenuItem>
            ))}
          </Select>
          {tableError && <Alert severity="error" sx={{ mt: 2 }}>{tableError}</Alert>}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Descuento:</Typography>
          <TextField
            fullWidth
            type="number"
            value={newSale.discount}
            onChange={(e) => setNewSale({ ...newSale, discount: e.target.value })}
            inputProps={{ min: 0 }}
          />
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Detalle de Venta:</Typography>
          <Select
            fullWidth
            value={saleDetailOption}
            onChange={(e) => setSaleDetailOption(e.target.value)}
          >
            <MenuItem value="Pago en efectivo">Pago en efectivo</MenuItem>
            <MenuItem value="Pago Por Transferencia">Pago Por Transferencia</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
          </Select>
          {saleDetailOption === "Otro" && (
            <TextField
              fullWidth
              label="Escribe el detalle de venta"
              value={saleDetailCustom}
              onChange={(e) => setSaleDetailCustom(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Seleccionar Productos:</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoría</InputLabel>
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="CALIENTE">Caliente</MenuItem>
              <MenuItem value="FRIO">Frío</MenuItem>
              <MenuItem value="ADICIONES">Adiciones</MenuItem>
              <MenuItem value="BEBIDAS">Bebidas</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Buscar producto por nombre"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            {filteredProducts.map((product) => {
              const quantity = newSale.detail.find((d) => d.productoId === product.id)?.cantidad || 0;
              return (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.imageUrl}
                      alt={product.nombre}
                    />
                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                      <Typography variant="h6">{product.nombre}</Typography>
                      <Typography variant="body1">${product.precio}</Typography>
                      <Box mt={2}>
                        <ButtonGroup>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleChangeQuantity(product.id, "decrease")}
                            disabled={quantity === 0}
                          >
                            <RemoveIcon />
                          </Button>
                          <Button variant="outlined" disabled>{quantity}</Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleChangeQuantity(product.id, "increase")}
                          >
                            <AddIcon />
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateSale}
            variant="contained"
            color="primary"
            disabled={isConfirmButtonDisabled}
          >
            Confirmar Venta
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateSale;
