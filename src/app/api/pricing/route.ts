import { NextResponse } from 'next/server';

export async function GET() {
  const pricingTiers = [
    {
      id: 'Starter',
      name: 'Starter',
      subtitle: 'Starter',
      price: 'Rp 0',
      priceSuffix: '/bulan pertama',
      description: 'Gratis 1 bulan pertama, selanjutnya Rp 50.000/bulan. Fokus pada tampilan yang menarik dan order lebih cepat.',
      features: [
        'Selanjutnya Rp 50.000 / bulan',
        'Mobile-First Design (Responsif di HP)',
        'Tombol WhatsApp Terintegrasi',
        'Katalog Produk / Layanan Menarik',
        'Profil Usaha Lengkap & Google Maps',
        'Form Pemesanan Pemesanan Modern'
      ],
      popular: false,
      highlightColor: 'from-blue-500/10 to-transparent'
    },
    {
      id: 'Pro',
      name: 'Paid Pro',
      subtitle: 'Scale-Up',
      originalPrice: 'Rp 150.000',
      price: 'Rp 50.000',
      priceSuffix: '/bulan',
      description: 'Harga promo untuk 3 bulan pertama, selanjutnya Rp 150.000/bulan.',
      features: [
        'Selanjutnya Rp 150.000 / bulan',
        'Opsi Bayar Tahunan: Diskon 25%',
        'Seluruh Fitur Versi Starter',
        'Aplikasi Manajemen Pendukung Bisnis',
        'Kustom Domain Sendiri (.com/.id)',
        'Dukungan & Support Prioritas',
        'Pendampingan & Digital Marketing'
      ],
      popular: true,
      highlightColor: 'from-[#ff8a65]/20 to-[#9f4122]/10'
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      subtitle: 'Korporat / Khusus',
      price: 'Kustom',
      priceSuffix: '',
      description: 'Solusi terbaik untuk integrasi skala enterprise, kustom AI, dan keandalan penuh.',
      features: [
        'Seluruh Keunggulan Pro & Starter',
        'Kustomisasi & Automasi Penuh',
        'Integrasi Model AI Bisnis Mandiri',
        'Dedicated Environment',
        'Dedicated Account Manager & SLA'
      ],
      popular: false,
      highlightColor: 'from-purple-500/15 to-transparent'
    }
  ];

  return NextResponse.json(pricingTiers);
}
