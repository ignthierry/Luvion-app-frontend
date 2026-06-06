'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ValueProp from '@/components/ValueProp';
import ModulesEcosystem from '@/components/ModulesEcosystem';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import FooterCTA from '@/components/FooterCTA';

export default function Home() {
  const [recommendedTier, setRecommendedTier] = useState<string | null>(null);

  const handleRecommendTier = (tier: string) => {
    setRecommendedTier(tier);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Section 1: Hero & AI Column */}
        <Hero onRecommendTier={handleRecommendTier} />

        {/* Section 2: Value Proposition (Fitur Utama) */}
        <ValueProp />

        {/* Section 3: Ekosistem Integrasi & Modul */}
        <ModulesEcosystem />

        {/* Section 4: Paket Harga */}
        <Pricing recommendedTier={recommendedTier} />

        {/* Section 5: FAQ */}
        <FAQ />

        {/* Section 6: Final CTA & Footer */}
        <FooterCTA />
      </main>
    </div>
  );
}
