import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#1E1F25] border-b border-[#2C2D33] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#3D8BFF]">⚽</span>
            <span className="font-bold text-xl text-white">Jérémie Soccer</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="text-[#9A9B9F] hover:text-white transition-colors px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[#3D8BFF]"
            >
              Matchs
            </Link>
            <Link 
              to="/favorites" 
              className="text-[#9A9B9F] hover:text-white transition-colors px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[#3D8BFF]"
            >
              Favoris
            </Link>
            {user && (
              <Link 
                to="/create-event" 
                className="text-[#9A9B9F] hover:text-white transition-colors px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[#3D8BFF]"
              >
                Créer
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white bg-[#2C2D33] px-3 py-1.5 rounded-lg">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="border border-[#2C2D33] text-[#9A9B9F] px-4 py-2 rounded-lg font-medium hover:bg-[#2C2D33] hover:text-white transition-colors text-sm"
                >
                  Quitter
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="border border-[#2C2D33] text-[#9A9B9F] px-4 py-2 rounded-lg font-medium hover:bg-[#2C2D33] hover:text-white transition-colors text-sm"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-[#3D8BFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2D6FCC] transition-colors text-sm"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;