'use client';

import React from 'react';
import { Globe } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass-panel rounded-full z-50 flex justify-between items-center py-3 px-6">
      <a className="font-sans font-extrabold tracking-tighter text-primary flex items-center gap-2 text-xl" href="#">
        <svg className="h-8 w-8 text-primary" fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2.2"></circle>
          <path d="M11 10V22M21 10V22M11 16H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
        </svg>
        <span className="text-foreground font-extrabold tracking-tight uppercase">Luvion</span>
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a className="text-primary font-bold hover:opacity-80 transition-opacity text-sm" href="#features">Product</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#features">Use Cases</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#modules">Resources</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#pricing">Pricing</a>
        <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm" href="#pricing">Enterprise</a>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-colors duration-300 flex items-center justify-center p-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10">
          <Globe className="h-4 w-4" />
        </button>
        <a className="electric-gradient font-semibold px-5 py-2 rounded-full text-sm hover:scale-[1.03] active:scale-[0.97]" href="#pricing">
          Mulai Membangun
        </a>
      </div>
    </nav>
  );
}
