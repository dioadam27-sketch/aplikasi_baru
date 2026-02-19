import React from 'react';
import { LayoutGrid, BookOpen, Info, LogOut, Lock, GraduationCap, Users, FileText, BarChart3, Monitor, HelpCircle, Database, ChevronRight, ChevronLeft, Copy, Check } from 'lucide-react';
import { AppItem } from '../types';

interface SidebarProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  heroTitle: string;
  apps: AppItem[];
  apiUrl?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isAdmin, 
  onAdminClick, 
  onLogout, 
  heroTitle, 
  apps, 
  apiUrl,
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyApi = () => {
    if (!apiUrl) return;
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMiniIcon = (iconUrl: string) => {
    // Increased sizes for collapsed state (24px) vs expanded (16px)
    const props = { size: isCollapsed ? 24 : 16, strokeWidth: 2.5 };
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
    return <img src={iconUrl} alt="" className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'} object-contain`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
  };

  return (
    <aside 
      className={`bg-[#002147] text-white flex-shrink-0 relative overflow-hidden flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 shadow-2xl z-40 
        ${isCollapsed ? 'w-20' : 'w-72'} 
        hidden md:flex h-screen`}
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
      
      {/* Minimalist Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Collapse Toggle Button */}
      <button 
        onClick={onToggleCollapse}
        className="absolute top-1/2 -right-3 translate-y-[-50%] w-6 h-12 bg-[#FFC600] text-[#002147] rounded-full flex items-center justify-center z-50 shadow-lg hover:scale-110 transition-transform cursor-pointer border border-white/20 active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`relative z-10 flex flex-col h-full py-8 ${isCollapsed ? 'items-center px-2' : 'px-8 items-start'} gap-10 overflow-hidden`}>
        
        {/* Branding Area */}
        <div className={`flex flex-col gap-4 w-full transition-all duration-300 ${isCollapsed ? 'items-center' : 'items-start'}`}>
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC600] to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className={`relative ${isCollapsed ? 'w-12 h-12 p-2' : 'w-16 h-16 p-2'} bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden transition-all duration-300`}>
              <img 
                src="https://ppk2ipe.unair.ac.id/gambar/UNAIR_BRANDMARK_2025-02.png" 
                alt="Logo UNAIR" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className={`transition-all duration-300 text-center md:text-left ${isCollapsed ? 'opacity-0 scale-90 h-0 overflow-hidden mt-0' : 'opacity-100 scale-100 h-auto mt-0'}`}>
            <h1 className="font-extrabold text-xl tracking-tight leading-tight uppercase whitespace-nowrap">
              PDB <span className="text-[#FFC600]">Apps</span>
            </h1>
            <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase mt-1">
              Universitas Airlangga
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 w-full flex-grow overflow-hidden">
          <div className={`mb-4 w-full transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100 h-auto mb-4'}`}>
            <p className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-3 px-4">Menu Utama</p>
          </div>
          
          <div 
            className={`flex items-center gap-3 w-full transition-all duration-300 cursor-pointer bg-[#FFC600] text-[#002147] border border-[#FFC600]/20 shadow-lg shadow-[#FFC600]/10 hover:scale-[1.02] active:scale-95
              ${isCollapsed ? 'justify-center h-14 rounded-2xl p-0' : 'justify-start px-4 py-3.5 rounded-xl font-bold'}`} 
            title="Dashboard"
          >
            <LayoutGrid size={isCollapsed ? 28 : 20} className="transition-transform duration-300" />
            <span className={`text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 font-bold'}`}>Dashboard</span>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar w-full mt-6 space-y-6">
            <div className={`w-full`}>
              <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100 h-auto px-4 mb-3'}`}>
                <p className="text-[10px] font-black text-white/30 tracking-widest uppercase">Layanan Terdaftar</p>
              </div>
              <div className="flex flex-col gap-2">
                {apps.length > 0 ? (
                  apps.map((app) => (
                    <a 
                      key={app.id}
                      href={app.status === 'off' ? '#' : app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer 
                        ${isCollapsed ? 'justify-center h-12 w-12 mx-auto p-0' : 'justify-between px-4 py-3'} 
                        ${app.status === 'off' ? 'opacity-30 grayscale pointer-events-none' : ''}`}
                      title={isCollapsed ? app.title : undefined}
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`flex-shrink-0 flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'group-hover:scale-110 group-hover:text-[#FFC600]' : 'p-1.5 rounded-lg bg-white/5 group-hover:bg-[#FFC600]/10 group-hover:text-[#FFC600]'}`}>
                          {renderMiniIcon(app.iconUrl)}
                        </div>
                        <span className={`text-[13px] font-medium truncate transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{app.title}</span>
                      </div>
                      {!isCollapsed && app.status === 'maintenance' && (
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                      )}
                    </a>
                  ))
                ) : (
                  !isCollapsed && <p className="px-4 py-2 text-[11px] text-white/20 italic">Kosong...</p>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Admin Section */}
        <div className={`w-full border-t border-white/10 pt-6 flex flex-col gap-3 transition-all duration-300 ${isCollapsed ? 'items-center' : ''}`}>
          {isAdmin ? (
            <div className="flex flex-col gap-3 w-full">
               {/* API Config Box */}
               {apiUrl && !isCollapsed && (
                 <div className="bg-[#00152e] rounded-xl p-3 border border-white/5 animate-in fade-in zoom-in duration-300 mb-2">
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Endpoint Aktif</p>
                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-2 border border-white/5 group/api cursor-pointer hover:bg-black/40 transition-colors" onClick={handleCopyApi} title="Salin API">
                       <code className="text-[10px] text-emerald-400 font-mono truncate flex-1">{apiUrl}</code>
                       <div className="text-white/30 group-hover/api:text-white transition-colors">
                          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                       </div>
                    </div>
                 </div>
               )}

              <button
                onClick={onLogout}
                className={`group flex items-center justify-center gap-3 transition-all border border-red-500/20 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white
                  ${isCollapsed ? 'h-12 w-12 rounded-2xl' : 'w-full px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest'}`}
                title="Keluar Admin"
              >
                <LogOut size={isCollapsed ? 22 : 18} />
                <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAdminClick}
              className={`flex items-center justify-center rounded-2xl transition-all group hover:bg-white/10 hover:scale-110 active:scale-95 ${isCollapsed ? 'w-12 h-12' : 'w-full p-4'}`}
              title="Akses Admin"
            >
              <Lock size={isCollapsed ? 24 : 20} className="text-white/40 group-hover:text-[#FFC600] transition-colors" />
              {!isCollapsed && <span className="ml-3 text-xs font-bold text-white/40 group-hover:text-white tracking-widest uppercase">Admin</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;