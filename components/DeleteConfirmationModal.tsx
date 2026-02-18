import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, appName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Aplikasi?</h3>
          <p className="text-slate-500 mb-6">
            Apakah Anda yakin ingin menghapus <span className="font-semibold text-slate-700">"{appName}"</span>? 
            Tindakan ini tidak dapat dibatalkan.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium shadow-lg hover:shadow-red-500/30 transition-all"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
