import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import InvoiceView from "./InvoiceView";

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedSaleForView, setSelectedSaleForView] = useState(null);
  const [openAddProductsDialog, setOpenAddProductsDialog] = useState(false);
  const [selectedSaleForAdd, setSelectedSaleForAdd] = useState(null);
  const [additionalProducts, setAdditionalProducts] = useState([]);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [saleToComplete, setSaleToComplete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);


  const token = localStorage.getItem("jwtToken");

  const fetchSales = async (start, end) => {
    try {
      const response = await api.get("/ventas/usuario", {
        params: {
          inicio: start || new Date().toISOString().slice(0, 16),
          fin: end || new Date().toISOString().slice(0, 16),
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(response.data);
      setError("");
    } catch (err) {
      setError("Error al obtener ventas");
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/productos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchSales(startDate, endDate);
    fetchProducts();
  }, [startDate, endDate]);

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

  const handleFilter = () => {
    fetchSales(startDate, endDate);
  };

  const handleOpenViewDialog = (sale) => {
    setSelectedSaleForView(sale);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedSaleForView(null);
  };

  const handleOpenAddProductsDialog = (sale) => {
    if (sale.status !== "PENDIENTE") return;
    setSelectedSaleForAdd(sale);
    setAdditionalProducts([]);
    setOpenAddProductsDialog(true);
  };

  const handleCloseAddProductsDialog = () => {
    setOpenAddProductsDialog(false);
    setSelectedSaleForAdd(null);
    setAdditionalProducts([]);
  };

  const handleChangeAdditionalQuantity = (productoId, action) => {
    setAdditionalProducts((prev) => {
      let updated = [...prev];
      let item = updated.find((p) => p.productoId === productoId);
      if (item) {
        if (action === "increase") item.cantidad += 1;
        else if (action === "decrease" && item.cantidad > 0) item.cantidad -= 1;
        if (item.cantidad === 0) updated = updated.filter((p) => p.productoId !== productoId);
      } else if (action === "increase") {
        updated.push({ productoId, cantidad: 1 });
      }
      return updated;
    });
  };

  const handleAddProducts = async () => {
    if (selectedSaleForAdd && additionalProducts.length > 0) {
      try {
        await api.put(
          `/ventas/${selectedSaleForAdd.id}/agregarProductos`,
          { detail: additionalProducts },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMessage("Productos agregados exitosamente.");
        setError("");
        handleCloseAddProductsDialog();
        fetchSales(startDate, endDate);
      } catch (err) {
        setError("Error al agregar productos");
        console.error(err);
      }
    }
  };

  const handleRemoveProduct = async (saleId, productoId) => {
    try {
      const response = await api.delete(`/ventas/${saleId}/producto/${productoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedSaleForView(response.data);
      setSuccessMessage("Cantidad reducida o producto eliminado exitosamente.");
      setError("");
      fetchSales(startDate, endDate);
    } catch (err) {
      setError("Error al reducir/eliminar producto");
      console.error(err);
    }
  };

  const handleOpenCompleteDialog = (sale) => {
    setSaleToComplete(sale);
    setOpenCompleteDialog(true);
  };

  const handleCloseCompleteDialog = () => {
    setOpenCompleteDialog(false);
    setSaleToComplete(null);
  };

  const handleConfirmCompleteSale = async () => {
    try {
      await api.put(
        `/ventas/${saleToComplete.id}/completar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Venta completada.");
      setError("");
      handleCloseCompleteDialog();
      fetchSales(startDate, endDate);
    } catch (err) {
      setError("Error al completar la venta");
      console.error(err);
    }
  };

  // Nueva función para actualizar el descuento y el detalle de venta
  const handleUpdateSale = async (updatedSale) => {
    try {
      const response = await api.put(
        `/ventas/${updatedSale.id}/actualizar`,
        {
          discount: updatedSale.discount,
          saleDetail: updatedSale.saleDetail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedSaleForView(response.data); // Actualizar la vista con la respuesta del backend
      setSuccessMessage("Descuento y detalle actualizados exitosamente.");
      setError("");
      fetchSales(startDate, endDate); // Refrescar la lista de ventas
    } catch (err) {
      setError("Error al actualizar la venta");
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <style>{`
        @media print {
          .invoice-print {
            width: 80mm;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
      <Typography variant="h4" gutterBottom>Lista de Ventas</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Filtrar Ventas</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Fecha de Inicio"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha de Fin"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" color="primary" onClick={handleFilter}>
            Filtrar
          </Button>
        </Box>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Mesa</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.tableId}</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.status}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenViewDialog(sale)}>
                      <VisibilityIcon />
                    </IconButton>
                    {sale.status === "PENDIENTE" && (
                      <>
                        <IconButton color="primary" onClick={() => handleOpenAddProductsDialog(sale)}>
                          <AddIcon />
                        </IconButton>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleOpenCompleteDialog(sale)}
                          sx={{ ml: 1 }}
                        >
                          Completar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Factura #{selectedSaleForView?.id}</DialogTitle>
        <DialogContent dividers>
          <Box className="invoice-print" sx={{ maxWidth: "100%" }}>
            <InvoiceView sale={selectedSaleForView} products={products} onUpdateSale={handleUpdateSale} />
          </Box>
          {selectedSaleForView?.status === "PENDIENTE" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Eliminar Productos:</Typography>
              {selectedSaleForView?.detail.map((d) => (
                <Box key={d.productoId} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>
                    {products.find((p) => p.id === d.productoId)?.nombre || d.productoId} - Cant: {d.cantidad}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveProduct(selectedSaleForView.id, d.productoId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Cerrar</Button>
          <Button onClick={() => window.print()} variant="contained" startIcon={<PrintIcon />}>
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddProductsDialog} onClose={handleCloseAddProductsDialog} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Productos a Venta #{selectedSaleForAdd?.id}</DialogTitle>
        <DialogContent dividers>
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
              const quantity = additionalProducts.find((p) => p.productoId === product.id)?.cantidad || 0;
              return (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <img src={product.imageUrl} alt={product.nombre} style={{ width: "100%", height: 100 }} />
                    <Typography variant="h6">{product.nombre}</Typography>
                    <Typography>${product.precio}</Typography>
                    <ButtonGroup sx={{ mt: 1 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleChangeAdditionalQuantity(product.id, "decrease")}
                        disabled={quantity === 0}
                      >
                        -
                      </Button>
                      <Button variant="outlined" disabled>
                        {quantity}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleChangeAdditionalQuantity(product.id, "increase")}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProductsDialog}>Cancelar</Button>
          <Button onClick={handleAddProducts} variant="contained" color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCompleteDialog} onClose={handleCloseCompleteDialog}>
        <DialogTitle>Confirmar Finalización</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que desea completar la venta #{saleToComplete?.id}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmCompleteSale} variant="contained" color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
    </Container>
  );
};

export default SaleList;