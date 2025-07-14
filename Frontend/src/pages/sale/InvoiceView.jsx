import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TextField, Button } from "@mui/material";
import logo from "../../assets/images/logo.jpeg";

const InvoiceView = ({ sale, products, onUpdateSale }) => {
  const [localDiscount, setLocalDiscount] = useState(sale?.discount || 0);
  const [localSaleDetail, setLocalSaleDetail] = useState(sale?.saleDetail || "");

  useEffect(() => {
    setLocalDiscount(sale?.discount || 0);
    setLocalSaleDetail(sale?.saleDetail || "");
  }, [sale]);

  const handleSaveChanges = () => {
    if (onUpdateSale && sale.status === "PENDIENTE") {
      onUpdateSale({ ...sale, discount: parseFloat(localDiscount) || 0, saleDetail: localSaleDetail });
    }
  };

  if (!sale) {
    return <Typography>Loading...</Typography>;
  }

  const productList = sale.detail.map((item) => {
    const product = products.find((p) => p.id === item.productoId);
    return {
      nombre: product ? product.nombre : `Producto ${item.productoId}`,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.cantidad * item.precioUnitario,
    };
  });

  const subtotal = productList.reduce((acc, curr) => acc + curr.subtotal, 0);
  const total = subtotal - (parseFloat(localDiscount) || 0);

  return (
    <Box sx={{ p: 2, maxWidth: "100%", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <img src={logo} alt="Logo" style={{ maxWidth: "50px" }} />
        <Typography variant="h6">UNOIGUALADOS</Typography>
        <Typography variant="body2">Contacto: +57 300 8531642</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Factura N°: {sale.id}</Typography>
        <Typography variant="body2">Fecha: {new Date(sale.date).toLocaleString()}</Typography>
        {sale.status === "PENDIENTE" ? (
          <>
            <TextField
              label="Detalle de Venta"
              value={localSaleDetail}
              onChange={(e) => setLocalSaleDetail(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
            <TextField
              label="Descuento"
              type="number"
              value={localDiscount}
              onChange={(e) => setLocalDiscount(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
              inputProps={{ min: 0 }}
            />
            <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{ mt: 1 }}>
              Guardar Cambios
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2">Detalle: {localSaleDetail || "Sin detalle"}</Typography>
            <Typography variant="body2">Descuento: ${parseFloat(localDiscount).toFixed(2)}</Typography>
          </>
        )}
      </Box>
      <Table size="small" sx={{ border: "1px solid #000" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">Cant.</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">Precio</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productList.map((prod, index) => (
            <TableRow key={index}>
              <TableCell>{prod.nombre}</TableCell>
              <TableCell align="right">{prod.cantidad}</TableCell>
              <TableCell align="right">${prod.precioUnitario.toFixed(2)}</TableCell>
              <TableCell align="right">${prod.subtotal.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">Subtotal:</Typography>
          <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">Descuento:</Typography>
          <Typography variant="body2">${(parseFloat(localDiscount) || 0).toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #000", mt: 1, pt: 1 }}>
          <Typography variant="body2" fontWeight="bold">Total:</Typography>
          <Typography variant="body2" fontWeight="bold">${total.toFixed(2)}</Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body2">¡Gracias por su compra!</Typography>
      </Box>
    </Box>
  );
};

InvoiceView.propTypes = {
  sale: PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.string,
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    saleDetail: PropTypes.string,
    status: PropTypes.string,
    detail: PropTypes.arrayOf(
      PropTypes.shape({
        productoId: PropTypes.number,
        cantidad: PropTypes.number,
        precioUnitario: PropTypes.number,
      })
    ),
  }),
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
      precio: PropTypes.number,
    })
  ).isRequired,
  onUpdateSale: PropTypes.func,
};

export default InvoiceView;