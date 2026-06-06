'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'What is Luvion?',
      answer: 'Luvion is an AI-driven SaaS platform that makes it easy for businesses to instantly build digital ecosystems (cashier, stock, courier, pre-orders) through everyday language descriptions without needing to understand coding.',
    },
    {
      question: 'How does Luvion AI work?',
      answer: 'Simply type your workflow or business operational problem in the AI field in the Hero section. Our AI Copilot will analyze your needs, compile system module recommendations, and prepare them for deployment in less than 5 minutes.',
    },
    {
      question: 'Is my business data safe with Luvion?',
      answer: 'Your data security is our priority. All communications are encrypted via SSL/TLS protocols, sensitive data is protected, and our database infrastructure is backed by secure and reliable cloud servers.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'There are no hidden fees. Our pricing is highly transparent: The Starter Plan is free forever for 3 basic projects, the Pro Plan is a flat $20/month for unlimited projects, and the Enterprise Plan is tailored to your corporate SLA.',
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes, on the Paid Pro Plan, you can fully connect your own custom domain (.com, .net, etc.), complete with automatic SSL certificate configuration from Luvion.',
    },
    {
      question: 'What if I need technical assistance?',
      answer: 'Starter Plan users get access to the community discussion forum. Meanwhile, Pro and Enterprise Plan users have priority 24/7 technical support directly from our engineering team.',
    },
  ];

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-surface relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Left Column */}
        <div className="lg:w-1/3 text-left">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">FAQ</h2>
          <h3 className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-[1.1] sticky top-32">
            Frequently Asked Questions
          </h3>
        </div>

        {/* Right Column: Accordion */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border-b border-border/20 py-4 transition-all"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="flex justify-between items-center w-full text-left py-2 group cursor-pointer focus:outline-none"
                >
                  <h4 className={`font-sans text-lg md:text-xl font-bold transition-colors group-hover:text-primary ${isOpen ? 'text-primary' : 'text-on-surface'}`}>
                    {faq.question}
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
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
