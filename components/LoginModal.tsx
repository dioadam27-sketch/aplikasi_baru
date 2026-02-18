import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Password salah!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="relative p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <Lock className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Admin Area</h3>
            <p className="text-sm text-slate-500">Masukkan password untuk mengedit.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                autoFocus
              />
              {error && <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;