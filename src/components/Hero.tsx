'use client';

import React, { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Plus, ToggleLeft, ToggleRight, Sparkles, Code, Calendar, ChevronRight } from 'lucide-react';

interface HeroProps {
  onRecommendTier: (tier: string) => void;
}

export default function Hero({ onRecommendTier }: HeroProps) {
  const [planEnabled, setPlanEnabled] = useState(true);
  const [input, setInput] = useState('');
  
  // Vercel AI SDK v4 useChat defaults to '/api/chat' endpoint
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';

  // Recommended prompt templates for UMKM
  const templates = [
    {
      label: 'Finansial & Kasir',
      prompt: 'Tolong buatkan Dashboard Finansial untuk memantau profitabilitas dan sistem kasir toko kelontong saya.',
    },
    {
      label: 'CRM & WhatsApp',
      prompt: 'Saya butuh sistem CRM UMKM untuk melacak data pelanggan dan automasi follow-up chat WhatsApp.',
    },
    {
      label: 'Multi-Gudang & Kurir',
      prompt: 'Saya ingin sistem manajemen stok multi-gudang dan pelacakan kurir pengiriman barang toko retail saya.',
    },
    {
      label: 'Jastip Pro',
      prompt: 'Saya butuh sistem jastip pro untuk rekap pesanan, hitung ongkir otomatis, dan kelola pembayaran.',
    },
  ];

  // Helper to extract text from Vercel AI SDK v4 parts-based UIMessage, with fallback for runtime content string
  const getMessageText = (message: any) => {
    if (!message) return '';
    if (typeof message.content === 'string' && message.content.length > 0) {
      return message.content;
    }
    if (message.parts && Array.isArray(message.parts)) {
      return message.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('');
    }
    return '';
  };

  // Look for the recommendation marker in messages to trigger the pricing highlight
  const lastAssistantMessage = messages.findLast((m) => m.role === 'assistant');
  
  useEffect(() => {
    const text = getMessageText(lastAssistantMessage);
    if (text) {
      const match = text.match(/__HIGHLIGHT_TIER__(Starter|Pro|Enterprise)__/);
      if (match) {
        onRecommendTier(match[1]);
      }
    }
  }, [lastAssistantMessage, onRecommendTier]);

  const handleTemplateClick = (prompt: string) => {
    setInput(prompt);
  };

  const cleanMessageContent = (content: string) => {
    return content.replace(/__HIGHLIGHT_TIER__(Starter|Pro|Enterprise)__/, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <section className="relative pt-40 pb-24 px-6 min-h-[95vh] flex flex-col items-center justify-center text-center overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-tertiary/5 to-background -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 to-tertiary/10 rounded-full blur-[120px] -z-15" />

      {/* Feature Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-2 mb-8 hover:scale-[1.02] transition-transform"
      >
        <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Baru
        </span>
        <span className="text-sm font-semibold text-on-surface flex items-center gap-1">
          Luvion AI Engine v1.0 <Sparkles className="h-3.5 w-3.5 text-primary" />
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-sans font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tighter text-on-surface max-w-5xl mb-6"
      >
        Scale Up Bisnis Anda <br />
        <span className="vibrant-text-gradient">
          Build With Luvion
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base md:text-lg text-on-surface-variant max-w-3xl mb-12 font-medium"
      >
        Luvion membantu Anda merancang sistem digital seperti Dashboard, Website, & ekosistem modul bisnis. Ceritakan masalah bisnis Anda di bawah, AI kami akan menganalisis kebutuhan Anda secara real-time!
      </motion.p>

      {/* Prompt Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-3xl glass-panel rounded-[2rem] p-6 mb-8 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] transition-all"
      >
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
          <textarea
            value={input}
            onChange={handleInputChange}
            maxLength={500}
            className="w-full bg-transparent border-none resize-none text-base md:text-lg text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-0 min-h-[90px] hide-scrollbar"
            placeholder="Tuliskan masalah bisnis Anda di sini... (contoh: 'Saya punya toko baju retail dan ingin memantau stok dari 3 cabang yang berbeda')"
          />
          <div className="flex items-center justify-between pt-4 border-t border-white/40 dark:border-white/10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2.5 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors text-on-surface-variant flex items-center justify-center border border-transparent hover:border-white/20"
              >
                <Plus className="h-5 w-5" />
              </button>
              <div
                onClick={() => setPlanEnabled(!planEnabled)}
                className="flex items-center gap-2 bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/10 rounded-full px-4 py-1.5 cursor-pointer shadow-sm hover:bg-white/80 transition-colors"
              >
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">AI Planner</span>
                {planEnabled ? (
                  <ToggleRight className="h-6 w-6 text-primary" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-on-surface-variant/40" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant/60 font-semibold">{input.length}/500</span>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="electric-gradient rounded-full w-12 h-12 flex items-center justify-center shadow-sm hover:scale-[1.05] disabled:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Quick Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-3 max-w-4xl"
      >
        <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mr-1">Rekomendasi Cepat:</span>
        {templates.map((tmpl, idx) => (
          <button
            key={idx}
            onClick={() => handleTemplateClick(tmpl.prompt)}
            className="glass-panel text-on-surface-variant rounded-full px-4 py-2 text-xs font-semibold hover:text-primary transition-all duration-300"
          >
            {tmpl.label}
          </button>
        ))}
      </motion.div>

      {/* AI Streaming Response / Canvas Showcase */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="w-full max-w-4xl mt-16"
          >
            <div className="relative rounded-[2rem] glass-panel overflow-hidden min-h-[400px] flex flex-col md:flex-row">
              {/* Left Column: Chat response text */}
              <div className="p-8 flex-1 flex flex-col justify-start text-left border-b md:border-b-0 md:border-r border-white/40 dark:border-white/10 max-h-[500px] overflow-y-auto hide-scrollbar">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">Luvion AI Copilot</span>
                    <span className="text-xs font-bold text-primary">Workspace Interaktif</span>
                  </div>
                </div>

                <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed flex-1">
                  {messages.map((m, idx) => {
                    const text = getMessageText(m);
                    if (!text) return null;
                    const isUser = m.role === 'user';

                    if (isUser) {
                      return (
                        <div key={idx} className="flex gap-3 flex-row-reverse items-start">
                          <div className="w-8 h-8 rounded-full bg-tertiary/15 border border-tertiary/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-tertiary">U</span>
                          </div>
                          <div className="flex-1 flex flex-col items-end">
                            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase mb-1">Anda</span>
                            <div className="bg-primary/10 border border-primary/20 text-on-surface rounded-2xl rounded-tr-none p-3 max-w-[85%] text-left font-semibold">
                              {text}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 flex flex-col items-start">
                            <span className="text-[10px] font-bold text-primary uppercase mb-1">Luvion AI Copilot</span>
                            <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 text-on-surface rounded-2xl rounded-tl-none p-4 max-w-[85%] text-left font-medium">
                              {cleanMessageContent(text)}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex items-center gap-2 text-on-surface-variant/60 text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
                      <span>AI sedang berpikir...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Canvas / App Visual Preview */}
              <div className="flex-1 bg-white/15 dark:bg-white/2 dotted-grid relative overflow-hidden flex items-center justify-center p-8 min-h-[300px]">
                {/* Visual Canvas Elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-tertiary/5" />
                <div className="relative z-10 w-full max-w-xs glass-panel rounded-[1.5rem] p-6 overflow-hidden flex flex-col">
                  {/* Mock dashboard headers */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                        <Code className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="block text-xs font-extrabold text-on-surface leading-none">Luvion App</span>
                        <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Workspace</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      READY
                    </div>
                  </div>

                  {/* Modules indicators */}
                  <div className="space-y-3 flex-1 text-left">
                    <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Modul Terintegrasi:</span>
                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/5 flex items-center justify-between shadow-sm">
                      <span className="text-xs font-semibold text-on-surface">Finance Ledger v1.0</span>
                      <span className="text-[10px] font-bold text-[#556500] bg-secondary-container/50 px-1.5 py-0.5 rounded">AKTIF</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/2 border border-white/50 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-on-surface-variant/75">WhatsApp Automator</span>
                      <span className="text-[10px] font-bold text-[#326578] bg-tertiary-container/30 px-1.5 py-0.5 rounded">READY</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-on-surface-variant/60 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Deployment time: ~5m
                    </span>
                    <a href="#pricing" className="text-[10px] font-extrabold text-primary flex items-center gap-0.5 hover:underline uppercase tracking-wider">
                      Setup <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
