import React, { Suspense } from 'react';
import OrderForm from '@/components/OrderForm';

export const metadata = {
  title: 'Mulai Sekarang - Form Pemesanan',
  description: 'Formulir pemesanan paket aplikasi Luvion.',
};

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden pt-24 pb-12 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Formulir Pendaftaran</h1>
          <p className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
            Mari Bangun Sistem Anda
          </p>
          <p className="text-on-surface-variant font-medium text-base mt-4">
            Lengkapi data di bawah ini agar tim kami dapat menyiapkan aplikasi yang paling sesuai dengan kebutuhan bisnis Anda.
          </p>
        </div>

        <Suspense fallback={<div className="text-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>}>
          <OrderForm />
        </Suspense>
      </div>
    </main>
  );
}
