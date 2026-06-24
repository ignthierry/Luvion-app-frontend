'use client';

import React, { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Plus, ToggleLeft, ToggleRight, Sparkles, Code, Calendar, ChevronRight } from 'lucide-react';

interface HeroProps {
  onRecommendTier: (tier: string) => void;
}

export default function Hero({ onRecommendTier }: HeroProps) {
  const [planEnabled, setPlanEnabled] = useState(true);
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState('ready');
  const isLoading = status === 'submitted' || status === 'streaming';

  const sendMessage = async ({ text }: { text: string }) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setStatus('submitted');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      setStatus('streaming');
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1].content = assistantContent;
            return copy;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan jaringan.' }]);
    } finally {
      setStatus('ready');
    }
  };

  // Recommended prompt templates for UMKM
  const templates = [
    {
      label: 'Keuangan & Kasir',
      prompt: 'Tolong buatkan Dashboard Keuangan untuk memantau profitabilitas dan sistem kasir untuk toko kelontong saya.',
    },
    {
      label: 'CRM & WhatsApp',
      prompt: 'Saya butuh sistem CRM untuk melacak data pelanggan dan mengotomatiskan chat follow-up WhatsApp.',
    },
    {
      label: 'Multi-Gudang & Kurir',
      prompt: 'Saya ingin sistem manajemen stok multi-gudang dan pelacakan kurir untuk toko ritel saya.',
    },
    {
      label: 'Manajemen Pesanan',
      prompt: 'Saya memerlukan sistem manajemen pesanan untuk merekap pesanan, menghitung ongkos kirim secara otomatis, dan mengelola pembayaran.',
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      sendMessage({ text: input });
      setInput('');
    }
  };



  return (
    <section 
      className="relative pt-40 pb-24 px-6 min-h-[95vh] flex flex-col items-center justify-center text-center overflow-hidden group/hero"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-tertiary/5 to-transparent -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 to-tertiary/10 rounded-full blur-[120px] -z-15" />
      
      {/* Interactive glow following the mouse */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-10 group-hover/hero:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 88, 188, 0.15), rgba(141, 34, 192, 0.15), transparent 90%)`,
        }}
      />

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
        Kembangkan Bisnis Anda <br />
        <span className="vibrant-text-gradient">
          Bangun Bersama Luvion
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base md:text-lg text-on-surface-variant max-w-3xl mb-12 font-medium"
      >
        Luvion membantu Anda merancang sistem digital seperti Dashboard, Website, & ekosistem modul bisnis. Jelaskan masalah bisnis Anda di bawah ini, AI kami akan menganalisis kebutuhan Anda secara real-time!
      </motion.p>

      {/* Initial Prompt Area - shown only before first message */}
      {messages.length === 0 && (
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
              onKeyDown={handleKeyDown}
              maxLength={500}
              className="w-full bg-transparent border-none resize-none text-base md:text-lg text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-0 min-h-[90px] hide-scrollbar"
              placeholder="Jelaskan masalah operasional bisnis Anda di sini... (contoh: 'Saya menjalankan toko pakaian ritel dan ingin melacak stok di 3 cabang')"
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
      )}

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
            <div className="relative rounded-[2rem] glass-panel overflow-hidden min-h-[400px] flex flex-col">
              {/* Chat header */}
              <div className="px-8 pt-6 pb-4 border-b border-white/20 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary">Ruang Kerja Interaktif</span>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-8 flex-1 flex flex-col justify-start text-left max-h-[500px] overflow-y-auto hide-scrollbar">
                <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed flex-1">
                  {messages.map((m, idx) => {
                    const text = getMessageText(m) || m.content || JSON.stringify(m);
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
                            <span className="text-[10px] font-bold text-primary uppercase mb-1">Luvion AI</span>
                            <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 text-on-surface rounded-2xl rounded-tl-none p-4 max-w-[85%] text-left font-medium">
                              {cleanMessageContent(text || m.content || JSON.stringify(m))}
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

              {/* Chat input at bottom of workspace */}
              <div className="px-6 py-4 border-t border-white/20 dark:border-white/5">
                <form onSubmit={handleSubmitForm} className="flex items-end gap-3">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                    rows={1}
                    className="flex-1 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 resize-none text-sm md:text-base text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all hide-scrollbar"
                    placeholder="Ketik pesan Anda... (Enter untuk mengirim, Shift+Enter untuk baris baru)"
                    style={{ maxHeight: '120px', minHeight: '44px' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = '44px';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="electric-gradient rounded-full w-11 h-11 flex items-center justify-center shadow-sm hover:scale-[1.05] disabled:scale-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
