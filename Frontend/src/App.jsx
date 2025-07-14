  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { Box, CssBaseline } from '@mui/material';
  import Navbar from './components/Navbar';
  import Footer from './components/Footer';
  import Home from './pages/Home';
  import Dashboard from './pages/Dashboard';
  import Login from './pages/Login';
  import Products from './pages/products/ProductsPrincipal.jsx';
  import ProductForm from './pages/products/ProductForm.jsx';
  import SaleList from './pages/sale/SaleList.jsx';
  import CreateSale from './pages/sale/CreateSale.jsx'
  import CreateUser from './pages/users/CreateUser.jsx'
  import ListUser from './pages/users/ListUser.jsx'
  import CreateTable from './pages/tables/CreateTable.jsx';
  import ListTable from './pages/tables/ListTable.jsx';
  import AuthGuard from './components/AuthGuard';

  const App = () => {
    return (
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <CssBaseline />
          <Navbar />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/productos"
                element={
                  <AuthGuard>
                    <Products />
                  </AuthGuard>
                }
              />
              <Route
                path="/productos/nuevo"
                element={
                  <AuthGuard>
                    <ProductForm />
                  </AuthGuard>
                }
              />
              <Route
                path="/ventas"
                element={
                  <AuthGuard>
                    <SaleList />
                  </AuthGuard>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <AuthGuard>
                    <ListUser />
                  </AuthGuard>
                }
              />
              <Route
                path="/usuarios/nuevo"
                element={
                  <AuthGuard>
                    <CreateUser />
                  </AuthGuard>
                }
              />
              <Route
                path="/ventas/nuevo"
                element={
                  <AuthGuard>
                    <CreateSale />
                  </AuthGuard>
                }
              />
              <Route
                path="/mesas"
                element={
                  <AuthGuard>
                    <ListTable />
                  </AuthGuard>
                }
              />
              <Route
                path="/mesas/nuevo"
                element={
                  <AuthGuard>
                    <CreateTable />
                  </AuthGuard>
                }
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    );
  };

  export default App;
