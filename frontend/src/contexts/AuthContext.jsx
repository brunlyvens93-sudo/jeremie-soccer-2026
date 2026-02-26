import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get('/accounts/me/');
        setUser(response.data);
      } catch (error) {
        console.error('Erreur vérification utilisateur:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    console.log('Tentative de connexion avec JWT...');
    
    try {
      const response = await axios.post('/token/', {
        username,
        password
      });
      
      console.log('Réponse JWT:', response.data);
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      await checkUser();
      toast.success('Connexion réussie !');
      return true;
    } catch (error) {
      console.error('Erreur JWT:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Erreur de connexion');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/accounts/register/', userData);
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      return true;
    } catch (error) {
      console.error('Erreur inscription:', error.response?.data);
      
      // Afficher les erreurs de validation
      if (error.response?.data) {
        const errors = Object.values(error.response.data).flat();
        errors.forEach(err => toast.error(err));
      } else {
        toast.error("Erreur lors de l'inscription");
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('Déconnexion réussie');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};