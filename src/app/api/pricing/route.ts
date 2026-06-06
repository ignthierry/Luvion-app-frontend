import { NextResponse } from 'next/server';

export async function GET() {
  const pricingTiers = [
    {
      id: 'Starter',
      name: 'Starter',
      subtitle: 'UMKM Pemula',
      price: '$0',
      priceSuffix: '/selamanya',
      description: 'Cocok untuk memulai digitalisasi bisnis kecil Anda secara mandiri.',
      features: [
        'Maksimal 3 Proyek Aktif',
        'Basic LLM & Komponen Standar',
        'Dukungan Komunitas (Forum)',
        'Subdomain Luvion (luvion.site/nama-toko)'
      ],
      popular: false,
      highlightColor: 'from-blue-500/10 to-transparent'
    },
    {
      id: 'Pro',
      name: 'Paid Pro',
      subtitle: 'UMKM Scale-Up',
      price: '$20',
      priceSuffix: '/bulan',
      description: 'Ideal untuk bisnis berkembang yang butuh fitur automasi & custom domain.',
      features: [
        'Unlimited Proyek Aktif',
        'Advanced AI Automation & Integrasi',
        'Priority Support (24/7 Response)',
        'Kustom Domain Sendiri (.com/.id)'
      ],
      popular: true,
      highlightColor: 'from-[#ff8a65]/20 to-[#9f4122]/10'
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      subtitle: 'Korporat / Khusus',
      price: 'Custom',
      priceSuffix: '',
      description: 'Solusi terbaik untuk integrasi skala enterprise, kustom AI, dan keandalan penuh.',
      features: [
        'Dedicated Environment',
        'Kustomisasi Model AI Bisnis Mandiri',
        'Dedicated Account Manager & SLA',
        'Multi-domain & White-label internal'
      ],
      popular: false,
      highlightColor: 'from-purple-500/15 to-transparent'
    }
  ];

  return NextResponse.json(pricingTiers);
}
