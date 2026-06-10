'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

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
        className="relative py-24 px-6 flex flex-col items-center justify-center min-h-[50vh] overflow-hidden group/cta bg-surface border-t border-border/20"
      >
        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-surface -z-10" />
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

        <h2 className="font-sans font-extrabold text-3xl md:text-5xl leading-tight mb-10 text-center relative z-10 max-w-3xl text-on-surface">
          Jadi, sistem digital apa yang ingin Anda bangun?
        </h2>
        <a
          className="inline-flex items-center gap-3 electric-gradient font-semibold px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-sm group relative z-10 text-base"
          href="#pricing"
        >
          Mulai Sekarang
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </section>

      {/* Footer Links Section */}
      <div className="bg-transparent w-full py-8 text-on-surface-variant font-medium relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-border/15 pt-8">
          <div className="font-sans font-black text-headline-md flex items-center gap-2 text-on-surface">
            <img src="/logo2.png" alt="Luvion Logo" className="h-6 w-auto object-contain" />
            <span className="text-sm font-extrabold uppercase tracking-widest">LUVION AI</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a className="hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
            <a className="hover:text-primary transition-colors" href="#">Ketentuan Layanan</a>
            <a className="hover:text-primary transition-colors" href="#">Keamanan</a>
            <a className="hover:text-primary transition-colors" href="#">Status</a>
            <a className="hover:text-primary transition-colors" href="#">Kontak</a>
          </div>
          <div className="text-xs text-on-surface-variant/80">
            © 2026 Platform Web Luvion. Dibangun untuk masa depan pertumbuhan UMKM.
          </div>
        </div>
      </div>
    </footer>
  );
}
