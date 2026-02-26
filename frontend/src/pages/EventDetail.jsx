import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HeartIcon, MapPinIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import AdminControls from '../components/AdminControls';
import EditEventModal from '../components/EditEventModal';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Vérifier si l'utilisateur est admin (lyvens)
  const isAdmin = user?.username === 'lyvens';

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${id}/`);
      setEvent(response.data);
      setIsFavorited(response.data.is_favorited);
    } catch (error) {
      toast.error('Événement non trouvé');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Vous devez être connecté');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/events/${id}/favorite/`);
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  const handleDelete = (deletedEventId) => {
    navigate('/');
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

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
          {/* En-tête avec dégradé */}
          <div className={`h-48 bg-gradient-to-r ${getSportColor(event.sport_type)} relative`}>
            {/* Contrôles admin - seulement visible pour lyvens */}
            {isAdmin && (
              <AdminControls 
                event={event} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            
            {/* Bouton favori */}
            <button
              onClick={handleFavorite}
              className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
            >
              {isFavorited ? (
                <HeartIconSolid className="h-6 w-6 text-pink-500" />
              ) : (
                <HeartIcon className="h-6 w-6 text-white" />
              )}
            </button>

            {/* Sport badge */}
            <div className="absolute bottom-4 left-4">
              <span className="px-4 py-2 bg-black/50 backdrop-blur rounded-full text-white font-semibold flex items-center space-x-2">
                <span className="text-2xl">{getSportIcon(event.sport_type)}</span>
                <span>{getSportLabel(event.sport_type)}</span>
              </span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-6">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date */}
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-6 w-6 text-[#3D8BFF] mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Date et heure</p>
                  <p className="text-lg text-white font-semibold">
                    {format(new Date(event.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-lg text-[#3D8BFF]">
                    à {format(new Date(event.date), 'HH:mm')}
                  </p>
                </div>
              </div>

              {/* Lieu */}
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-6 w-6 text-[#3D8BFF] mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Lieu</p>
                  <p className="text-lg text-white font-semibold">{event.location}</p>
                  <p className="text-gray-400">{event.address}</p>
                </div>
              </div>

              {/* Organisateur */}
              <div className="flex items-start space-x-3">
                <UserIcon className="h-6 w-6 text-[#3D8BFF] mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Organisateur</p>
                  <p className="text-lg text-white font-semibold">
                    {event.created_by?.username || 'Utilisateur inconnu'}
                  </p>
                </div>
              </div>

              {/* Sport */}
              <div className="flex items-start space-x-3">
                <span className="text-3xl">{getSportIcon(event.sport_type)}</span>
                <div>
                  <p className="text-sm text-gray-400">Sport</p>
                  <p className="text-lg text-white font-semibold">
                    {getSportLabel(event.sport_type)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-white/10 pt-6">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Bouton retour */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/')}
                className="text-[#3D8BFF] hover:text-white transition-colors font-semibold flex items-center group"
              >
                <span className="transform group-hover:-translate-x-2 transition-transform mr-2">←</span>
                Retour aux événements
              </button>
            </div>
          </div>
        </div>
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

export default EventDetail;