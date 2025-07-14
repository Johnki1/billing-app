import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#6A1B9A', 
        color: '#000', 
        p: 1.5, 
        mt: 'auto',
        position: 'sticky',
        bottom: 0,
        width: '100%',
        textAlign: 'center', 
        fontFamily: '"Roboto", sans-serif',
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.7)',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'medium', // Texto un poco más grueso
          fontSize: '0.875rem', // Tamaño de fuente más pequeño
          letterSpacing: '0.03em', // Espaciado entre letras sutil
        }}
      >
        ©UnoIgualADos. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;