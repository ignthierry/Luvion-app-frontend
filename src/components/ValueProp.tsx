'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Cloud, Lock, Server, BarChart2, Layers, Cpu, Activity, CheckCircle2, Zap } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

// 3D Tilt & Parallax Window Card Component with Glass Glare Reflection
function TiltWindowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth Springs for Mouse Tilt
  const mouseXSpring = useSpring(x, { stiffness: 60, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 60, damping: 20 });

  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);
  
  // High-inertia spring for liquid glass light reflection
  const glareX = useSpring(rawGlareX, { stiffness: 45, damping: 22 });
  const glareY = useSpring(rawGlareY, { stiffness: 45, damping: 22 });

  const [glarePosStyle, setGlarePosStyle] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubX = glareX.on("change", (latestX) => {
      setGlarePosStyle((prev) => ({ ...prev, x: Math.round(latestX) }));
    });
    const unsubY = glareY.on("change", (latestY) => {
      setGlarePosStyle((prev) => ({ ...prev, y: Math.round(latestY) }));
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [glareX, glareY]);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    rawGlareX.set((mouseX / width) * 100);
    rawGlareY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rawGlareX.set(50);
    rawGlareY.set(50);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`relative cursor-pointer transition-shadow duration-500 ${className}`}
    >
      {/* Dynamic Smooth Gliding Cursor Spotlight Glass Reflection */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0.15,
          background: `radial-gradient(550px circle at ${glarePosStyle.x}% ${glarePosStyle.y}%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.05) 45%, transparent 80%)`,
        }}
      />

      {/* Slow, Organic Glass Sheen Light Reflection Sweep */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-20">
        <motion.div 
          key={isHovered ? 'hovered' : 'unhovered'}
          initial={{ x: "-150%", opacity: 0 }}
          animate={isHovered ? { x: ["-150%", "250%"], opacity: [0, 0.45, 0] } : {}}
          transition={{ duration: 2.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
          className="w-[70%] h-[350%] -top-[125%] -rotate-[30deg] bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent blur-[2px]"
        />
      </div>

      {children}
    </motion.div>
  );
}

export default function ValueProp() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Operational Simulation States for Window 1
  const promptList = [
    t('valueProp.f1SimPrompt') || "Integrasikan alur kerja operasional, stok & laporan keuangan",
    "Buat sistem Kasir POS dengan cetak struk & QRIS otomatis",
    "Hubungkan Dashboard Analytics AI & Laporan Keuangan Real-Time",
  ];

  const [promptIndex, setPromptIndex] = useState(0);
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [opState, setOpState] = useState<'PROMPTING' | 'EXECUTING' | 'LIVE'>('PROMPTING');
  const [txCount, setTxCount] = useState(1420);
  const [stockSynced, setStockSynced] = useState(98.4);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Typewriter effect logic
  useEffect(() => {
    const currentFullText = promptList[promptIndex];
    let charIndex = 0;
    setDisplayedPrompt('');
    setIsTyping(true);
    setOpState('PROMPTING');

    const typingInterval = setInterval(() => {
      if (charIndex < currentFullText.length) {
        setDisplayedPrompt(currentFullText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setOpState('EXECUTING');

        // After executing, set to LIVE and show toast
        const t1 = setTimeout(() => {
          setOpState('LIVE');
          setActiveToast(`⚡ Modul #${promptIndex + 1} Terkompilasi & Aktif`);
          
          const t2 = setTimeout(() => {
            setActiveToast(null);
          }, 2500);

          // Move to next prompt after delay
          const t3 = setTimeout(() => {
            setPromptIndex((prev) => (prev + 1) % promptList.length);
          }, 4000);

          return () => { clearTimeout(t2); clearTimeout(t3); };
        }, 1200);

        return () => clearTimeout(t1);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [promptIndex]);

  // Live real-time counter increment simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTxCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setStockSynced((prev) => Math.min(100, +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 px-6 bg-surface-container-low/30 relative border-t border-b border-border/15 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/10 via-tertiary/10 to-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

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
          
          {/* Moving Parallax Window on Right Side */}
          <motion.div 
            style={{ y: parallaxY1 }}
            className="flex-1 w-full relative overflow-visible flex items-center justify-center rounded-[2rem] min-h-[440px] dotted-grid py-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-bright/50 to-tertiary/10 rounded-[2rem] -z-10" />

            {/* Operational Toast Notification Floating */}
            {activeToast && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                exit={{ opacity: 0, y: -30 }}
                className="absolute -top-3 right-4 z-30 px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-lg flex items-center gap-2 border border-emerald-400"
              >
                <Zap className="h-3.5 w-3.5 animate-bounce" />
                <span>{activeToast}</span>
              </motion.div>
            )}
            
            <TiltWindowCard className="w-[92%] md:w-[90%]">
              <div className="glass-panel p-5 md:p-6 space-y-4 shadow-2xl border border-white/30 dark:border-white/10 backdrop-blur-xl rounded-2xl bg-surface/85 relative overflow-hidden group">
                
                {/* Active Laser Scanning Beam Animation */}
                <motion.div 
                  animate={{ y: ["-100%", "500%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none -z-0"
                />

                {/* Header Window Bar */}
                <div className="flex items-center justify-between border-b border-border/15 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/90 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-sm" />
                    <span className="ml-2 text-[11px] font-mono font-semibold text-on-surface-variant/80 flex items-center gap-1">
                      workspace.luvion.my.id
                      <span className="text-[9px] px-1.5 py-0.2 bg-primary/10 text-primary rounded font-mono font-bold">LIVE</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[10px] font-mono text-on-surface-variant/60">
                      ⚡ 12ms | CPU 3.4%
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shadow-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      AI Engine Active
                    </div>
                  </div>
                </div>

                {/* Simulated User Input with Typewriter & Live Status */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs relative overflow-hidden">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="font-mono font-medium text-on-surface truncate">
                      "{displayedPrompt}"
                      {isTyping && <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse" />}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md shrink-0 transition-all duration-300 ${
                    opState === 'PROMPTING' ? 'bg-primary/15 text-primary' :
                    opState === 'EXECUTING' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse' :
                    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {opState === 'PROMPTING' ? 'TYPING...' : opState === 'EXECUTING' ? 'COMPILING...' : 'PROMPTED & LIVE'}
                  </span>
                </div>

                {/* Generated General Enterprise Modules */}
                <div className="space-y-2.5">
                  {/* Module 1 */}
                  <motion.div 
                    whileHover={{ scale: 1.01, x: 3 }}
                    className="p-3 rounded-xl border border-border/20 bg-surface-bright/50 flex items-center justify-between transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 relative">
                        <Layers className="h-4 w-4" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                          {t('valueProp.f1SimMod1Title')}
                          <span className="text-[9px] font-mono text-on-surface-variant/70 bg-black/5 dark:bg-white/5 px-1.5 py-0.2 rounded">
                            {stockSynced}% synced
                          </span>
                        </div>
                        <div className="text-[10px] text-on-surface-variant/70">{t('valueProp.f1SimMod1Sub')}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {t('valueProp.f1SimMod1Status')}
                    </span>
                  </motion.div>

                  {/* Module 2 */}
                  <motion.div 
                    whileHover={{ scale: 1.01, x: 3 }}
                    className="p-3 rounded-xl border border-border/20 bg-surface-bright/50 flex items-center justify-between transition-all hover:border-tertiary/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center font-bold shrink-0 relative">
                        <Cpu className="h-4 w-4" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                          {t('valueProp.f1SimMod2Title')}
                          <span className="text-[9px] font-mono text-tertiary font-semibold">
                            {txCount.toLocaleString()} tx/sec
                          </span>
                        </div>
                        <div className="text-[10px] text-on-surface-variant/70">{t('valueProp.f1SimMod2Sub')}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                      <Activity className="h-3 w-3 animate-pulse text-emerald-500" />
                      {t('valueProp.f1SimMod2Status')}
                    </span>
                  </motion.div>

                  {/* Module 3 */}
                  <motion.div 
                    whileHover={{ scale: 1.01, x: 3 }}
                    className="p-3 rounded-xl border border-border/20 bg-surface-bright/50 flex items-center justify-between transition-all hover:border-blue-500/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-on-surface">{t('valueProp.f1SimMod3Title')}</div>
                        {/* Live Mini Sparkline SVG */}
                        <div className="flex items-center gap-2 mt-0.5">
                          <svg className="w-20 h-4 text-blue-500" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2">
                            <motion.path 
                              d="M0 15 Q 20 5, 40 12 T 80 4 T 100 10"
                              animate={{
                                d: [
                                  "M0 15 Q 20 5, 40 12 T 80 4 T 100 10",
                                  "M0 10 Q 20 18, 40 5 T 80 15 T 100 6",
                                  "M0 15 Q 20 5, 40 12 T 80 4 T 100 10"
                                ]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </svg>
                          <span className="text-[10px] text-on-surface-variant/70">{t('valueProp.f1SimMod3Sub')}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      {t('valueProp.f1SimMod3Status')}
                    </span>
                  </motion.div>
                </div>
              </div>
            </TiltWindowCard>
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
          
          {/* Feature 2 Moving Parallax Window */}
          <motion.div 
            style={{ y: parallaxY2 }}
            className="flex-1 w-full relative overflow-visible flex items-center justify-center rounded-[2rem] min-h-[400px] dotted-grid py-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 via-surface-bright/50 to-primary/10 rounded-[2rem] -z-10" />
            
            <TiltWindowCard className="w-[88%] md:w-[86%]">
              <div className="glass-panel p-6 space-y-5 shadow-2xl border border-white/30 dark:border-white/10 backdrop-blur-xl rounded-2xl bg-surface/85">
                <div className="flex items-center justify-between border-b border-border/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-primary animate-bounce" style={{ animationDuration: '3s' }} />
                    <span className="text-xs font-extrabold">Status Deployment</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    v1.2.0-stable
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Propagasi Server Edge</span>
                    <span className="font-mono text-primary">99.9%</span>
                  </div>
                  <div className="h-2 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: "60%" }}
                      animate={{ width: "99.9%" }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-primary via-tertiary to-emerald-400 rounded-full" 
                    />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs font-semibold text-on-surface-variant/80">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Sertifikat SSL aktif (HTTPS 256-bit)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Migrasi database multi-region selesai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span>Propagasi Edge CDN & Cache Warming (14ms)...</span>
                  </div>
                </div>
              </div>
            </TiltWindowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
