import { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Alert 
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatePassword, setUpdatePassword] = useState("");
  const [updateRole, setUpdateRole] = useState(""); // se inicializa como cadena vacía

  const token = localStorage.getItem("jwtToken");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Actualizar updateRole cuando selectedUser cambie
  useEffect(() => {
    if (selectedUser) {
      setUpdateRole(selectedUser.rol || "");
    } else {
      setUpdateRole("");
    }
  }, [selectedUser]);

  const handleOpenDeleteDialog = (userId) => {
    setDeleteUserId(userId);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/user/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage("Usuario eliminado exitosamente.");
      setOpenDeleteDialog(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar usuario");
    }
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setUpdatePassword("");
    // El useEffect se encargará de setUpdateRole
    setOpenEditDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(
        `http://localhost:8080/user/${selectedUser.id}`,
        { password: updatePassword, role: updateRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Usuario actualizado exitosamente.");
      setOpenEditDialog(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar usuario");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Usuarios
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenEditDialog(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(user.id)}>
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
          <Typography>¿Estás seguro de eliminar este usuario?</Typography>
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

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Actualizar Usuario</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nueva Contraseña"
              type="password"
              value={updatePassword}
              onChange={(e) => setUpdatePassword(e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="update-role-label">Rol</InputLabel>
              <Select
                labelId="update-role-label"
                value={updateRole || ""}
                label="Rol"
                onChange={(e) => setUpdateRole(e.target.value)}
              >
                <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                <MenuItem value="MESERO">MESERO</MenuItem>
                <MenuItem value="CAJERO">CAJERO</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUpdateUser} variant="contained" color="primary">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListUsers;
