'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const languages = [
    { code: 'ID', name: 'Bahasa Indonesia' },
    { code: 'EN', name: 'English' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass-panel rounded-full z-50 flex justify-between items-center py-3 px-6">
      <a className="font-sans font-extrabold tracking-tighter text-primary flex items-center gap-2 text-xl" href="#">
        <img src="/favicon-96x96.png" alt="Luvion Logo" className="h-8 w-auto object-contain" />
        <span className="text-foreground font-extrabold tracking-tight uppercase">Luvion</span>
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a className="text-primary font-bold hover:opacity-80 transition-opacity text-sm" href="#features">{t('navbar.product')}</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#features">{t('navbar.solutions')}</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#modules">{t('navbar.resources')}</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#pricing">{t('navbar.pricing')}</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#pricing">{t('navbar.enterprise')}</a>
      </div>
      <div className="flex items-center gap-4">
        
        {/* Language Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`text-on-surface-variant hover:text-primary transition-all duration-300 flex items-center justify-center gap-1 p-1.5 px-3 rounded-full hover:bg-white/40 dark:hover:bg-white/10 ${isLangOpen ? 'bg-white/40 dark:bg-white/10 text-primary' : ''}`}
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-bold">{lang}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-40 glass-panel rounded-2xl shadow-xl overflow-hidden py-2 border border-surface-container/50"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code as 'ID' | 'EN');
                      setIsLangOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-primary/5 transition-colors"
                  >
                    <span className={`font-semibold ${lang === l.code ? 'text-primary' : 'text-on-surface'}`}>
                      {l.name}
                    </span>
                    {lang === l.code && <Check className="h-3 w-3 text-primary" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm mr-2" href="/login">
          {t('navbar.login')}
        </a>
        <a className="electric-gradient font-semibold px-5 py-2 rounded-full text-sm hover:scale-[1.03] active:scale-[0.97]" href="#pricing">
          {t('navbar.startBuilding')}
        </a>
      </div>
    </nav>
  );
}
