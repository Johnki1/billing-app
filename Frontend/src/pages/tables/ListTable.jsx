import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ListTables = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("ALL"); 
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTableId, setDeleteTableId] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");

  const token = localStorage.getItem("jwtToken");

  const fetchTables = async () => {
    try {
      const url = filter === "FREE" ? "http://localhost:8080/mesas/libres" : "http://localhost:8080/mesas";
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setTables(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener mesas");
    }
  };

  useEffect(() => {
    fetchTables();
  }, [filter]);

  const handleOpenDeleteDialog = (tableId) => {
    setDeleteTableId(tableId);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/mesas/${deleteTableId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Mesa eliminada exitosamente.");
      setOpenDeleteDialog(false);
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar mesa");
    }
  };

  const handleOpenUpdateDialog = (table) => {
    setSelectedTable(table);
    setUpdateStatus(table.estado || ""); 
    setOpenUpdateDialog(true);
  };

  const handleUpdateTable = async () => {
    try {
      await axios.put(
        `http://localhost:8080/mesas/${selectedTable.id}/estado`,
        JSON.stringify(updateStatus),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Estado de la mesa actualizado exitosamente.");
      setOpenUpdateDialog(false);
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar estado de mesa");
    }
  };
  

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Mesas
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <ButtonGroup variant="contained">
          <Button color={filter === "ALL" ? "primary" : "inherit"} onClick={() => setFilter("ALL")}>
            Todas
          </Button>
          <Button color={filter === "FREE" ? "primary" : "inherit"} onClick={() => setFilter("FREE")}>
            Libres
          </Button>
        </ButtonGroup>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.id}</TableCell>
                <TableCell>{table.numero}</TableCell>
                <TableCell>{table.estado}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenUpdateDialog(table)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpenDeleteDialog(table.id)}
                    disabled={table.estado !== "LIBRE"}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de eliminar esta mesa?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
        <DialogTitle>Actualizar Estado de Mesa</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="update-table-status-label">Estado</InputLabel>
            <Select
              labelId="update-table-status-label"
              value={updateStatus || ""}
              label="Estado"
              onChange={(e) => setUpdateStatus(e.target.value)}
            >
              <MenuItem value="LIBRE">LIBRE</MenuItem>
              <MenuItem value="OCUPADA">OCUPADA</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUpdateTable} variant="contained" color="primary">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListTables;
