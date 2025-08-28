import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Snackbar, Alert } from '@mui/material';
import websocket from '../services/websocket';
import api from "../api/axiosConfig";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchStats = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.warn('[Dashboard] ❌ No hay token encontrado en localStorage');
        setError('No hay sesión activa.');
        return;
      }

      try {
        const response = await api.get("/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        console.error('[Dashboard] ❌ Error al obtener estadísticas:', err);
        setError('No se pudieron cargar las estadísticas. Verifique su sesión.');
      }
    };

    fetchStats();

    const handleDashboardUpdate = (newStats) => {
      setStats(newStats);
    };

    const handleNotification = (message) => {
      setNotification(message);
    };

    const token = localStorage.getItem('jwtToken');
    if (token) {
      websocket.connect(handleNotification, handleDashboardUpdate);
    } else {
      console.warn('[WebSocket] ⚠️ No hay token para conectar WebSocket');
    }

    return () => {
      websocket.disconnect();
    };
  }, []);

  const handleCloseNotification = () => setNotification(null);

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container>
        <Typography variant="h6">Cargando estadísticas del dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ color: 'var(--text-color)' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {[
          { label: 'Ventas Diarias', value: stats.dailySales },
          { label: 'Ventas Semanales', value: stats.weeklySales },
          { label: 'Ventas Mensuales', value: stats.monthlySales },
        ].map(({ label, value }) => (
          <Grid item xs={12} md={4} key={label}>
            <Paper sx={{ p: 2, backgroundColor: 'var(--background-color)' }}>
              <Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
                {label}
              </Typography>
              <Typography variant="h4" sx={{ color: 'var(--text-color)' }}>
                ${value ? value.toFixed(2) : '0.00'}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Productos más vendidos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: 'var(--background-color)' }}>
            <Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
              Productos Más Vendidos
            </Typography>
            {stats.bestSellingProducts && stats.bestSellingProducts.length > 0 ? (
              <ul>
                {stats.bestSellingProducts.map((product) => (
                  <li key={product.name} style={{ color: 'var(--text-color)' }}>
                    {product.name} - {product.quantitySold} vendidos ($
                    {product.totalIncome?.toFixed(2) || '0.00'})
                  </li>
                ))}
              </ul>
            ) : (
              <Typography sx={{ color: 'var(--text-color)' }}>
                No hay productos vendidos aún.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Alerta WebSocket */}
      <Snackbar open={!!notification} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity="warning">
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
