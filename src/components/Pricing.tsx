'use client';

import React from 'react';
import PricingSection from '@/components/ui/pricing-section';

interface PricingProps {
  recommendedTier?: string | null;
}

export default function Pricing({ recommendedTier }: PricingProps) {
  return <PricingSection recommendedTier={recommendedTier} />;
}
