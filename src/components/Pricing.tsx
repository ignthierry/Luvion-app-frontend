'use client';

import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
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
  const data = await res.json();
  return data.map((tier: any) => ({
    ...tier,
    originalPrice: tier.original_price,
    priceSuffix: tier.price_suffix,
    highlightColor: tier.highlight_color
  }));
}

export default function Pricing({ recommendedTier }: PricingProps) {
  const { t } = useLanguage();
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{t('pricing.headerTitle')}</h2>
          <p className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
            {t('pricing.headerSubtitle')}
          </p>
          <p className="text-on-surface-variant font-medium text-base mt-4">
            {t('pricing.headerDesc')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <span className="text-sm font-semibold">{t('pricing.loading')}</span>
            </div>
          </div>
        ) : error ? (
          <div className="w-full flex justify-center py-20">
            <span className="text-sm text-error font-semibold">{t('pricing.error')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {tiers?.slice().sort((a, b) => {
              const getScore = (name: string) => {
                const n = name.toLowerCase();
                if (n.includes('starter')) return 1;
                if (n.includes('pro')) return 2;
                return 3;
              };
              return getScore(a.name) - getScore(b.name);
            }).map((tier, index) => {
              const isRecommended = recommendedTier?.toLowerCase() === tier.id.toLowerCase();
              const displayHighlight = isRecommended || (tier.popular && !recommendedTier);
              const isEnterprise = tier.id === 'Enterprise';

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`relative p-8 rounded-[2rem] transition-all duration-500 flex flex-col justify-between overflow-hidden glass-panel hover:-translate-y-2 hover:scale-[1.05] hover:shadow-[0_30px_60px_-15px_rgba(0,88,188,0.2)] hover:z-20 ${
                    displayHighlight
                      ? 'border-primary ring-2 ring-primary/20 scale-[1.03] shadow-[0_24px_48px_-12px_rgba(0,88,188,0.1)] z-10'
                      : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Subtle Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${displayHighlight ? 'from-primary/10 via-purple-500/10 to-primary/5 dark:from-primary/20 dark:via-purple-500/10 dark:to-primary/10' : tier.highlightColor} -z-10 bg-[length:200%_200%] hover:animate-gradient transition-all duration-500`} />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {isRecommended && (
                      <div className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                        <Sparkles className="h-3 w-3" /> {t('pricing.recommended')}
                      </div>
                    )}
                    {tier.popular && !isRecommended && (
                      <div className="bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/10 text-on-surface text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {t('pricing.popular')}
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

                    <div className="mt-6 flex flex-col">
                      {tier.originalPrice && (
                        <span className="text-sm font-bold text-on-surface-variant/50 line-through decoration-error/70 decoration-2 -mb-1">
                          {tier.originalPrice}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className={`font-sans font-black text-on-surface tracking-tight ${tier.price.length > 6 ? 'text-3xl xl:text-4xl' : 'text-4xl md:text-5xl'}`}>
                          {tier.price}
                        </span>
                        <span className="text-xs font-bold text-on-surface-variant/80 whitespace-nowrap">{tier.priceSuffix}</span>
                      </div>
                      {tier.price !== 'Kustom' && (
                        <div className="mt-2 inline-flex">
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {t('pricing.freeTrial')}
                          </span>
                        </div>
                      )}
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
                    {isEnterprise ? (
                      <a
                        href="https://wa.me/628197965599?text=Halo%20Luvion%2C%20saya%20tertarik%20dengan%20paket%20Enterprise%20untuk%20bisnis%20saya.%20Boleh%20minta%20info%20lebih%20lanjut%3F"
                        target="_blank"
                        rel="noreferrer"
                        className={`group w-full py-3.5 md:py-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          displayHighlight
                            ? 'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-lg shadow-[#25D366]/20 scale-100 hover:scale-[1.03]'
                            : 'glass-panel text-on-surface border border-[#25D366]/30 hover:border-[#25D366] hover:bg-[#25D366]/5 shadow-sm hover:scale-[1.02]'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`w-5 h-5 transition-transform group-hover:-translate-y-0.5 ${!displayHighlight ? 'text-[#25D366]' : ''}`}
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                        {t('pricing.contactUs')}
                      </a>
                    ) : (
                      <Link
                        href={`/order?plan=${tier.id}`}
                        className={`group w-full py-3.5 md:py-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          displayHighlight
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-100 hover:scale-[1.03]'
                            : 'glass-panel text-on-surface border border-primary/30 hover:border-primary hover:bg-primary/5 shadow-sm hover:scale-[1.02]'
                        }`}
                      >
                        {t('pricing.startBuilding')}
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
