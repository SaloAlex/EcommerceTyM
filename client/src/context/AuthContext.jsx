import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Inicialización con función para evitar lecturas innecesarias
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem('isAuthenticated');
      return stored === 'true';
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return false;
    }
  });

  // Efecto para sincronizar el estado con localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('isAuthenticated');
      if (storedAuth === 'true' && !isAuthenticated) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error in auth effect:', error);
    }
  }, [isAuthenticated]);

  // Usando useCallback para memoizar las funciones
  const login = useCallback(() => {
    try {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      console.error('Error in login:', error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Error in logout:', error);
    }
  }, []);

  // Valor memorizado del contexto
  const contextValue = {
    isAuthenticated,
    login,
    logout,
    // Método auxiliar para debug
    checkAuth: () => {
      console.log('Current auth state:', isAuthenticated);
      console.log('localStorage auth:', localStorage.getItem('isAuthenticated'));
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };