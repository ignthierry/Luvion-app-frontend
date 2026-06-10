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
      answer: 'Luvion adalah platform SaaS berbasis AI yang memudahkan bisnis untuk membangun ekosistem digital secara instan (kasir, stok, kurir, pre-order) melalui deskripsi bahasa sehari-hari tanpa perlu memahami coding.',
    },
    {
      question: 'Bagaimana cara kerja Luvion AI?',
      answer: 'Cukup ketik alur kerja atau masalah operasional bisnis Anda pada kolom AI di bagian Hero. AI kami akan menganalisis kebutuhan Anda, menyusun rekomendasi modul sistem, dan menyiapkannya untuk diluncurkan dalam waktu kurang dari 5 menit.',
    },
    {
      question: 'Apakah data bisnis saya aman dengan Luvion?',
      answer: 'Keamanan data Anda adalah prioritas kami. Semua komunikasi dienkripsi melalui protokol SSL/TLS, data sensitif dilindungi, dan infrastruktur database kami didukung oleh server cloud yang aman dan andal.',
    },
    {
      question: 'Apakah ada biaya tersembunyi?',
      answer: 'Tidak ada biaya tersembunyi. Harga kami sangat transparan: Paket Starter gratis selamanya untuk 3 proyek dasar, Paket Pro flat senilai $20/bulan untuk proyek tanpa batas, dan Paket Enterprise disesuaikan dengan SLA perusahaan Anda.',
    },
    {
      question: 'Apakah saya bisa menggunakan domain sendiri?',
      answer: 'Ya, pada Paket Paid Pro, Anda dapat sepenuhnya menghubungkan domain kustom Anda sendiri (.com, .net, dll.), lengkap dengan konfigurasi sertifikat SSL otomatis dari Luvion.',
    },
    {
      question: 'Bagaimana jika saya membutuhkan bantuan teknis?',
      answer: 'Pengguna Paket Starter mendapatkan akses ke forum diskusi komunitas. Sementara itu, pengguna Paket Pro dan Enterprise memiliki dukungan teknis prioritas 24/7 langsung dari tim engineering kami.',
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
            Pertanyaan yang Sering Diajukan
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
