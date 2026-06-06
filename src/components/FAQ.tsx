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
      question: 'Apa itu Luvion?',
      answer: 'Luvion adalah platform SaaS AI-driven yang mempermudah UMKM membangun ekosistem digital (kasir, stok, kurir, jastip) secara instan melalui input deskripsi bahasa sehari-hari tanpa perlu mengerti bahasa coding.',
    },
    {
      question: 'Bagaimana cara kerja Luvion AI?',
      answer: 'Cukup ketikkan alur kerja atau masalah operasional bisnis Anda di kolom AI pada Hero section. AI Copilot kami akan menganalisis kebutuhan Anda, menyusun rekomendasi modul sistem, dan menyiapkannya untuk dideploy dalam waktu kurang dari 5 menit.',
    },
    {
      question: 'Apakah data bisnis saya aman di Luvion?',
      answer: 'Keamanan data Anda adalah prioritas kami. Seluruh komunikasi dienkripsi melalui protokol SSL/TLS, data sensitif dilindungi, dan infrastruktur database kami didukung oleh cloud server yang aman dan andal.',
    },
    {
      question: 'Apakah ada biaya tersembunyi?',
      answer: 'Tidak ada biaya tersembunyi. Skema harga kami sangat transparan: Paket Starter gratis selamanya untuk 3 proyek dasar, Paket Pro seharga $20/bulan flat untuk proyek tak terbatas, dan Paket Enterprise disesuaikan dengan SLA korporasi Anda.',
    },
    {
      question: 'Apakah saya bisa menggunakan domain sendiri?',
      answer: 'Ya, pada Paket Paid Pro, Anda dapat menghubungkan domain kustom sendiri (.com, .id, .co.id, dll.) secara penuh, lengkap dengan konfigurasi sertifikat SSL otomatis dari Luvion.',
    },
    {
      question: 'Bagaimana jika saya butuh bantuan teknis?',
      answer: 'Pengguna Paket Starter mendapatkan akses ke forum diskusi komunitas. Sementara pengguna Paket Pro dan Enterprise memiliki akses prioritas dukungan teknis 24/7 langsung dari tim engineer kami.',
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
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Tanya Jawab</h2>
          <h3 className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-[1.1] sticky top-32">
            Pertanyaan yang sering diajukan
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
