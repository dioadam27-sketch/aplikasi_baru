import React from 'react';
import { Lock, LogOut, GraduationCap } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onAdminClick, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">PDB Apps</span>
          </div>
          
          <div>
            {isAdmin ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
              >
                <LogOut size={16} />
                <span>Admin Logout</span>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Admin Login"
              >
                <Lock size={16} />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
