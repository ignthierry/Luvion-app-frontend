import React from 'react';
import { Sparkles, Cloud, Lock, Server, BarChart2, Layers, Cpu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ValueProp() {
  const { t } = useLanguage();
  return (
    <section id="features" className="py-24 px-6 bg-surface-container-low/30 relative border-t border-b border-border/15">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{t('valueProp.headerTitle')}</h2>
          <p className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
            {t('valueProp.headerSubtitle')}
          </p>
        </motion.div>

        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center gap-16 min-h-[500px]">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col justify-center space-y-6 text-left"
          >
            <span className="text-xs font-bold text-on-surface-variant/60 tracking-widest uppercase">01 / 02</span>
            <h3 className="font-sans font-extrabold text-2xl md:text-4xl text-on-surface leading-tight">
              {t('valueProp.f1Title')}
            </h3>
            <p className="text-base text-on-surface-variant leading-relaxed font-medium">
              {t('valueProp.f1Desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" /> {t('valueProp.f1Point1')}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant">
                <BarChart2 className="h-4 w-4" /> {t('valueProp.f1Point2')}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full relative overflow-hidden flex items-center justify-center rounded-[2rem] min-h-[420px] dotted-grid py-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface-bright/50 to-tertiary/5 -z-10" />
            
            <div className="w-[90%] md:w-[88%] glass-panel p-5 md:p-6 space-y-4 shadow-2xl border border-white/20 dark:border-white/10 backdrop-blur-xl rounded-2xl bg-surface/80">
              {/* Header Window Bar */}
              <div className="flex items-center justify-between border-b border-border/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  <span className="ml-2 text-[11px] font-mono font-medium text-on-surface-variant/70">app.luvion-workspace.com</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI Engine Active
                </div>
              </div>

              {/* Simulated User Input */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-on-surface truncate">"{t('valueProp.f1SimPrompt')}"</span>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0 ml-2">PROMPTED</span>
              </div>

              {/* Generated General Enterprise Modules */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-border/20 bg-surface-bright/40 flex items-center justify-between transition-all hover:border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">{t('valueProp.f1SimMod1Title')}</div>
                      <div className="text-[10px] text-on-surface-variant/70">{t('valueProp.f1SimMod1Sub')}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{t('valueProp.f1SimMod1Status')}</span>
                </div>

                <div className="p-3 rounded-xl border border-border/20 bg-surface-bright/40 flex items-center justify-between transition-all hover:border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center font-bold shrink-0">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">{t('valueProp.f1SimMod2Title')}</div>
                      <div className="text-[10px] text-on-surface-variant/70">{t('valueProp.f1SimMod2Sub')}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{t('valueProp.f1SimMod2Status')}</span>
                </div>

                <div className="p-3 rounded-xl border border-border/20 bg-surface-bright/40 flex items-center justify-between transition-all hover:border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">{t('valueProp.f1SimMod3Title')}</div>
                      <div className="text-[10px] text-on-surface-variant/70">{t('valueProp.f1SimMod3Sub')}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">{t('valueProp.f1SimMod3Status')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16 min-h-[500px]">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col justify-center space-y-6 text-left"
          >
            <span className="text-xs font-bold text-on-surface-variant/60 tracking-widest uppercase">02 / 02</span>
            <h3 className="font-sans font-extrabold text-2xl md:text-4xl text-on-surface leading-tight">
              {t('valueProp.f2Title')}
            </h3>
            <p className="text-base text-on-surface-variant leading-relaxed font-medium">
              {t('valueProp.f2Desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Server className="h-4 w-4" /> {t('valueProp.f2Point1')}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant">
                <Lock className="h-4 w-4" /> {t('valueProp.f2Point2')}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full relative overflow-hidden flex items-center justify-center rounded-[2rem] min-h-[400px] dotted-grid"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-surface-bright/50 to-primary/5 -z-10" />
            <div className="w-[85%] glass-panel p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border/10 pb-4">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  <span className="text-xs font-extrabold">Status Deployment</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">v1.2.0-stable</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Propagasi Server Edge</span>
                  <span className="font-mono">99.9%</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-primary to-primary-container rounded-full" />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 text-xs font-semibold text-on-surface-variant/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Sertifikat SSL aktif (HTTPS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Migrasi database selesai</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>Propagasi CDN sedang berlangsung...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
