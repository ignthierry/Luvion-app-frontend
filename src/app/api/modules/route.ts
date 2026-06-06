import { NextResponse } from 'next/server';

export async function GET() {
  const modules = [
    {
      id: 'finance-ledger',
      name: 'Finance Ledger',
      description: 'Lacak pengeluaran, pemasukan, dan analisis profitabilitas otomatis dengan visualisasi chart interaktif.',
      icon: 'Wallet',
      color: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20',
      bgGrad: 'bg-[#38BDF8]/10',
      demoType: 'chart',
      demoTitle: 'Streaming Dashboard'
    },
    {
      id: 'pospro-jastip',
      name: 'Pospro / Jastip Pro',
      description: 'Kelola pesanan jastip, lacak status kurir, hitung ongkos kirim otomatis, dan rekap tagihan pelanggan.',
      icon: 'Package',
      color: 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20',
      bgGrad: 'bg-[#FF5E3A]/10',
      demoType: 'list',
      demoTitle: 'Finance Ledger'
    },
    {
      id: 'travel-planner',
      name: 'Travel Planner',
      description: 'Buat rencana perjalanan, atur jadwal, estimasi biaya, dan optimalkan rute perjalanan bisnis Anda.',
      icon: 'MapPin',
      color: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20',
      bgGrad: 'bg-[#FF9A9E]/10',
      demoType: 'travel',
      demoTitle: 'Travel Planner'
    },
    {
      id: 'gym-pro',
      name: 'Gym Pro',
      description: 'Kelola keanggotaan gym, jadwalkan sesi latihan, pantau pembayaran bulanan, dan automasi notifikasi WhatsApp.',
      icon: 'Activity',
      color: 'bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20',
      bgGrad: 'bg-[#FFD166]/10',
      demoType: 'grid',
      demoTitle: 'Gym Pro Grid'
    }
  ];

  return NextResponse.json(modules);
}
