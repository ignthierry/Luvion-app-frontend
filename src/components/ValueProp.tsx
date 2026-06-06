'use client';

import React from 'react';
import { Sparkles, Cloud, Lock, Server, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ValueProp() {
  return (
    <section id="features" className="py-24 px-6 bg-surface-container-low/30 relative border-t border-b border-border/15">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Key Advantages</h2>
          <p className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
            Business Digitalization Without Technical Barriers
          </p>
        </div>

        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center gap-16 min-h-[500px]">
          <div className="flex-1 flex flex-col justify-center space-y-6 text-left">
            <span className="text-xs font-bold text-on-surface-variant/60 tracking-widest uppercase">01 / 02</span>
            <h3 className="font-sans font-extrabold text-2xl md:text-4xl text-on-surface leading-tight">
              Describe Your System Idea, Luvion Builds It
            </h3>
            <p className="text-base text-on-surface-variant leading-relaxed font-medium">
              Simply describe your desired business model or workflow in everyday language. Luvion AI Engine will translate that description into ready-to-use digital operational modules, from cashiers to stock management dashboards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" /> Instant customization via prompt
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant">
                <BarChart2 className="h-4 w-4" /> Real-time visualization
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center rounded-[2rem] min-h-[400px] dotted-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface-bright/50 to-tertiary/5 -z-10" />
            <div className="w-[85%] glass-panel p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-bold text-on-surface-variant/60">kasir-toko.luvion.site</span>
              </div>
              <div className="space-y-4">
                <div className="h-14 glass-panel flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">K</div>
                    <span className="text-xs font-bold">Active Digital Cashier</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded">ONLINE</span>
                </div>
                <div className="h-14 glass-panel flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-tertiary/20 flex items-center justify-center text-tertiary text-xs font-bold">M</div>
                    <span className="text-xs font-bold">Courier Tracking Module</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded">SYNCING</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16 min-h-[500px]">
          <div className="flex-1 flex flex-col justify-center space-y-6 text-left">
            <span className="text-xs font-bold text-on-surface-variant/60 tracking-widest uppercase">02 / 02</span>
            <h3 className="font-sans font-extrabold text-2xl md:text-4xl text-on-surface leading-tight">
              Automated & Secure Backend Infrastructure
            </h3>
            <p className="text-base text-on-surface-variant leading-relaxed font-medium">
              You don't need to think about hosting, server setup, database migration, or SSL installation. Luvion writes server code, performs edge runtime CDN propagation, and encrypts all your transactions automatically in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Lock className="h-4 w-4" /> Active SSL & Encryption
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#326578]">
                <Server className="h-4 w-4" /> Edge Database Migration
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center rounded-[2rem] min-h-[400px] dotted-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-surface-bright/50 to-primary/5 -z-10" />
            <div className="w-[85%] glass-panel p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border/10 pb-4">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  <span className="text-xs font-extrabold">Deployment Status</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">v1.2.0-stable</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Edge Server Propagation</span>
                  <span className="font-mono">99.9%</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-primary to-primary-container rounded-full" />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 text-xs font-semibold text-on-surface-variant/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>SSL Certification active (HTTPS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Database migration completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>CDN propagation in progress...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
