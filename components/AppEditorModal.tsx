import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, LayoutGrid, BookOpen, GraduationCap, Users, FileText, BarChart3, Monitor, HelpCircle, Database } from 'lucide-react';
import { AppItem, AppStatus, AppColor } from '../types';

interface AppEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: AppItem) => void;
  editingApp?: AppItem | null;
}

const COLORS: { value: AppColor; label: string; class: string }[] = [
  { value: 'blue', label: 'Biru', class: 'bg-blue-500' },
  { value: 'green', label: 'Hijau', class: 'bg-emerald-500' },
  { value: 'orange', label: 'Oranye', class: 'bg-orange-500' },
  { value: 'purple', label: 'Ungu', class: 'bg-purple-500' },
  { value: 'red', label: 'Merah', class: 'bg-red-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
];

const PRESET_ICONS = [
  { id: 'preset:layout', icon: LayoutGrid, label: 'Umum' },
  { id: 'preset:book', icon: BookOpen, label: 'Pustaka' },
  { id: 'preset:graduation', icon: GraduationCap, label: 'Akademik' },
  { id: 'preset:users', icon: Users, label: 'SDM' },
  { id: 'preset:file', icon: FileText, label: 'Dokumen' },
  { id: 'preset:chart', icon: BarChart3, label: 'Monev' },
  { id: 'preset:monitor', icon: Monitor, label: 'Sistem' },
  { id: 'preset:help', icon: HelpCircle, label: 'Bantuan' },
  { id: 'preset:data', icon: Database, label: 'Data' },
];

const AppEditorModal: React.FC<AppEditorModalProps> = ({ isOpen, onClose, onSave, editingApp }) => {
  const [formData, setFormData] = useState<AppItem>({
    id: '',
    title: '',
    description: '',
    url: '',
    iconUrl: '',
    category: 'Umum',
    status: 'active',
    color: 'blue'
  });

  useEffect(() => {
    if (editingApp) {
      setFormData(editingApp);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        title: '',
        description: '',
        url: '',
        iconUrl: 'preset:layout', // Default to a preset
        category: 'Umum',
        status: 'active',
        color: 'blue'
      });
    }
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handlePresetSelect = (presetId: string) => {
    setFormData({ ...formData, iconUrl: presetId });
  };

  // Helper to check if current iconUrl is a specific preset
  const isPresetSelected = (id: string) => formData.iconUrl === id;
  
  // Helper to render preview icon (Handle both preset and URL)
  const renderPreviewIcon = () => {
    if (formData.iconUrl.startsWith('preset:')) {
      const preset = PRESET_ICONS.find(p => p.id === formData.iconUrl);
      const IconComp = preset ? preset.icon : LayoutGrid;
      return <IconComp size={24} className={`text-${formData.color}-600`} />;
    } else if (formData.iconUrl) {
      return <img src={formData.iconUrl} alt="Preview" className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />;
    }
    return <ImageIcon size={20} className="text-slate-400" />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {editingApp ? 'Edit Aplikasi' : 'Tambah Aplikasi Baru'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Aplikasi</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Contoh: E-Raport"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              placeholder="Jelaskan kegunaan aplikasi ini..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as AppStatus})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="active">Active (Normal)</option>
                <option value="maintenance">Maintenance</option>
                <option value="off">Off (Tidak Aktif)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warna Tema</label>
              <div className="flex gap-2 items-center h-[42px]">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setFormData({...formData, color: c.value})}
                    className={`w-8 h-8 rounded-full ${c.class} transition-transform ${formData.color === c.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Aplikasi</label>
              <input
                required
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Pendidikan, Utilitas..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Icon</label>
            
            {/* Preset Icons Grid */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_ICONS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = isPresetSelected(preset.id);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    title={preset.label}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-[10px]">{preset.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.iconUrl.startsWith('preset:') ? '' : formData.iconUrl}
                  onChange={(e) => setFormData({...formData, iconUrl: e.target.value})}
                  className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  placeholder="Atau tempel URL gambar (https://...)"
                />
              </div>
              
              <div className={`w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 bg-${formData.color}-50`}>
                {renderPreviewIcon()}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all font-medium"
            >
              <Save size={18} />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppEditorModal;
