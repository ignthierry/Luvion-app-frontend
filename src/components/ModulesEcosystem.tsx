'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, Package, MapPin, Activity, ArrowRight } from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGrad: string;
  demoType: string;
  demoTitle: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Wallet,
  Package,
  MapPin,
  Activity,
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

  const renderDemoContent = (type: string) => {
    switch (type) {
      case 'chart':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Streaming Dashboard</span>
              <span className="text-emerald-500 font-mono">+12.5%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="h-16 bg-blue-500/10 rounded flex flex-col justify-end p-2 border border-blue-500/10">
                <span className="text-[10px] font-bold text-on-surface-variant/70">Profit</span>
                <span className="text-sm font-extrabold text-blue-600">$4.2K</span>
              </div>
              <div className="h-16 bg-purple-500/10 rounded flex flex-col justify-end p-2 border border-purple-500/10">
                <span className="text-[10px] font-bold text-on-surface-variant/70">Sales</span>
                <span className="text-sm font-extrabold text-purple-600">$8.9K</span>
              </div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold border-b border-border/10 pb-2 mb-2">
              <span>Order Summary</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600">PRE-ORDER</span>
            </div>
            <div className="space-y-2 text-[10px] font-bold text-left">
              <div className="flex justify-between items-center opacity-85">
                <span>#1002 - Uniqlo Shirt</span>
                <span className="text-emerald-600 font-mono">Paid</span>
              </div>
              <div className="flex justify-between items-center opacity-85">
                <span>#1003 - Nike Shoes</span>
                <span className="text-amber-600 font-mono">Shipped</span>
              </div>
            </div>
          </div>
        );
      case 'travel':
        return (
          <div className="flex-1 flex flex-col justify-between p-4 glass-panel rounded-2xl shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span>Route Optimization</span>
              <span className="text-[10px] font-semibold text-rose-500 font-mono">3 stops</span>
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
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Active Users</div>
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Payments</div>
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Schedules</div>
              <div className="aspect-video bg-[#FFD166]/10 rounded flex items-center justify-center text-[10px] font-bold border border-[#FFD166]/20">Broadcast</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="modules" className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 dotted-grid opacity-30" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-xl text-left">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Module Ecosystem</h2>
          <p className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
            Seamless Integration for All Business Needs
          </p>
        </div>
        <p className="text-on-surface-variant font-medium text-base max-w-sm text-left">
          Ready-to-use modules that automatically connect into your business digital system ecosystem.
        </p>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-20">
          <div className="flex items-center gap-2 text-on-surface-variant/60">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-sm font-semibold">Loading module ecosystem...</span>
          </div>
        </div>
      ) : error ? (
        <div className="w-full flex justify-center py-20">
          <span className="text-sm text-error font-semibold">Failed to load modules. Please try again.</span>
        </div>
      ) : (
        <div className="w-full flex gap-8 overflow-x-auto px-6 md:px-12 pb-12 snap-x snap-mandatory hide-scrollbar justify-start lg:justify-center relative z-10">
          {modules?.map((mod) => {
            const IconComponent = iconMap[mod.icon] || Wallet;
            return (
              <div
                key={mod.id}
                className="snap-center shrink-0 w-[320px] md:w-[350px] min-h-[420px] glass-panel rounded-[2rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden"
              >
                <div className={`absolute inset-0 opacity-30 ${mod.bgGrad} -z-10`} />
                {/* Header */}
                <div className="text-left flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${mod.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-sans font-extrabold text-xl text-on-surface">{mod.name}</h3>
                    <p className="text-xs text-on-surface-variant font-semibold mt-2 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                {/* Simulated workspace preview */}
                <div className={`w-full aspect-[4/3] rounded-2xl overflow-hidden p-4 ${mod.bgGrad} flex flex-col justify-end relative border border-border/10 mt-6`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent -z-10" />
                  {renderDemoContent(mod.demoType)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
