"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ModuleData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg_grad: string;
  demo_type: string;
  demo_title: string;
  demo_link: string | null;
}

const COLOR_THEMES = [
  { name: "Blue", colorClass: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20", bgGradClass: "bg-[#38BDF8]/10", display: "bg-blue-500" },
  { name: "Orange", colorClass: "bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20", bgGradClass: "bg-[#FF5E3A]/10", display: "bg-orange-500" },
  { name: "Rose/Red", colorClass: "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20", bgGradClass: "bg-[#FF9A9E]/10", display: "bg-rose-500" },
  { name: "Green", colorClass: "bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20", bgGradClass: "bg-[#FFD166]/10", display: "bg-green-500" },
  { name: "Purple", colorClass: "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20", bgGradClass: "bg-[#A78BFA]/10", display: "bg-purple-500" },
  { name: "Amber", colorClass: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20", bgGradClass: "bg-[#FBBF24]/10", display: "bg-amber-500" }
];

const AVAILABLE_ICONS = [
  "Wallet", "Package", "MapPin", "Activity", "ChartBar", 
  "Users", "Monitor", "ShoppingCart", "Briefcase", "Mail",
  "Calendar", "MessageSquare", "Phone", "Shield", "Zap", "Box", "Globe", "Cloud", "Database", "Camera"
];

// Helper to render icon safely
const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Box;
  return <IconComponent className={className} />;
};

export default function ModulesCMS() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    icon: "Box",
    color: COLOR_THEMES[0].colorClass,
    bg_grad: COLOR_THEMES[0].bgGradClass,
    demo_type: "",
    demo_title: "",
    demo_link: "",
  });

  const loadModules = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi("/modules");
      setModules(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const openModal = (module: ModuleData | null = null) => {
    if (module) {
      setEditingModule(module);
      setFormData({
        id: module.id,
        name: module.name,
        description: module.description,
        icon: module.icon,
        color: module.color,
        bg_grad: module.bg_grad,
        demo_type: module.demo_type,
        demo_title: module.demo_title,
        demo_link: module.demo_link || "",
      });
    } else {
      setEditingModule(null);
      setFormData({
        id: "",
        name: "",
        description: "",
        icon: "Box",
        color: COLOR_THEMES[0].colorClass,
        bg_grad: COLOR_THEMES[0].bgGradClass,
        demo_type: "grid",
        demo_title: "",
        demo_link: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModule) {
        await fetchApi(`/modules/${editingModule.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi("/modules", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      closeModal();
      loadModules();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus modul ini?")) {
      try {
        await fetchApi(`/modules/${id}`, { method: "DELETE" });
        loadModules();
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Modules</h1>
          <p className="text-on-surface-variant text-sm mt-1">Ubah dan atur modul AI ekosistem yang ditawarkan Luvion.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Tambah Modul
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div key={module.id} className="bg-surface border border-border/40 rounded-2xl p-5 hover:border-border/80 shadow-xl transition-colors flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${module.bg_grad} bg-opacity-20`}>
                  <div className={`w-8 h-8 rounded bg-background ${module.color} flex items-center justify-center`}>
                    <IconRenderer name={module.icon} className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{module.name}</h3>
                  <p className="text-xs text-on-surface-variant/70">{module.id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal(module)} className="text-primary hover:text-primary/80 transition-colors p-1"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(module.id)} className="text-error hover:text-error/80 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 flex-1">{module.description}</p>
            
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-zinc-500">
              <div className="col-span-2 sm:col-span-1">
                <span className="block font-medium text-zinc-400">Demo Style</span>
                {module.demo_type} - {module.demo_title}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block font-medium text-zinc-400">Demo Link</span>
                {module.demo_link ? (
                  <a href={module.demo_link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate block">
                    {module.demo_link}
                  </a>
                ) : (
                  <span className="text-zinc-600">- Tidak ada link -</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-extrabold text-foreground">{editingModule ? "Edit Modul" : "Tambah Modul"}</h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">ID Modul</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingModule}
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 outline-none"
                    placeholder="misal: gym-pro"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Nama Modul</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Deskripsi</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 p-4 bg-background/50 border border-border/40 rounded-xl">
                {/* Visual Icon Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">Pilih Ikon</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_ICONS.map((iconName) => {
                      const isSelected = formData.icon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setFormData({...formData, icon: iconName})}
                          className={`p-2 rounded-lg border transition-all ${
                            isSelected 
                              ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20" 
                              : "bg-surface border-border/40 text-on-surface-variant hover:text-foreground hover:bg-black/5"
                          }`}
                          title={iconName}
                        >
                          <IconRenderer name={iconName} className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Visual Theme Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">Tema Warna</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_THEMES.map((theme) => {
                      const isSelected = formData.color === theme.colorClass;
                      return (
                        <button
                          key={theme.name}
                          type="button"
                          onClick={() => setFormData({...formData, color: theme.colorClass, bg_grad: theme.bgGradClass})}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left text-sm ${
                            isSelected 
                              ? "bg-primary/10 border-primary text-foreground font-bold shadow-sm" 
                              : "bg-surface border-border/40 text-on-surface-variant hover:bg-black/5"
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${theme.display} shadow-lg`}></span>
                          {theme.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Tipe Tampilan Demo</label>
                  <select
                    required
                    value={formData.demo_type}
                    onChange={(e) => setFormData({...formData, demo_type: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="chart">Chart / Grafik</option>
                    <option value="list">List / Daftar</option>
                    <option value="grid">Grid / Kartu</option>
                    <option value="travel">Travel Card</option>
                    <option value="wms">WMS / Inventaris</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-on-surface-variant">Judul Tampilan Demo</label>
                  <input
                    type="text"
                    required
                    value={formData.demo_title}
                    onChange={(e) => setFormData({...formData, demo_title: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="misal: Finance Ledger"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-on-surface-variant">Link Demo Project (Opsional)</label>
                <input
                  type="url"
                  value={formData.demo_link}
                  onChange={(e) => setFormData({...formData, demo_link: e.target.value})}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://demo.luvion.ai/gym-pro"
                />
                <p className="text-[10px] text-on-surface-variant/80">Tautan ini dapat dihubungkan di landing page agar pengunjung dapat mencoba langsung aplikasi.</p>
              </div>

            </form>

            <div className="p-6 border-t border-border/40 flex justify-end gap-3 bg-surface/50 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:text-foreground hover:bg-black/5 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
