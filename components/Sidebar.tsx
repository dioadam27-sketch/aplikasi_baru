import React from 'react';
import { LayoutGrid, BookOpen, Info, LogOut, Lock, GraduationCap, Users, FileText, BarChart3, Monitor, HelpCircle, Database, ChevronRight, Copy, Check } from 'lucide-react';
import { AppItem } from '../types';

interface SidebarProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  heroTitle: string;
  apps: AppItem[];
  apiUrl?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin, onAdminClick, onLogout, heroTitle, apps, apiUrl }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyApi = () => {
    if (!apiUrl) return;
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMiniIcon = (iconUrl: string) => {
    const props = { size: 14, strokeWidth: 2.5 };
    if (iconUrl && iconUrl.startsWith('preset:')) {
      const presetId = iconUrl.split(':')[1];
      switch (presetId) {
        case 'layout': return <LayoutGrid {...props} />;
        case 'book': return <BookOpen {...props} />;
        case 'graduation': return <GraduationCap {...props} />;
        case 'users': return <Users {...props} />;
        case 'file': return <FileText {...props} />;
        case 'chart': return <BarChart3 {...props} />;
        case 'monitor': return <Monitor {...props} />;
        case 'help': return <HelpCircle {...props} />;
        case 'data': return <Database {...props} />;
        default: return <LayoutGrid {...props} />;
      }
    }
    return <img src={iconUrl} alt="" className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
  };

  return (
    <aside className="w-full md:w-72 bg-[#002147] text-white flex-shrink-0 relative overflow-hidden flex flex-col min-h-[80px] md:min-h-screen transition-all border-r border-white/5 shadow-2xl">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
      
      {/* Minimalist Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 p-8 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start h-full gap-8">
        {/* Branding Area */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC600] to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden p-2">
              <img 
                src="https://pkkii.pendidikan.unair.ac.id/website/logo.jpeg" 
                alt="Logo UNAIR" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://ui-avatars.com/api/?name=UNAIR&background=fff&color=002147';
                }}
              />
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Direktorat Pendidikan</p>
            <h1 className="font-extrabold text-2xl tracking-tight leading-none uppercase">
              PDB <span className="text-[#FFC600]">APPS</span>
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex flex-col gap-1 w-full flex-grow overflow-hidden">
          <div className="mb-4">
            <p className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-3 px-4">Menu Utama</p>
            <div className="flex items-center gap-3 px-4 py-3 bg-[#FFC600] rounded-xl text-[#002147] font-bold border border-[#FFC600]/20 shadow-lg shadow-[#FFC600]/10 transition-all cursor-pointer">
              <LayoutGrid size={18} />
              <span className="text-sm">Dashboard</span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-3 px-4 mt-2">Daftar Aplikasi</p>
            <div className="flex flex-col gap-0.5">
              {apps.length > 0 ? (
                apps.map((app) => (
                  <a 
                    key={app.id}
                    href={app.status === 'off' ? '#' : app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-between px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer ${app.status === 'off' ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-[#FFC600]/10 group-hover:text-[#FFC600] transition-colors`}>
                        {renderMiniIcon(app.iconUrl)}
                      </div>
                      <span className="text-[13px] font-medium truncate max-w-[120px]">{app.title}</span>
                    </div>
                    {app.status === 'maintenance' && (
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    )}
                  </a>
                ))
              ) : (
                <p className="px-4 py-2 text-[11px] text-white/20 italic">Belum ada aplikasi...</p>
              )}
            </div>
          </div>
        </nav>

        {/* Admin Section */}
        <div className="md:mt-auto md:w-full border-t border-white/5 pt-6">
          {isAdmin ? (
            <div className="flex flex-col gap-3 w-full">
               {/* API Config Box */}
               {apiUrl && (
                 <div className="bg-[#00152e] rounded-xl p-3 border border-white/5">
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">API Endpoint</p>
                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-2 border border-white/5 group/api cursor-pointer hover:bg-black/40 transition-colors" onClick={handleCopyApi} title="Klik untuk menyalin">
                       <code className="text-[10px] text-emerald-400 font-mono truncate flex-1">{apiUrl}</code>
                       <div className="text-white/30 group-hover/api:text-white transition-colors">
                          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                       </div>
                    </div>
                 </div>
               )}

              <button
                onClick={onLogout}
                className="group flex items-center justify-center gap-3 px-4 py-3 w-full text-xs font-bold text-white bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
              >
                <LogOut size={16} />
                <span className="hidden md:inline uppercase tracking-widest">Logout Admin</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAdminClick}
              className="flex items-center justify-center p-3 w-full rounded-xl transition-all group hover:bg-white/10"
              title="Admin Login"
            >
              <Lock size={20} className="text-white/40 group-hover:text-[#FFC600] transition-colors" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;