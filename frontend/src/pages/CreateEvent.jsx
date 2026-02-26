import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport_type: 'FOOT',
    date: '',
    time: '',
    location: '',
    address: ''
  });

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un événement');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation basique
      if (!formData.date || !formData.time) {
        toast.error('Veuillez sélectionner une date et une heure');
        setLoading(false);
        return;
      }

      // Combiner date et time au format ISO
      const dateTimeStr = `${formData.date}T${formData.time}:00`;
      const dateTime = new Date(dateTimeStr);
      
      // Vérifier que la date est valide
      if (isNaN(dateTime.getTime())) {
        toast.error('Date ou heure invalide');
        setLoading(false);
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        sport_type: formData.sport_type,
        date: dateTime.toISOString(),
        location: formData.location,
        address: formData.address,
        created_by_id: user?.id
      };

      console.log('Données envoyées:', eventData); // Pour déboguer

      const response = await axios.post('/events/', eventData);
      console.log('Réponse:', response.data);
      
      toast.success('Événement créé avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      
      // Afficher les erreurs de validation du backend
      if (error.response?.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach(key => {
          const messages = errors[key];
          if (Array.isArray(messages)) {
            messages.forEach(msg => toast.error(`${key}: ${msg}`));
          } else {
            toast.error(`${key}: ${messages}`);
          }
        });
      } else {
        toast.error('Erreur lors de la création de l\'événement');
      }
    } finally {
      setLoading(false);
    }
  };

  const sportOptions = [
    { value: 'FOOT', label: 'Football' },
    { value: 'BASK', label: 'Basketball' },
    { value: 'TENN', label: 'Tennis' },
    { value: 'RUGB', label: 'Rugby' },
    { value: 'VOLL', label: 'Volleyball' },
    { value: 'AUTR', label: 'Autre' }
  ];

  // Obtenir la date du jour au format YYYY-MM-DD pour l'attribut min
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Créer un événement sportif
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'événement *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Tournoi de football amateur"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Décrivez l'événement, les modalités de participation, etc."
          />
        </div>

        {/* Type de sport */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de sport *
          </label>
          <select
            name="sport_type"
            value={formData.sport_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sportOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date et Heure */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={today}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Lieu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lieu *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Stade Municipal"
          />
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse complète *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: 123 Rue du Sport, Ville"
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Créer l\'événement'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;