'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/context/LanguageContext';

interface FAQItem {
  id: number;
  question_id: string;
  answer_id: string;
  question_en: string;
  answer_en: string;
}

async function fetchFaqs(): Promise<FAQItem[]> {
  const res = await fetch('/api/faqs');
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language, t } = useLanguage();
  const { data: faqs = [], isLoading, error } = useQuery<FAQItem[]>({
    queryKey: ['faqs'],
    queryFn: fetchFaqs,
  });

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/3 text-left"
        >
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">FAQ</h2>
          <h3 className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-[1.1] sticky top-32">
            {language === 'en' ? 'Frequently Asked Questions' : 'Pertanyaan yang Sering Diajukan'}
          </h3>
        </motion.div>

        {/* Right Column: Accordion */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-on-surface-variant/60 py-10">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <span className="text-sm font-semibold">{language === 'en' ? 'Loading FAQs...' : 'Memuat FAQ...'}</span>
            </div>
          ) : error ? (
            <div className="text-sm text-error font-semibold py-10">
              {language === 'en' ? 'Failed to load FAQs.' : 'Gagal memuat FAQ.'}
            </div>
          ) : (
            faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const question = language === 'en' ? faq.question_en : faq.question_id;
              const answer = language === 'en' ? faq.answer_en : faq.answer_id;
              
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="border-b border-border/20 py-4 transition-all"
                >
                  <button
                    onClick={() => toggleItem(idx)}
                    className="flex justify-between items-center w-full text-left py-2 group cursor-pointer focus:outline-none"
                  >
                    <h4 className={`font-sans text-lg md:text-xl font-bold transition-colors group-hover:text-primary ${isOpen ? 'text-primary' : 'text-on-surface'}`}>
                      {question}
                    </h4>
                    <span className="text-on-surface-variant group-hover:text-primary shrink-0 ml-4">
                      {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-semibold mt-4 pr-12 text-left">
                          {answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
