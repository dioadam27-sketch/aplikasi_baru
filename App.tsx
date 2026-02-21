import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import AppEditorModal from './components/AppEditorModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import Sidebar from './components/Sidebar';
import ParticleBackground from './components/ParticleBackground';
import TiltCard from './components/TiltCard';
import { Plus, Edit2, Trash2, LayoutGrid, ExternalLink, BookOpen, GraduationCap, Users, FileText, BarChart3, Monitor, HelpCircle, Database, AlertCircle, RefreshCw, Clock, ArrowRight, ShieldCheck, WifiOff } from 'lucide-react';
import { AppItem, PageConfig, AppColor } from './types';
import { INITIAL_CONFIG, INITIAL_APPS } from './constants';

const API_URL = 'https://pkkii.pendidikan.unair.ac.id/pdb/api.php';
const LOGO_URL = 'https://pkkii.pendidikan.unair.ac.id/website/logo.jpeg';

const colorVariants: Record<AppColor, { bg: string, text: string, light: string }> = {
  blue: { bg: 'bg-[#002147]', text: 'text-[#002147]', light: 'bg-blue-50' },
  green: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50' },
  orange: { bg: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
  red: { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50' },
  teal: { bg: 'bg-teal-600', text: 'text-teal-600', light: 'bg-teal-50' },
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [deleteApp, setDeleteApp] = useState<AppItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<boolean>(false); 
  const [currentTime, setCurrentTime] = useState(new Date());

  const [apps, setApps] = useState<AppItem[]>([]);
  const [pageConfig, setPageConfig] = useState<PageConfig>(INITIAL_CONFIG);

  const fetchData = async (isBackground = false) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    try {
      if (!isBackground) {
        setIsLoading(true);
      }
      
      // Use POST for get_data as well to avoid caching issues and GET param stripping
      const formData = new URLSearchParams();
      formData.append('action', 'get_data');

      const response = await fetch(`${API_URL}`, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      
      if (data.apps) {
        setApps(data.apps.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          url: item.url,
          iconUrl: item.icon_url,
          category: item.category,
          status: item.status,
          color: item.color
        })));
      }
      if (data.config) {
        setPageConfig({
          heroTitle: data.config.hero_title,
          heroDescription: data.config.hero_description
        });
      }
      setApiError(false);
    } catch (error: any) {
      if (!isBackground) {
        console.warn("API unavailable, switching to offline mode.");
      }
      setApiError(true);
      // Fallback to INITIAL_APPS if we have no apps loaded yet to ensure UI works
      setApps(prev => prev.length > 0 ? prev : INITIAL_APPS);
    } finally {
      if (!isBackground) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData(); 
    
    const syncInterval = setInterval(() => {
      fetchData(true);
    }, 3000);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(timer);
    };
  }, []);

  const handleLogin = (password: string) => {
    if (password === '112233') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleSaveApp = async (app: AppItem) => {
    // Optimistic Update: Update local state immediately
    const oldApps = [...apps];
    setApps(prev => {
      const index = prev.findIndex(a => a.id === app.id);
      if (index > -1) {
        const newApps = [...prev];
        newApps[index] = app;
        return newApps;
      }
      return [...prev, app];
    });

    try {
      // Use URLSearchParams for better compatibility with shared hosting (avoid JSON body issues)
      const formData = new URLSearchParams();
      formData.append('action', 'save_app');
      formData.append('id', app.id);
      formData.append('title', app.title);
      formData.append('description', app.description);
      formData.append('url', app.url);
      formData.append('icon_url', app.iconUrl);
      formData.append('category', app.category);
      formData.append('status', app.status);
      formData.append('color', app.color);

      const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      if (!res.ok) throw new Error('Simpan gagal');
      setEditingApp(null);
      // Optional: re-fetch to ensure server state is in sync
      await fetchData(true); 
    } catch (error) {
      // Rollback if failed
      setApps(oldApps);
      alert("Gagal menyimpan ke server. Periksa koneksi Anda.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteApp) return;
    
    // Optimistic Update
    const oldApps = [...apps];
    setApps(prev => prev.filter(a => a.id !== deleteApp.id));
    const deletedApp = deleteApp;
    setDeleteApp(null);

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'delete_app');
      formData.append('id', deletedApp.id);

      const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      if (!res.ok) throw new Error('Hapus gagal');
      await fetchData(true);
    } catch (error) {
       setApps(oldApps);
       alert("Gagal menghapus dari server.");
    }
  };

  const handleConfigChange = async (key: keyof PageConfig, value: string) => {
    const newConfig = { ...pageConfig, [key]: value };
    setPageConfig(newConfig);
    try {
      await fetch(`${API_URL}?action=update_config`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Action': 'update_config'
        },
        body: JSON.stringify({
          action: 'update_config',
          heroTitle: key === 'heroTitle' ? value : pageConfig.heroTitle,
          heroDescription: key === 'heroDescription' ? value : pageConfig.heroDescription
        })
      });
    } catch (error) {
      // Silent error in offline mode
    }
  };

  const renderAppIcon = (iconUrl: string, colorClass: string) => {
    const props = { size: 28, strokeWidth: 2, className: colorClass };
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
    return <img src={iconUrl} alt="" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
  };

  // Custom CSS for Staggered Animation
  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeInUp {
      animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      opacity: 0;
    }
  `;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F1F5F9] font-sans text-slate-900">
      <style>{animationStyles}</style>
      <Sidebar 
        isAdmin={isAdmin} 
        onAdminClick={() => setIsLoginOpen(true)} 
        onLogout={() => setIsAdmin(false)} 
        heroTitle={pageConfig.heroTitle}
        apps={apps}
        apiUrl={API_URL}
      />

      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth flex flex-col">
        {/* Background Animation - Placed here to sit behind content */}
        <div className="fixed inset-0 md:left-72 z-0 pointer-events-none">
           <ParticleBackground />
        </div>

        {/* UNAIR Branded Header */}
        <div className="sticky top-0 z-30 bg-[#002147]/95 backdrop-blur-md border-b border-white/10 px-8 py-5 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <div className="md:hidden w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 p-2 flex-shrink-0">
               <img 
                 src={LOGO_URL} 
                 alt="Logo" 
                 className="w-full h-full object-contain" 
                 referrerPolicy="no-referrer"
                 onError={(e) => {
                   e.currentTarget.src = 'https://ui-avatars.com/api/?name=UNAIR&background=002147&color=fff';
                 }}
               />
            </div>
            {/* Removed Title and Description text */}
          </div>
          
          <div className="flex items-center gap-6">
             {apiError && (
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs font-bold animate-pulse">
                 <WifiOff size={14} />
                 <span>Mode Offline</span>
               </div>
             )}

             <div className="hidden lg:flex items-center gap-4 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 shadow-inner">
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                  <Clock size={16} className="text-[#FFC600] animate-pulse" />
                  <p className="text-sm text-white font-mono font-bold tracking-widest">
                    {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                  {currentTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
             </div>
             {isAdmin && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFC600] text-[#002147] text-[10px] font-black rounded-lg shadow-xl uppercase tracking-widest">
                 <ShieldCheck size={12} /> Mode Editor
               </div>
             )}
          </div>
        </div>

        <div className="p-8 md:p-12 max-w-[1400px] mx-auto w-full relative z-10">
          {isLoading && apps.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#002147] border-t-[#FFC600] animate-spin"></div>
              </div>
              <p className="mt-6 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Sinkronisasi Data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apps.map((app, index) => {
                const isMaintenance = app.status === 'maintenance';
                const isOff = app.status === 'off';
                const variant = colorVariants[app.color] || colorVariants['blue'];

                return (
                  <div 
                    key={app.id} 
                    className="animate-fadeInUp h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TiltCard 
                      // FIX: Removed 'pointer-events-none' from here so admin buttons are clickable even when off
                      className={`group bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 h-full ${isOff ? 'opacity-50 grayscale' : ''}`}
                      disabled={isOff}
                    >
                      {/* Card Header Color Strip */}
                      <div className={`h-1.5 w-full ${variant.bg}`}></div>
                      
                      <div className="p-6 pb-3 relative">
                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                            <button onClick={(e) => { e.stopPropagation(); setEditingApp(app); setIsEditorOpen(true); }} className="p-2 bg-slate-50 hover:bg-[#002147] hover:text-white text-slate-600 rounded-lg border border-slate-200 transition-all"><Edit2 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteApp(app); }} className="p-2 bg-slate-50 hover:bg-red-600 hover:text-white text-slate-600 rounded-lg border border-slate-200 transition-all"><Trash2 size={14} /></button>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${variant.light} flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform duration-500`}>
                            {renderAppIcon(app.iconUrl, variant.text)}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isMaintenance ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                              {app.category || 'Layanan'}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-extrabold text-[#002147] mb-1.5 group-hover:text-blue-700 transition-colors">{app.title}</h3>
                        <p className="text-slate-500 text-[13px] leading-relaxed mb-4">{app.description}</p>
                      </div>
                      
                      <div className="p-6 pt-0 mt-auto">
                        <a 
                          href={isMaintenance || isOff ? '#' : app.url}
                          target={isMaintenance || isOff ? '_self' : '_blank'}
                          // FIX: Added 'pointer-events-none' here instead so only the link is disabled
                          className={`w-full group/btn flex items-center justify-between py-3 px-5 rounded-xl text-[10px] font-black tracking-[0.15em] transition-all duration-300 relative z-20 ${isMaintenance ? 'bg-amber-50 text-amber-700 cursor-not-allowed border border-amber-200' : 'bg-[#FFC600] hover:bg-[#002147] text-[#002147] hover:text-white shadow-lg shadow-[#FFC600]/20 hover:shadow-[#002147]/20'} ${isOff ? 'cursor-not-allowed pointer-events-none' : ''}`}
                          onClick={(e) => (isMaintenance || isOff) && e.preventDefault()}
                        >
                          <span className="uppercase">{isMaintenance ? 'Pemeliharaan' : 'Masuk Aplikasi'}</span>
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-[2px] ${isMaintenance ? 'bg-amber-700' : 'bg-[#002147] group-hover/btn:bg-white'} group-hover/btn:w-10 transition-all`}></span>
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                          </div>
                        </a>
                      </div>
                    </TiltCard>
                  </div>
                );
              })}

              {isAdmin && (
                <button 
                  onClick={() => { setEditingApp(null); setIsEditorOpen(true); }} 
                  className="group min-h-[300px] border-2 border-dashed border-slate-300 hover:border-[#002147] hover:bg-[#002147]/5 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all animate-fadeInUp"
                  style={{ animationDelay: `${apps.length * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#002147] group-hover:scale-110 transition-all">
                    <Plus size={32} />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 group-hover:text-[#002147]">Tambah Layanan</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      <AppEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} onSave={handleSaveApp} editingApp={editingApp} />
      <DeleteConfirmationModal isOpen={!!deleteApp} onClose={() => setDeleteApp(null)} onConfirm={handleConfirmDelete} appName={deleteApp?.title || ''} />
    </div>
  );
};

export default App;