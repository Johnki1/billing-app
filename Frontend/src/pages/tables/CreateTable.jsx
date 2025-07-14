import { useState } from "react";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import axios from "axios";

const CreateTable = () => {
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.post(
        "http://localhost:8080/mesas",
        { numero: tableNumber, estado: "LIBRE" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Mesa creada exitosamente.");
      setTableNumber("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear mesa");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Crear Mesa
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Número de Mesa"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          margin="normal"
          required
        />
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Crear Mesa
        </Button>
      </Box>
    </Container>
  );
};

export default CreateTable;
