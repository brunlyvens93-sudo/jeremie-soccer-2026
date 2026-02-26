import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HeartIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import AdminControls from '../components/AdminControls';
import EditEventModal from '../components/EditEventModal';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est admin (lyvens)
  const isAdmin = user?.username === 'lyvens';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events/');
      setEvents(response.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (eventId) => {
    if (!user) {
      toast.error('Connectez-vous pour suivre ce match');
      return;
    }
    try {
      await axios.post(`/events/${eventId}/favorite/`);
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, is_favorited: !e.is_favorited } : e
      ));
      toast.success('Favoris mis à jour');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedEvent) => {
    setEvents(events.map(e => 
      e.id === updatedEvent.id ? updatedEvent : e
    ));
  };

  const handleDelete = (deletedEventId) => {
    setEvents(events.filter(e => e.id !== deletedEventId));
  };

  const getSportColor = (type) => {
    const colors = {
      'FOOT': 'from-emerald-500 to-green-600',
      'BASK': 'from-orange-500 to-red-500',
      'TENN': 'from-yellow-400 to-amber-500',
      'RUGB': 'from-blue-600 to-indigo-700',
      'VOLL': 'from-purple-500 to-pink-500',
      'AUTR': 'from-gray-500 to-slate-600'
    };
    return colors[type] || colors.AUTR;
  };

  const getSportIcon = (type) => {
    const icons = {
      'FOOT': '⚽',
      'BASK': '🏀',
      'TENN': '🎾',
      'RUGB': '🏉',
      'VOLL': '🏐',
      'AUTR': '⚡'
    };
    return icons[type] || '⚡';
  };

  const getSportLabel = (type) => {
    const labels = {
      'FOOT': 'Football',
      'BASK': 'Basketball',
      'TENN': 'Tennis',
      'RUGB': 'Rugby',
      'VOLL': 'Volleyball',
      'AUTR': 'Autre'
    };
    return labels[type] || type;
  };

  const sports = [
    { id: 'all', label: 'Tous', icon: '🔥', color: 'from-blue-500 to-purple-500' },
    { id: 'FOOT', label: 'Football', icon: '⚽', color: 'from-emerald-500 to-green-600' },
    { id: 'BASK', label: 'Basket', icon: '🏀', color: 'from-orange-500 to-red-500' },
    { id: 'TENN', label: 'Tennis', icon: '🎾', color: 'from-yellow-400 to-amber-500' },
    { id: 'RUGB', label: 'Rugby', icon: '🏉', color: 'from-blue-600 to-indigo-700' },
    { id: 'VOLL', label: 'Volley', icon: '🏐', color: 'from-purple-500 to-pink-500' },
  ];

  const groupByDate = (events) => {
    const groups = {};
    events.forEach(event => {
      const date = format(new Date(event.date), 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    return groups;
  };

  const filteredEvents = selectedSport === 'all' 
    ? events 
    : events.filter(e => e.sport_type === selectedSport);
  
  const groupedEvents = groupByDate(filteredEvents);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-500 border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">⚡</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
  Jérémie Soccer
</h1>
  
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tous les matchs et événements sportifs près de chez vous en temps réel
          </p>
        </div>

        {/* Sports filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sports.map(sport => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`relative group overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                selectedSport === sport.id 
                  ? 'shadow-2xl scale-105' 
                  : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${sport.color} ${
                selectedSport === sport.id ? 'opacity-100' : 'opacity-50'
              }`}></div>
              <div className="relative px-6 py-3 flex items-center space-x-2">
                <span className="text-2xl">{sport.icon}</span>
                <span className="font-semibold text-white">{sport.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Matches by date */}
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <div key={date} className="relative">
              {/* Date header */}
              <div className="sticky top-20 z-10 mb-4">
                <div className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20">
                  <h2 className="text-lg font-semibold text-white">
                    {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </h2>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dayEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/event/${event.id}`}
                    className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Contrôles admin - seulement visible pour lyvens */}
                    {isAdmin && (
                      <AdminControls 
                        event={event} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    )}
                    
                    {/* Card gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getSportColor(event.sport_type)} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-6">
                      {/* Header with sport and time */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-2xl filter drop-shadow-lg`}>
                            {getSportIcon(event.sport_type)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getSportColor(event.sport_type)}`}>
                            {getSportLabel(event.sport_type)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold text-white">
                            {format(new Date(event.date), 'HH:mm')}
                          </span>
                        </div>
                      </div>

                      {/* Match title */}
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                        {event.title}
                      </h3>

                      {/* Teams */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-3 text-gray-300">
                          <span className="text-lg">⚽</span>
                          <span className="font-medium">
                            {event.title.split(' vs ')[0] || 'Équipe A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300">
                          <span className="text-lg">⚽</span>
                          <span className="font-medium">
                            {event.title.split(' vs ')[1] || 'Équipe B'}
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      {/* Footer with favorite button */}
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-xs text-gray-400">
                          {event.description.substring(0, 30)}...
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleFavorite(event.id);
                          }}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          {event.is_favorited ? (
                            <HeartIconSolid className="h-5 w-5 text-pink-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-gray-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Aucun match trouvé</h3>
            <p className="text-gray-400 mb-8">Il n'y a pas d'événements pour cette catégorie</p>
            {user ? (
              <Link 
                to="/create-event" 
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl"
              >
                Créer un événement
              </Link>
            ) : (
              <Link 
                to="/register" 
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl"
              >
                Rejoindre la communauté
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      <EditEventModal
        event={editingEvent}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Home;