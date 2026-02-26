import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Vous devez être connecté pour voir vos favoris');
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/events/my_favorites/');
      setFavorites(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      await axios.post(`/events/${eventId}/favorite/`);
      setFavorites(favorites.filter(fav => fav.id !== eventId));
      toast.success('Retiré des favoris');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getSportTypeLabel = (type) => {
    const types = {
      'FOOT': 'Football',
      'BASK': 'Basketball',
      'TENN': 'Tennis',
      'RUGB': 'Rugby',
      'VOLL': 'Volleyball',
      'AUTR': 'Autre'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mes événements favoris
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <HeartIconSolid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            Vous n'avez pas encore d'événements favoris
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Découvrir des événements
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <Link to={`/event/${event.id}`} className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                      {event.title}
                    </h2>
                  </Link>
                  <button
                    onClick={() => removeFavorite(event.id)}
                    className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                    title="Retirer des favoris"
                  >
                    <HeartIconSolid className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {getSportTypeLabel(event.sport_type)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {format(new Date(event.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {event.location}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/event/${event.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Voir les détails →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;