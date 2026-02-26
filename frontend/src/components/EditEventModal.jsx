import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const EditEventModal = ({ event, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport_type: 'FOOT',
    date: '',
    time: '',
    location: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  // Mettre à jour le formulaire quand l'événement change
  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const hours = String(eventDate.getHours()).padStart(2, '0');
      const minutes = String(eventDate.getMinutes()).padStart(2, '0');
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        sport_type: event.sport_type || 'FOOT',
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
        location: event.location || '',
        address: event.address || ''
      });
    }
  }, [event]);

  // Ne rien afficher si le modal n'est pas ouvert ou si l'événement n'existe pas
  if (!isOpen || !event) return null;

  const sportOptions = [
    { value: 'FOOT', label: 'Football' },
    { value: 'BASK', label: 'Basketball' },
    { value: 'TENN', label: 'Tennis' },
    { value: 'RUGB', label: 'Rugby' },
    { value: 'VOLL', label: 'Volleyball' },
    { value: 'AUTR', label: 'Autre' }
  ];

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
      // Valider que la date et l'heure sont présentes
      if (!formData.date || !formData.time) {
        toast.error('Veuillez remplir la date et l\'heure');
        setLoading(false);
        return;
      }

      // Créer la date au bon format ISO
      const dateTimeStr = `${formData.date}T${formData.time}:00`;
      const dateTime = new Date(dateTimeStr);
      
      if (isNaN(dateTime.getTime())) {
        toast.error('Format de date invalide');
        setLoading(false);
        return;
      }

      const updatedData = {
        title: formData.title,
        description: formData.description,
        sport_type: formData.sport_type,
        date: dateTime.toISOString(),
        location: formData.location,
        address: formData.address,
        created_by_id: event.created_by?.id  // Garder le même créateur
      };

      console.log('Données envoyées:', updatedData);

      const response = await axios.put(`/events/${event.id}/`, updatedData);
      
      console.log('Réponse:', response.data);
      toast.success('Événement modifié avec succès');
      onSave(response.data);
      onClose();
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
        toast.error('Erreur lors de la modification');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1F25] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            Modifier l'événement
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre de l'événement *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2C2D33] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3D8BFF]"
              placeholder="Ex: PSG vs Marseille"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 bg-[#2C2D33] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3D8BFF]"
              placeholder="Description de l'événement..."
            />
          </div>

          {/* Type de sport */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type de sport *
            </label>
            <select
              name="sport_type"
              value={formData.sport_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2C2D33] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3D8BFF]"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#2C2D33] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3D8BFF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Heure *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#2C2D33] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3D8BFF]"
              />
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lieu *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2C2D33] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3D8BFF]"
              placeholder="Ex: Stade de France"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adresse *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2C2D33] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3D8BFF]"
              placeholder="Adresse complète"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#3D8BFF] text-white py-3 rounded-xl font-semibold hover:bg-[#2D6FCC] transition-colors disabled:opacity-50"
            >
              {loading ? 'Modification...' : 'Enregistrer les modifications'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#2C2D33] text-white py-3 rounded-xl font-semibold hover:bg-[#3D8BFF] transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;