'use client';

import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Sparkles } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceSuffix: string;
  description: string;
  features: string[];
  popular: boolean;
  highlightColor: string;
}

interface PricingProps {
  recommendedTier: string | null;
}

async function fetchPricing(): Promise<PricingTier[]> {
  const res = await fetch('/api/pricing');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export default function Pricing({ recommendedTier }: PricingProps) {
  const { data: tiers, error, isLoading } = useQuery<PricingTier[]>({
    queryKey: ['pricing'],
    queryFn: fetchPricing,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  // Auto scroll to pricing when recommended tier changes
  useEffect(() => {
    if (recommendedTier && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [recommendedTier]);

  return (
    <section ref={sectionRef} id="pricing" className="py-24 px-6 relative bg-surface-container-low/30">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Subscription Plans</h2>
          <p className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
            Modular & Transparent Pricing
          </p>
          <p className="text-on-surface-variant font-medium text-base mt-4">
            Choose the plan that best fits your business financial and operational scale.
          </p>
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <span className="text-sm font-semibold">Loading pricing plans...</span>
            </div>
          </div>
        ) : error ? (
          <div className="w-full flex justify-center py-20">
            <span className="text-sm text-error font-semibold">Failed to load pricing plans. Please try again.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {tiers?.map((tier) => {
              const isRecommended = recommendedTier?.toLowerCase() === tier.id.toLowerCase();
              const displayHighlight = isRecommended || (tier.popular && !recommendedTier);

              return (
                <div
                  key={tier.id}
                  className={`relative p-8 rounded-[2rem] transition-all duration-500 flex flex-col justify-between overflow-hidden glass-panel ${
                    displayHighlight
                      ? 'border-primary ring-2 ring-primary/20 scale-[1.03] shadow-[0_24px_48px_-12px_rgba(0,88,188,0.1)] z-10'
                      : 'opacity-90'
                  }`}
                >
                  {/* Subtle Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${tier.highlightColor} -z-10`} />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {isRecommended && (
                      <div className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                        <Sparkles className="h-3 w-3" /> AI Recommended
                      </div>
                    )}
                    {tier.popular && !isRecommended && (
                      <div className="bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/10 text-on-surface text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Most Popular
                      </div>
                    )}
                  </div>

                  {/* Plan Meta */}
                  <div className="text-left">
                    <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                      {tier.subtitle}
                    </span>
                    <h3 className="font-sans font-extrabold text-2xl text-on-surface mt-1">{tier.name}</h3>
                    <p className="text-xs text-on-surface-variant font-semibold mt-3 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-sans font-black text-4xl md:text-5xl text-on-surface">{tier.price}</span>
                      <span className="text-xs font-bold text-on-surface-variant/80">{tier.priceSuffix}</span>
                    </div>

                    {/* Features checklist */}
                    <ul className="mt-8 space-y-4 text-xs font-semibold text-on-surface-variant">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-left leading-relaxed">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="mt-10">
                    <button
                      className={`w-full py-4 rounded-full text-xs font-bold transition-all ${
                        displayHighlight
                          ? 'electric-gradient shadow-md scale-100 hover:scale-[1.02]'
                          : 'glass-panel text-foreground shadow-sm hover:scale-[1.01]'
                      }`}
                    >
                      {tier.id === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
