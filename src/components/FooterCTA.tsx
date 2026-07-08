'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FooterCTA() {

  return (
    <footer className="w-full mt-24">
      {/* Final CTA Section */}
      <section
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
        className="relative py-24 px-6 flex flex-col items-center justify-center min-h-[50vh] overflow-hidden group/cta border-t border-border/20"
      >
        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-transparent -z-10" />
        <div
          className="absolute inset-0 opacity-20 -z-10 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 10% 20%, #0058bc 0%, transparent 50%), 
                        radial-gradient(circle at 90% 80%, #8d22c0 0%, transparent 50%), 
                        radial-gradient(circle at 50% 50%, #b42907 0%, transparent 70%)`,
          }}
        />
        
        {/* Interactive glow following the mouse */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-0 group-hover/cta:opacity-40 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 88, 188, 0.4), rgba(141, 34, 192, 0.3), transparent 60%)`,
          }}
        />

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-sans font-extrabold text-3xl md:text-5xl leading-tight mb-10 text-center relative z-10 max-w-3xl text-on-surface"
        >
          Jadi, sistem digital apa yang ingin Anda bangun?
        </motion.h2>
        <motion.a
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-md group relative z-10 text-base"
          href="https://wa.me/628197965599?text=Halo%20Luvion%2C%20saya%20ingin%20berkonsultasi%20mengenai%20pembuatan%20sistem%20digital%20untuk%20bisnis%20saya."
          target="_blank"
          rel="noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Mulai Sekarang
        </motion.a>
      </section>

      {/* Footer Links Section */}
      <div className="bg-transparent w-full py-12 text-on-surface-variant font-medium relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border/15 pt-10">
          
          {/* Logo and Contact Info */}
          <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <div className="font-sans font-black text-headline-md flex items-center gap-2 text-on-surface justify-center md:justify-start">
              <img src="/favicon-96x96.png" alt="Luvion Logo" className="h-6 w-auto object-contain" />
              <span className="text-sm font-extrabold uppercase tracking-widest">LUVION</span>
            </div>
            <div className="text-sm text-on-surface-variant/80 flex flex-col gap-1 mt-2">
              <span className="font-bold text-on-surface mb-1">Developer Contact:</span>
              <span>I Gusti Ngurah Thierry Agusta</span>
              <span>Perum. Shojiland Blok EJ.02 Candi Sidoarjo</span>
              <span>Telp/WA: 081357748559</span>
              <span>Email Admin: <a href="mailto:admin@luvion.my.id" className="hover:text-primary transition-colors">admin@luvion.my.id</a></span>
              <span>Email CS: <a href="mailto:cs@luvion.my.id" className="hover:text-primary transition-colors">cs@luvion.my.id</a></span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start gap-4 text-sm">
            <span className="font-bold text-on-surface mb-1">Tautan</span>
            <div className="flex flex-col gap-3 items-center md:items-start">
              <Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Ketentuan Layanan</Link>
              {/* <a className="hover:text-primary transition-colors" href="#">Keamanan</a>
              <a className="hover:text-primary transition-colors" href="#">Status</a> */}
              <a className="hover:text-primary transition-colors" href="https://wa.me/628197965599" target="_blank" rel="noreferrer">Kontak (WA)</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col justify-end text-xs text-on-surface-variant/80 items-center md:items-end text-center md:text-right mt-6 md:mt-0">
            <span>© 2026 Platform Web Luvion.</span>
            <span>Dibangun untuk masa depan pertumbuhan digital Indonesia.</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
