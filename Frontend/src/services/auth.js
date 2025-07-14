import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    if (response.data.jwtToken) {
      localStorage.setItem('jwtToken', response.data.jwtToken);
    }

    return response.data;
  } catch (error) {
    console.error('Error en la autenticación:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

const getAuthToken = () => localStorage.getItem('jwtToken');
const isAuthenticated = () => !!getAuthToken();
const authHeader = () => {
  const token = getAuthToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : {};
};
const logout = () => {
  localStorage.removeItem('jwtToken');
};

export default {
  login,
  getAuthToken,
  isAuthenticated,
  authHeader,
  logout,
};
