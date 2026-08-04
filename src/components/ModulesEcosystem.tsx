'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg_grad: string;
  demo_type: string;
  demo_title: string;
  demo_link?: string | null;
  documentation?: string | null;
}

// Helper to render icon safely
const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Box;
  return <IconComponent className={className} />;
};

async function fetchModules(): Promise<ModuleItem[]> {
  const res = await fetch('/api/modules');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export default function ModulesEcosystem() {
  const { data: modules, error, isLoading } = useQuery<ModuleItem[]>({
    queryKey: ['modules'],
    queryFn: fetchModules,
  });

  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);

  const renderDemoContent = (type: string) => {
    switch (type) {
      case 'chart':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Dashboard Transaksi</span>
              <span className="text-emerald-500 font-mono">+12.5%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="h-16 bg-blue-500/10 rounded flex flex-col justify-end p-2 border border-blue-500/10">
                <span className="text-[10px] font-bold text-on-surface-variant/70">Keuntungan</span>
                <span className="text-sm font-extrabold text-blue-600">$4.2K</span>
              </div>
              <div className="h-16 bg-purple-500/10 rounded flex flex-col justify-end p-2 border border-purple-500/10">
                <span className="text-[10px] font-bold text-on-surface-variant/70">Penjualan</span>
                <span className="text-sm font-extrabold text-purple-600">$8.9K</span>
              </div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold border-b border-border/10 pb-2 mb-2">
              <span>Ringkasan Pesanan</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600">PRE-ORDER</span>
            </div>
            <div className="space-y-2 text-[10px] font-bold text-left">
              <div className="flex justify-between items-center opacity-85">
                <span>#1002 - Kemeja Uniqlo</span>
                <span className="text-emerald-600 font-mono">Lunas</span>
              </div>
              <div className="flex justify-between items-center opacity-85">
                <span>#1003 - Sepatu Nike</span>
                <span className="text-amber-600 font-mono">Dikirim</span>
              </div>
            </div>
          </div>
        );
      case 'travel':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span>Optimasi Rute</span>
              <span className="text-[10px] font-semibold text-rose-500 font-mono">3 perhentian</span>
            </div>
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[10px] font-bold">JKT</div>
              <div className="h-0.5 flex-1 border-t-2 border-dashed border-rose-500/30" />
              <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[10px] font-bold">BDG</div>
              <div className="h-0.5 flex-1 border-t-2 border-dashed border-rose-500/30" />
              <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[10px] font-bold">SUB</div>
            </div>
          </div>
        );
      case 'grid':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Pengguna Aktif</div>
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Pembayaran</div>
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Jadwal</div>
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Siaran WA</div>
            </div>
          </div>
        );
      case 'wms':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold border-b border-border/10 pb-2 mb-2">
              <span>Status Inventaris</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">STOK AMAN</span>
            </div>
            <div className="space-y-2 text-[10px] font-bold text-left mt-2">
              <div className="flex justify-between items-center opacity-85">
                <div className="flex items-center gap-1.5"><LucideIcons.Box className="w-3.5 h-3.5 text-blue-500" /> Rak A-12</div>
                <span className="text-on-surface-variant">140 Unit</span>
              </div>
              <div className="flex justify-between items-center opacity-85">
                <div className="flex items-center gap-1.5"><LucideIcons.PackageOpen className="w-3.5 h-3.5 text-amber-500" /> Rak B-04</div>
                <span className="text-amber-500">12 Unit (Low)</span>
              </div>
              <div className="flex justify-between items-center opacity-85">
                <div className="flex items-center gap-1.5"><LucideIcons.Truck className="w-3.5 h-3.5 text-emerald-500" /> Outbound</div>
                <span className="text-emerald-500">Proses...</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCardContent = (mod: ModuleItem, isOverlay = false) => (
    <>
      <div className={`absolute inset-0 opacity-30 ${mod.bg_grad} -z-10`} />
      {/* Header */}
      <div className="text-left flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${mod.color}`}>
          <IconRenderer name={mod.icon} className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-sans font-extrabold text-xl text-on-surface">{mod.name}</h3>
          <p className="text-xs text-on-surface-variant font-semibold mt-2 leading-relaxed">
            {mod.description}
          </p>
        </div>
      </div>

      {/* Simulated workspace preview */}
      <div className={`w-full aspect-[4/3] rounded-2xl overflow-hidden p-4 ${mod.bg_grad} flex flex-col justify-end relative border border-border/10 mt-6`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent -z-10" />
        {renderDemoContent(mod.demo_type)}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-2">
        {!isOverlay && (
          <button
            onClick={() => setSelectedModule(mod)}
            className="group w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm"
          >
            <LucideIcons.BookOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
            Penjelasan Fitur
          </button>
        )}
        {mod.demo_link && (
          <a
            href={mod.demo_link?.startsWith('http') ? mod.demo_link : `https://${mod.demo_link}`}
            target="_blank"
            rel="noreferrer"
            className="group w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 glass-panel text-on-surface border border-primary/30 hover:border-primary hover:bg-primary/5 shadow-sm"
          >
            Coba Demo Project
            <LucideIcons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </>
  );

  return (
    <section id="modules" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 dotted-grid opacity-30" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-left"
        >
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Ekosistem Modul</h2>
          <p className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
            Integrasi Mulus untuk Semua Kebutuhan Bisnis
          </p>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-on-surface-variant font-medium text-base max-w-sm text-left"
        >
          Modul-modul siap pakai yang terhubung otomatis ke dalam ekosistem sistem digital bisnis Anda.
        </motion.p>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-20">
          <div className="flex items-center gap-2 text-on-surface-variant/60">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-sm font-semibold">Memuat ekosistem modul...</span>
          </div>
        </div>
      ) : error ? (
        <div className="w-full flex justify-center py-20">
          <span className="text-sm text-error font-semibold">Gagal memuat modul. Silakan coba lagi.</span>
        </div>
      ) : (
        <div className="w-full flex gap-8 overflow-x-auto px-6 md:px-12 pb-12 snap-x snap-mandatory hide-scrollbar justify-start lg:justify-center relative z-10">
          {modules?.map((mod, index) => {
            const isSelected = selectedModule?.id === mod.id;
            return (
              <React.Fragment key={mod.id}>
                {isSelected ? (
                  <div className="snap-center shrink-0 w-[320px] md:w-[350px] min-h-[420px]" />
                ) : (
                  <motion.div
                    layoutId={`module-card-${mod.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="snap-center shrink-0 w-[320px] md:w-[350px] min-h-[420px] glass-panel rounded-[2rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden"
                  >
                    {renderCardContent(mod, false)}
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Sliding Panel untuk Dokumentasi */}
      <AnimatePresence>
        {selectedModule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setSelectedModule(null)}
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none">
              <div className="flex w-full max-w-6xl h-[90vh] md:h-[80vh] gap-6 items-center justify-center pointer-events-auto">
                {/* Cloned Card di kiri */}
                <motion.div
                  layoutId={`module-card-${selectedModule.id}`}
                  className="w-[320px] md:w-[350px] min-h-[420px] bg-background glass-panel rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden shrink-0"
                >
                  {renderCardContent(selectedModule, true)}
                </motion.div>

                {/* Window Dokumentasi di kanan */}
                <motion.div
                  initial={{ opacity: 0, width: 0, padding: 0 }}
                  animate={{ opacity: 1, width: '100%', padding: undefined }}
                  exit={{ opacity: 0, width: 0, padding: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
                  className="flex-1 h-full bg-background border border-border/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-w-3xl"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border/10 bg-surface-variant/30 shrink-0 min-w-[300px]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedModule.color}`}>
                        <IconRenderer name={selectedModule.icon} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-lg text-on-surface truncate">{selectedModule.name}</h3>
                        <p className="text-xs text-on-surface-variant truncate">Dokumentasi & Penjelasan Fitur</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedModule(null)}
                      className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors"
                    >
                      <LucideIcons.X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 w-full bg-surface-variant/20 relative min-w-[300px]">
                    {selectedModule.documentation ? (
                      <iframe 
                        srcDoc={selectedModule.documentation} 
                        className="w-full h-full border-0 absolute inset-0 bg-[#090d16]"
                        title={`Dokumentasi ${selectedModule.name}`}
                      />
                    ) : (
                      <iframe 
                        src="/docs/WMS_PRESENTASI_CLIENT.html" 
                        className="w-full h-full border-0 absolute inset-0 bg-[#090d16]"
                        title={`Dokumentasi ${selectedModule.name}`}
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
