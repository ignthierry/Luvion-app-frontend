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

// Resolver to intelligently match module to its rich visual animation demo
function resolveDemoType(mod: ModuleItem): string {
  const type = (mod.demo_type || '').toLowerCase();
  const id = (mod.id || '').toLowerCase();
  const name = (mod.name || '').toLowerCase();

  if (
    type === 'shoecare' || 
    type === 'shoepro' || 
    type === 'laundry' || 
    id.includes('shoe') || 
    id.includes('boom') || 
    name.includes('shoe') || 
    name.includes('sepatu') || 
    name.includes('cuci')
  ) {
    return 'shoecare';
  }

  if (
    type === 'storefront' || 
    type === 'ecommerce' || 
    type === 'e-commerce' || 
    id.includes('commerce') || 
    id.includes('store') || 
    name.includes('store') || 
    name.includes('toko') || 
    name.includes('omega')
  ) {
    return 'storefront';
  }

  if (
    type === 'wms' || 
    type === 'warehouse' || 
    type === 'inventaris' || 
    id.includes('wms') || 
    name.includes('warehouse') || 
    name.includes('gudang')
  ) {
    return 'wms';
  }

  if (
    type === 'chart' || 
    type === 'finance' || 
    type === 'accurix' || 
    type === 'accounting' || 
    id.includes('accurix') || 
    id.includes('finance') || 
    name.includes('accurix') || 
    name.includes('akuntansi') || 
    name.includes('keuangan')
  ) {
    return 'chart';
  }

  if (type === 'travel' || id.includes('travel') || name.includes('travel') || name.includes('rute')) {
    return 'travel';
  }

  if (type === 'gym' || id.includes('gym') || name.includes('gym') || name.includes('fitness')) {
    return 'gym';
  }

  if (type === 'list' || type === 'pos' || id.includes('pos') || id.includes('jastip')) {
    return 'list';
  }

  return type || 'grid';
}

/* =========================================================================
   1. ACCURIX / FINANCE & ACCOUNTING DEMO
   ========================================================================= */
const AccurixDemo = () => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const barData = [
    { label: 'Jan', val: 40, amt: 'Rp 18.5M' },
    { label: 'Feb', val: 65, amt: 'Rp 29.2M' },
    { label: 'Mar', val: 55, amt: 'Rp 24.8M' },
    { label: 'Apr', val: 85, amt: 'Rp 38.6M' },
    { label: 'Mei', val: 100, amt: 'Rp 48.9M' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Mini Window Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-blue-500/15">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-on-surface ml-1 tracking-tight">Accurix Ledger</span>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-full shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">LIVE SYNC</span>
        </div>
      </div>

      {/* Main KPI Stat */}
      <div className="flex items-end justify-between my-2">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold block">Arus Kas Bersih</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base md:text-lg font-black tracking-tight text-blue-600 dark:text-blue-400 font-mono">Rp 48.950.000</span>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 font-mono">
              +18.4% ↗
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-on-surface-variant uppercase font-semibold">Jurnal Otomatis</span>
          <span className="text-[11px] font-extrabold text-sky-600 dark:text-sky-400 block font-mono">99.8% Match</span>
        </div>
      </div>

      {/* Animated Glowing Multi-Bar Chart */}
      <div className="bg-white/80 dark:bg-zinc-800/80 rounded-xl p-2 border border-blue-500/15 shadow-xs relative overflow-hidden">
        {/* Subtle grid line */}
        <div className="absolute inset-x-2 top-1/2 border-b border-dashed border-blue-500/10 pointer-events-none" />
        
        <div className="flex items-end justify-between gap-2 h-16 pt-3 px-1">
          {barData.map((item, idx) => {
            const isHovered = activeBar === idx;
            return (
              <div 
                key={item.label}
                onMouseEnter={() => setActiveBar(idx)}
                onMouseLeave={() => setActiveBar(null)}
                className="flex-1 flex flex-col items-center gap-1 group/bar cursor-pointer relative"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-6 bg-blue-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-20 font-mono"
                  >
                    {item.amt}
                  </motion.div>
                )}
                {/* Bar */}
                <div className="w-full bg-blue-500/10 dark:bg-blue-950/40 rounded-t-md h-12 flex items-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.val}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      idx === barData.length - 1 
                        ? 'bg-gradient-to-t from-blue-600 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]' 
                        : 'bg-gradient-to-t from-blue-400/70 to-sky-400 group-hover/bar:from-blue-600 group-hover/bar:to-sky-400'
                    }`}
                  />
                </div>
                <span className="text-[8px] font-bold text-on-surface-variant group-hover/bar:text-blue-600 dark:group-hover/bar:text-blue-400 font-mono">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Stream Transaction Pill */}
      <motion.div 
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-2 flex items-center justify-between bg-white/90 dark:bg-zinc-800/90 border border-blue-500/20 px-2 py-1.5 rounded-lg text-[9px] shadow-xs"
      >
        <div className="flex items-center gap-1.5 truncate">
          <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">
            +
          </div>
          <span className="text-on-surface font-medium truncate">Inv #8841 • Settlement Client</span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-mono shrink-0 ml-1">+Rp 4.25M</span>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   2. SHOE CARE / SHOEPRO MANAGEMENT DEMO
   ========================================================================= */
const ShoeCareDemo = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Mini Window Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-orange-500/15">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-on-surface ml-1 tracking-tight">ShoePro POS Queue</span>
        </div>
        <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/25 px-1.5 py-0.5 rounded-full shadow-xs">
          <LucideIcons.Sparkles className="w-2.5 h-2.5 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 font-mono">12 ANTRIAN</span>
        </div>
      </div>

      {/* Active Service Order Card */}
      <div className="bg-white/85 dark:bg-zinc-800/85 border border-orange-500/20 rounded-xl p-2.5 my-1.5 relative overflow-hidden shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-mono">
              #SP-8821
            </span>
            <span className="text-[10px] font-bold text-on-surface truncate max-w-[120px]">AJ1 High Heritage</span>
          </div>
          <span className="text-[8px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
            ⚡ Deep Clean
          </span>
        </div>

        {/* 3-Step Live Progress Visualizer */}
        <div className="grid grid-cols-3 gap-1 relative my-2">
          {/* Step 1: Drop-off */}
          <div className="flex flex-col items-center text-center">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
              ✓
            </div>
            <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Drop-off</span>
            <span className="text-[7px] text-on-surface-variant font-mono">QC Passed</span>
          </div>

          {/* Step 2: Deep Cleaning (Active Pulsing) */}
          <div className="flex flex-col items-center text-center relative">
            <motion.div 
              animate={{ scale: [1, 1.12, 1], boxShadow: ['0 0 0px #f97316', '0 0 10px rgba(249,115,22,0.4)', '0 0 0px #f97316'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-[9px] font-bold shadow-sm"
            >
              <LucideIcons.Sparkles className="w-3 h-3 text-white animate-pulse" />
            </motion.div>
            <span className="text-[8px] font-black text-orange-600 dark:text-orange-400 mt-1">Dicuci</span>
            <span className="text-[7px] text-orange-500/90 font-mono font-medium">Unyellowing</span>
          </div>

          {/* Step 3: Ready */}
          <div className="flex flex-col items-center text-center opacity-65">
            <div className="w-5 h-5 rounded-full bg-surface-variant border border-border/40 text-on-surface-variant flex items-center justify-center text-[8px] font-bold">
              3
            </div>
            <span className="text-[8px] font-semibold text-on-surface-variant mt-1">Siap Ambil</span>
            <span className="text-[7px] text-on-surface-variant/80 font-mono">Est: 17.00</span>
          </div>
        </div>

        {/* Progress Bar Animation */}
        <div className="w-full bg-orange-500/10 dark:bg-orange-950/30 h-1.5 rounded-full overflow-hidden mt-1">
          <motion.div
            initial={{ width: '30%' }}
            animate={{ width: ['30%', '65%', '65%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-amber-400 rounded-full"
          />
        </div>
      </div>

      {/* Automated WhatsApp Trigger Pill */}
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/25 px-2 py-1.5 rounded-lg text-[9px] shadow-xs">
        <div className="flex items-center gap-1.5 truncate">
          <LucideIcons.MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 animate-bounce" />
          <span className="text-emerald-800 dark:text-emerald-300 font-medium truncate">WA Auto-Notif: "Sepatu Anda Sedang Dicuci"</span>
        </div>
        <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-mono font-bold shrink-0">TERKIRIM</span>
      </div>
    </div>
  );
};

/* =========================================================================
   3. STOREFRONT / MULTI-NICHE E-COMMERCE DEMO
   ========================================================================= */
const StorefrontDemo = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Mini Window Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-on-surface ml-1 tracking-tight">Luvion Storefront</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded-full shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 font-mono">38 ONLINE</span>
        </div>
      </div>

      {/* Featured Live Product Showcase */}
      <div className="bg-white/85 dark:bg-zinc-800/85 border border-amber-500/20 rounded-xl p-2.5 my-1.5 flex items-center gap-2.5 relative overflow-hidden shadow-xs">
        {/* Product Visual Thumbnail */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/30 flex items-center justify-center relative shrink-0">
          <LucideIcons.ShoppingBag className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <span className="absolute -top-1 -right-1 bg-rose-500 text-[7px] font-black text-white px-1 py-0.2 rounded-full shadow-xs">
            HOT
          </span>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-on-surface truncate">Urban Sneaker X-Pro</span>
            <span className="text-[8px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1 rounded font-mono">-30%</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">Rp 899.000</span>
            <span className="text-[8px] text-on-surface-variant/70 line-through font-mono">Rp 1.299K</span>
          </div>
          {/* Stock Meter */}
          <div className="flex items-center justify-between text-[8px] text-on-surface-variant mt-1">
            <span>Sisa Stok: <strong className="text-amber-600 dark:text-amber-400">4 Unit</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Flash Sale</span>
          </div>
        </div>
      </div>

      {/* Omnichannel Channel Pills */}
      <div className="grid grid-cols-3 gap-1 text-center">
        <div className="bg-white/80 dark:bg-zinc-800/80 border border-border/30 rounded-lg py-1 px-0.5 shadow-xs">
          <span className="text-[7px] text-on-surface-variant block font-medium">KASIR POS</span>
          <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 font-mono">Aktif</span>
        </div>
        <div className="bg-white/80 dark:bg-zinc-800/80 border border-border/30 rounded-lg py-1 px-0.5 shadow-xs">
          <span className="text-[7px] text-on-surface-variant block font-medium">WEB STORE</span>
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 font-mono">Auto-Sync</span>
        </div>
        <div className="bg-white/80 dark:bg-zinc-800/80 border border-border/30 rounded-lg py-1 px-0.5 shadow-xs">
          <span className="text-[7px] text-on-surface-variant block font-medium">WA ORDER</span>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">Instant</span>
        </div>
      </div>

      {/* Live Activity Feed Toast */}
      <motion.div 
        animate={{ y: [3, 0, 3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-1.5 flex items-center justify-between bg-white/90 dark:bg-zinc-800/90 border border-amber-500/25 px-2 py-1 rounded-lg text-[9px] shadow-xs"
      >
        <div className="flex items-center gap-1.5 truncate">
          <LucideIcons.Zap className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="text-on-surface font-medium truncate">Budi (Surabaya) baru saja checkout!</span>
        </div>
        <span className="text-[8px] text-amber-600 dark:text-amber-400 font-mono font-bold shrink-0 ml-1">2 dtk lalu</span>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   4. WAREHOUSE MANAGEMENT SYSTEM (WMS) DEMO
   ========================================================================= */
const WMSDemo = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none relative overflow-hidden">
      {/* Subtle Laser Scan Effect */}
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-60 pointer-events-none z-10"
      />

      {/* Mini Window Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/15">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-on-surface ml-1 tracking-tight">WMS Everwin • Hub-01</span>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-full shadow-xs">
          <LucideIcons.Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 font-mono">RFID SYNC</span>
        </div>
      </div>

      {/* Storage Capacity Gauge */}
      <div className="bg-white/85 dark:bg-zinc-800/85 border border-emerald-500/20 rounded-xl p-2 my-1 shadow-xs">
        <div className="flex justify-between items-center text-[9px] mb-1">
          <span className="text-on-surface-variant font-semibold">Kapasitas Gudang</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">84% (1.420 Pallet)</span>
        </div>
        <div className="w-full bg-emerald-500/10 dark:bg-emerald-950/30 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '84%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Live Rack & Inventory Stream */}
      <div className="space-y-1.5 my-0.5">
        {/* Row 1: Rak A-12 */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-zinc-800/80 border border-emerald-500/20 px-2 py-1 rounded-lg text-[9px] shadow-xs">
          <div className="flex items-center gap-1.5">
            <LucideIcons.Box className="w-3 h-3 text-emerald-500" />
            <span className="font-bold text-on-surface font-mono">Rak A-12</span>
            <span className="text-[8px] text-on-surface-variant">Fast Moving</span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">140 Unit (Aman)</span>
        </div>

        {/* Row 2: Rak B-04 Low Stock Alert */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-zinc-800/80 border border-rose-500/30 px-2 py-1 rounded-lg text-[9px] shadow-xs">
          <div className="flex items-center gap-1.5">
            <LucideIcons.AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
            <span className="font-bold text-on-surface font-mono">Rak B-04</span>
            <span className="text-[8px] text-rose-600 dark:text-rose-300">Elektronik</span>
          </div>
          <span className="text-rose-600 dark:text-rose-400 font-mono font-extrabold bg-rose-500/10 px-1 rounded">12 Unit (Low!)</span>
        </div>

        {/* Row 3: Outbound Dispatch */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-zinc-800/80 border border-sky-500/20 px-2 py-1 rounded-lg text-[9px] shadow-xs">
          <div className="flex items-center gap-1.5">
            <LucideIcons.Truck className="w-3 h-3 text-sky-500" />
            <span className="font-bold text-on-surface font-mono">Dock 03</span>
            <span className="text-[8px] text-on-surface-variant">Surat Jalan</span>
          </div>
          <span className="text-sky-600 dark:text-sky-400 font-mono font-bold">Dispatching...</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. TRAVEL & ROUTE OPTIMIZER DEMO
   ========================================================================= */
const TravelDemo = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Mini Window Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-rose-500/15">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-on-surface ml-1 tracking-tight">Route & Fleet AI</span>
        </div>
        <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/25 px-1.5 py-0.5 rounded-full shadow-xs">
          <LucideIcons.Navigation className="w-2.5 h-2.5 text-rose-500" />
          <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 font-mono">3 STOPS</span>
        </div>
      </div>

      {/* Animated Route Map Visualizer */}
      <div className="bg-white/85 dark:bg-zinc-800/85 border border-rose-500/20 rounded-xl p-3 my-2 relative shadow-xs">
        <div className="flex items-center justify-between relative z-10">
          {/* Node 1 */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-300 flex items-center justify-center text-[9px] font-extrabold shadow-xs">
              JKT
            </div>
            <span className="text-[7px] text-on-surface-variant font-mono mt-1">Start 08.00</span>
          </div>

          {/* Dotted Line with Moving Vehicle */}
          <div className="flex-1 h-0.5 mx-1 border-t-2 border-dashed border-rose-500/40 relative">
            <motion.div 
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[7px] shadow-sm"
            >
              🚚
            </motion.div>
          </div>

          {/* Node 2 */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-rose-500/25 border border-rose-400 text-rose-700 dark:text-white flex items-center justify-center text-[9px] font-extrabold shadow-xs">
              BDG
            </div>
            <span className="text-[7px] text-rose-600 dark:text-rose-300 font-mono mt-1 font-bold">Transit</span>
          </div>

          {/* Dotted Line */}
          <div className="flex-1 h-0.5 mx-1 border-t-2 border-dashed border-rose-500/40" />

          {/* Node 3 */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-surface-variant border border-border/40 text-on-surface-variant flex items-center justify-center text-[9px] font-extrabold">
              SUB
            </div>
            <span className="text-[7px] text-on-surface-variant/80 font-mono mt-1">Destinasi</span>
          </div>
        </div>
      </div>

      {/* Route Optimization Metrics */}
      <div className="grid grid-cols-2 gap-2 text-[9px]">
        <div className="bg-white/80 dark:bg-zinc-800/80 border border-border/30 rounded-lg p-1.5 flex items-center justify-between shadow-xs">
          <span className="text-on-surface-variant">Efisiensi Rute:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+28% Cepat</span>
        </div>
        <div className="bg-white/80 dark:bg-zinc-800/80 border border-border/30 rounded-lg p-1.5 flex items-center justify-between shadow-xs">
          <span className="text-on-surface-variant">Hemat Biaya:</span>
          <span className="text-sky-600 dark:text-sky-400 font-mono font-bold">Rp 850.000</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. POS & ORDER MANAGEMENT / LIST DEMO
   ========================================================================= */
const POSOrderDemo = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Mini Window Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-purple-500/15">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-on-surface ml-1 tracking-tight">Live POS Stream</span>
        </div>
        <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/25 px-1.5 py-0.5 rounded-full shadow-xs">
          <LucideIcons.Printer className="w-2.5 h-2.5 text-purple-500" />
          <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 font-mono">AUTO RECEIPT</span>
        </div>
      </div>

      {/* Staggered Order Feed */}
      <div className="space-y-1.5 my-1.5">
        <div className="flex items-center justify-between bg-white/85 dark:bg-zinc-800/85 border border-emerald-500/20 p-2 rounded-xl text-[9px] shadow-xs">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-on-surface font-mono">#1042</span>
              <span className="text-on-surface-variant font-semibold truncate max-w-[110px]">Kemeja Casual Linen</span>
            </div>
            <span className="text-[8px] text-on-surface-variant/80 font-mono">QRIS • Meja 04</span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Lunas Rp 245K
          </span>
        </div>

        <div className="flex items-center justify-between bg-white/85 dark:bg-zinc-800/85 border border-amber-500/20 p-2 rounded-xl text-[9px] shadow-xs">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-on-surface font-mono">#1043</span>
              <span className="text-on-surface-variant font-semibold truncate max-w-[110px]">Sepatu Sneakers Sport</span>
            </div>
            <span className="text-[8px] text-on-surface-variant/80 font-mono">Pre-Order • Jastip</span>
          </div>
          <span className="text-amber-600 dark:text-amber-400 font-mono font-extrabold bg-amber-500/10 px-1.5 py-0.5 rounded">
            Dikemas
          </span>
        </div>
      </div>

      {/* Daily Total Summary */}
      <div className="flex items-center justify-between bg-white/90 dark:bg-zinc-800/90 border border-purple-500/25 px-2 py-1.5 rounded-lg text-[9px] shadow-xs">
        <span className="text-on-surface-variant">Omset Kasir Hari Ini:</span>
        <span className="text-purple-600 dark:text-purple-400 font-mono font-black text-[10px]">Rp 8.420.000</span>
      </div>
    </div>
  );
};

/* =========================================================================
   7. GYM PRO & MEMBERSHIP ACCESS DEMO
   ========================================================================= */
const GymDemo = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Mini Window Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-green-500/15">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-on-surface ml-1 tracking-tight">Gym Pro Access</span>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/25 px-1.5 py-0.5 rounded-full shadow-xs">
          <LucideIcons.Scan className="w-2.5 h-2.5 text-green-500" />
          <span className="text-[9px] font-bold text-green-600 dark:text-green-400 font-mono">TAP IN READY</span>
        </div>
      </div>

      {/* Member NFC Card with Radiating Glow */}
      <div className="bg-white/85 dark:bg-zinc-800/85 border border-green-500/20 rounded-xl p-2.5 my-1.5 relative overflow-hidden flex items-center gap-3 shadow-xs">
        <motion.div 
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-400 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-green-500/20 shrink-0"
        >
          <LucideIcons.UserCheck className="w-5 h-5" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-on-surface truncate">Alex Pratama</span>
            <span className="text-[8px] font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-1 rounded">VIP</span>
          </div>
          <span className="text-[8px] text-on-surface-variant block font-mono">Platinum Member • Active</span>
          <span className="text-[7px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block font-semibold">NFC Tap: Pintu Turnstile Terbuka</span>
        </div>
      </div>

      {/* Gym Live Capacity */}
      <div className="grid grid-cols-2 gap-1.5 text-[9px]">
        <div className="bg-white/80 dark:bg-zinc-800/80 border border-border/30 rounded-lg p-1.5 shadow-xs">
          <span className="text-[8px] text-on-surface-variant block font-medium">Kapasitas Gym</span>
          <span className="text-green-600 dark:text-green-400 font-mono font-bold">64/100 Orang</span>
        </div>
        <div className="bg-white/80 dark:bg-zinc-800/80 border border-border/30 rounded-lg p-1.5 shadow-xs">
          <span className="text-[8px] text-on-surface-variant block font-medium">Sesi HIIT</span>
          <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">18.30 WIB</span>
        </div>
      </div>
    </div>
  );
};

export default function ModulesEcosystem() {
  const { data: modules, error, isLoading } = useQuery<ModuleItem[]>({
    queryKey: ['modules'],
    queryFn: fetchModules,
  });

  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'doc' | 'demo'>('doc');

  const renderDemoContent = (mod: ModuleItem) => {
    const resolved = resolveDemoType(mod);
    switch (resolved) {
      case 'chart':
        return <AccurixDemo />;
      case 'shoecare':
        return <ShoeCareDemo />;
      case 'storefront':
        return <StorefrontDemo />;
      case 'wms':
        return <WMSDemo />;
      case 'travel':
        return <TravelDemo />;
      case 'list':
        return <POSOrderDemo />;
      case 'gym':
        return <GymDemo />;
      default:
        return <StorefrontDemo />;
    }
  };

  const renderCardContent = (mod: ModuleItem, isOverlay = false) => (
    <>
      <div className={`absolute inset-0 opacity-30 ${mod.bg_grad} -z-10`} />
      {/* Header */}
      <div className="text-left flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${mod.color} transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
          <IconRenderer name={mod.icon} className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-sans font-extrabold text-xl text-on-surface tracking-tight group-hover:text-primary transition-colors">{mod.name}</h3>
          <p className="text-xs text-on-surface-variant font-medium mt-2 leading-relaxed line-clamp-3">
            {mod.description}
          </p>
        </div>
      </div>

      {/* Simulated high-tech interactive workspace viewport */}
      <div className={`w-full aspect-[4/3] rounded-2xl overflow-hidden p-3.5 ${mod.bg_grad} bg-white/70 dark:bg-zinc-900/70 text-on-surface flex flex-col justify-between relative border border-border/40 shadow-xs hover:shadow-md mt-6 backdrop-blur-xl group-hover:border-primary/40 transition-all duration-300`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 dark:from-white/[0.03] to-transparent pointer-events-none" />
        {renderDemoContent(mod)}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-2">
        {!isOverlay && (
          <button
            onClick={() => {
              setSelectedModule(mod);
              setMobileTab('doc');
              setIsFullscreen(false);
            }}
            className="group w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-primary/20"
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

      {/* Sliding Panel untuk Dokumentasi & Presentasi Fitur */}
      <AnimatePresence>
        {selectedModule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
              onClick={() => {
                setSelectedModule(null);
                setIsFullscreen(false);
              }}
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
              <div className={`flex flex-col lg:flex-row w-full ${isFullscreen ? 'max-w-7xl h-[95vh]' : 'max-w-6xl h-[90vh] md:h-[84vh]'} gap-4 lg:gap-6 items-center justify-center pointer-events-auto transition-all duration-300`}>
                
                {/* Segmented Mobile Tab Switcher */}
                <div className="flex lg:hidden w-full bg-surface-variant/40 p-1 rounded-xl border border-border/30 gap-1 shrink-0">
                  <button
                    onClick={() => setMobileTab('doc')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileTab === 'doc' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-on-surface-variant hover:text-foreground'
                    }`}
                  >
                    <LucideIcons.BookOpen className="w-3.5 h-3.5" />
                    Penjelasan Fitur
                  </button>
                  <button
                    onClick={() => setMobileTab('demo')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileTab === 'demo' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-on-surface-variant hover:text-foreground'
                    }`}
                  >
                    <LucideIcons.Eye className="w-3.5 h-3.5" />
                    Demo Widget
                  </button>
                </div>

                {/* Cloned Interactive Card (Left Side) */}
                {(!isFullscreen || mobileTab === 'demo') && (
                  <motion.div
                    layoutId={`module-card-${selectedModule.id}`}
                    className={`w-full lg:w-[340px] xl:w-[360px] min-h-[420px] bg-background glass-panel rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden shrink-0 ${
                      mobileTab === 'demo' ? 'flex' : 'hidden lg:flex'
                    }`}
                  >
                    {renderCardContent(selectedModule, true)}
                  </motion.div>
                )}

                {/* Window Dokumentasi Eksekutif (Right Side) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                  className={`flex-1 w-full h-full bg-background border border-border/40 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden ${
                    mobileTab === 'doc' ? 'flex' : 'hidden lg:flex'
                  }`}
                >
                  {/* Presentation Window Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/20 bg-surface-variant/20 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedModule.color} shrink-0 shadow-xs`}>
                        <IconRenderer name={selectedModule.icon} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-sans font-extrabold text-base text-on-surface truncate">{selectedModule.name}</h3>
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                            Enterprise Module
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant truncate">Executive Documentation & Solution Architecture</p>
                      </div>
                    </div>

                    {/* Window Control Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedModule.demo_link && (
                        <a
                          href={selectedModule.demo_link?.startsWith('http') ? selectedModule.demo_link : `https://${selectedModule.demo_link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs shadow-primary/20"
                        >
                          <LucideIcons.ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}

                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="hidden lg:flex p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant hover:text-foreground transition-colors"
                        title={isFullscreen ? "Perkecil Tampilan" : "Tampilan Layar Penuh"}
                      >
                        {isFullscreen ? <LucideIcons.Minimize2 className="w-4 h-4" /> : <LucideIcons.Maximize2 className="w-4 h-4" />}
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedModule(null);
                          setIsFullscreen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-rose-500/10 text-on-surface-variant hover:text-rose-500 transition-colors"
                        title="Tutup Modal"
                      >
                        <LucideIcons.X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Presentation Frame Body */}
                  <div className="flex-1 w-full bg-slate-950 relative overflow-hidden">
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
