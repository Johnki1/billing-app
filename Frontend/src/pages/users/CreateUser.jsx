import { useState } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Alert 
} from "@mui/material";
import axios from "axios";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.post(
        "http://localhost:8080/user/register",
        { username, password, rol: role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Usuario registrado exitosamente.");
      setUsername("");
      setPassword("");
      setRole("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Registrar Usuario
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="role-label">Rol</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Rol"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
            <MenuItem value="MESERO">MESERO</MenuItem>
            <MenuItem value="CAJERO">CAJERO</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Registrar Usuario
        </Button>
      </Box>
    </Container>
  );
};

export default CreateUser;
