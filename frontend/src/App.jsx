import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import Favorites from './pages/Favorites';

function App() {
  useEffect(() => {
    document.title = 'Jérémie Soccer';
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E1F25',
                color: '#fff',
                border: '1px solid #2C2D33',
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;