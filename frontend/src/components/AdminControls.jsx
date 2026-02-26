import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const AdminControls = ({ event, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`/events/${event.id}/`);
      toast.success('Événement supprimé avec succès');
      onDelete(event.id);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="absolute top-4 left-4 flex space-x-2 z-20">
      {/* Bouton Modifier */}
      <button
        onClick={() => onEdit(event)}
        className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
        title="Modifier l'événement"
      >
        <PencilIcon className="h-5 w-5 text-white" />
      </button>

      {/* Bouton Supprimer */}
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
        title="Supprimer l'événement"
      >
        <TrashIcon className="h-5 w-5 text-white" />
      </button>

      {/* Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1F25] rounded-2xl p-6 max-w-md mx-4 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer "{event.title}" ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-[#2C2D33] text-white hover:bg-[#3D8BFF] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControls;