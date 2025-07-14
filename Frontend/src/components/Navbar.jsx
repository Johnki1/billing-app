import { useState, Fragment as ReactFragment } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  useMediaQuery, 
  useTheme, 
  Box, 
  Collapse 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import {  jwtDecode} from "jwt-decode";
import logo from "../assets/images/logo.jpeg";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState({});

  const handleMenuOpen = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }

  // Menús para ADMINISTRADOR
  const menuItems = ["mesas", "usuarios", "ventas", "productos"];

  const drawer = (
    <List>
      {token ? (
        <>
          <ListItem component={Link} to="/dashboard" sx={{ textDecoration: "none" }}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {role === "ADMINISTRADOR" &&
            menuItems.map((menu) => (
              <ReactFragment key={menu}>
                <ListItem onClick={() => handleSubMenuToggle(menu)}>
                  <ListItemText primary={`Gestión de ${menu.charAt(0).toUpperCase() + menu.slice(1)}`} />
                  {openSubMenu[menu] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openSubMenu[menu]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      component={Link}
                      to={`/${menu}`}
                      sx={{ pl: 4, textDecoration: "none" }}
                    >
                      <ListItemText primary={`Listar ${menu}`} />
                    </ListItem>
                    <ListItem
                      component={Link}
                      to={`/${menu}/nuevo`}
                      sx={{ pl: 4, textDecoration: "none" }}
                    >
                      <ListItemText primary={`Crear ${menu}`} />
                    </ListItem>
                  </List>
                </Collapse>
              </ReactFragment>
            ))}
          <ListItem onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <ListItem component={Link} to="/login" sx={{ textDecoration: "none" }}>
          <ListItemText primary="Login" />
        </ListItem>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "var(--primary-color)" }}>
      <Toolbar>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexGrow: 1 }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ height: 80, width: 100, mb: 1 }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "var(--light-text-color)",
              fontWeight: "bold",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            UnoIgualADos
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleDrawerToggle} edge="end">
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              sx={{
                "& .MuiDrawer-paper": {
                  width: 240,
                },
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <>
            {token ? (
              <>
                {role === "MESERO" || role === "CAJERO" ? (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/ventas"
                      sx={{ mx: 1 }}
                    >
                      Gestión de Ventas
                    </Button>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/ventas/nuevo"
                      sx={{ mx: 1 }}
                    >
                      Crear Venta
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/dashboard"
                      sx={{ mx: 1 }}
                    >
                      Dashboard
                    </Button>
                    {menuItems.map((menu) => (
                      <ReactFragment key={menu}>
                        <Button
                          color="inherit"
                          onClick={(e) => handleMenuOpen(e, menu)}
                          sx={{ mx: 1 }}
                        >
                          Gestión de {menu.charAt(0).toUpperCase() + menu.slice(1)}
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={openMenu === menu}
                          onClose={handleMenuClose}
                        >
                          <MenuItem component={Link} to={`/${menu}`} onClick={handleMenuClose}>
                            Listar {menu}
                          </MenuItem>
                          <MenuItem component={Link} to={`/${menu}/nuevo`} onClick={handleMenuClose}>
                            Crear {menu}
                          </MenuItem>
                        </Menu>
                      </ReactFragment>
                    ))}
                  </>
                )}
                <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={{ mx: 1 }}>
                Login
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
