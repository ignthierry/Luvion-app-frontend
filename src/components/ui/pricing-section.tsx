"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server, Sparkles, Shield, Zap } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";

export interface PricingTier {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  priceSuffix?: string;
  description: string;
  features: string[];
  popular?: boolean;
  highlightColor?: string;
  includes?: string[];
}

const defaultPlans = [
  {
    id: "Starter",
    name: "Starter",
    subtitle: "Entry Level",
    description:
      "Untuk perorangan, pemilik toko kecil, atau bisnis yang baru mulai go-digital.",
    price: 49000,
    originalPrice: "Rp 99.000",
    formattedPricePrefix: "Rp ",
    formattedPriceSuffix: "/bulan",
    yearlyPrice: 39000,
    buttonText: "Pilih Starter",
    buttonVariant: "outline" as const,
    popular: false,
    features: [
      { text: "Akses ke fitur utama (Basic)" },
      { text: "1 User (Owner)" },
      { text: "Maksimal 100 transaksi / bulan" },
      { text: "Kapasitas penyimpanan standar" },
      { text: "Self-service support (Panduan & Grup)" },
    ],
    includes: [
      "Fitur Paket Starter:",
      "Akses ke fitur utama (Basic)",
      "1 User (Owner)",
      "Maksimal 100 transaksi / bulan",
    ],
  },
  {
    id: "Pro",
    name: "Paid Pro",
    subtitle: "Scale-Up",
    description:
      "Pilihan tepat untuk UKM dengan tim kecil yang mengandalkan efisiensi fitur otomatis.",
    price: 99000,
    originalPrice: "Rp 199.000",
    formattedPricePrefix: "Rp ",
    formattedPriceSuffix: "/bulan",
    yearlyPrice: 79000,
    buttonText: "Pilih Paid Pro",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Semua fitur di paket Starter" },
      { text: "3 - 5 kuota akun staff" },
      { text: "Transaksi Harian/Bulanan Unlimited" },
      { text: "Fitur Otomatisasi (Notifikasi, Laporan, dll)" },
      { text: "Dukungan Prioritas via WhatsApp / Chat" },
    ],
    includes: [
      "Fitur Paket Paid Pro:",
      "Semua fitur di paket Starter",
      "3 - 5 kuota akun staff",
      "Transaksi Harian/Bulanan Unlimited",
    ],
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    subtitle: "B2B / Agensi",
    description:
      "Untuk bisnis skala besar, butuh penyesuaian alur khusus atau integrasi penuh sistem internal.",
    price: 0,
    originalPrice: null,
    isCustomPrice: true,
    customPriceText: "Kustom",
    formattedPricePrefix: "",
    formattedPriceSuffix: "",
    yearlyPrice: 0,
    buttonText: "Hubungi Kami",
    buttonVariant: "outline" as const,
    popular: false,
    features: [
      { text: "Pengguna / Staff Unlimited" },
      { text: "Kustomisasi Domain Sendiri (Whitelabel)" },
      { text: "Akses API untuk Integrasi Pihak Ketiga" },
      { text: "Dedicated Server (Performa Diisolasi)" },
      { text: "Prioritas Dukungan Penuh (SLA Support)" },
    ],
    includes: [
      "Fitur Paket Enterprise:",
      "Pengguna / Staff Unlimited",
      "Kustomisasi Domain Sendiri (Whitelabel)",
      "Akses API untuk Integrasi Pihak Ketiga",
    ],
  },
];

async function fetchBackendPricing(): Promise<any[] | null> {
  try {
    const res = await fetch("/api/pricing");
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    return null;
  }
}

const getFeatureIcon = (index: number) => {
  switch (index % 5) {
    case 0:
      return <Briefcase size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />;
    case 1:
      return <Database size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />;
    case 2:
      return <Server size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />;
    case 3:
      return <Zap size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />;
    case 4:
    default:
      return <Shield size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />;
  }
};

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border border-gray-200 dark:border-neutral-700 p-1 shadow-sm">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-11 h-9 rounded-full sm:px-6 px-4 py-1 font-semibold text-sm transition-colors ${
            selected === "0"
              ? "text-white"
              : "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-11 h-9 w-full rounded-full border border-blue-500 bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/30"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Bulanan</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-11 h-9 flex-shrink-0 rounded-full sm:px-6 px-4 py-1 font-semibold text-sm transition-colors ${
            selected === "1"
              ? "text-white"
              : "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-11 h-9 w-full rounded-full border border-blue-500 bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/30"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Tahunan
            <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
              Hemat 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

function InteractivePricingCard({
  plan,
  index,
  isYearly,
  isRecommended,
  pricingRef,
  revealVariants,
}: {
  plan: any;
  index: number;
  isYearly: boolean;
  isRecommended: boolean;
  pricingRef: React.RefObject<HTMLDivElement | null>;
  revealVariants: any;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Glare cursor follower values
  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);

  const glareX = useSpring(rawGlareX, { stiffness: 180, damping: 22 });
  const glareY = useSpring(rawGlareY, { stiffness: 180, damping: 22 });

  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubX = glareX.on("change", (latestX) => {
      setGlarePos((prev) => ({ ...prev, x: Math.round(latestX) }));
    });
    const unsubY = glareY.on("change", (latestY) => {
      setGlarePos((prev) => ({ ...prev, y: Math.round(latestY) }));
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [glareX, glareY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rawGlareX.set(Math.round(px * 100));
    rawGlareY.set(Math.round(py * 100));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawGlareX.set(50);
    rawGlareY.set(50);
  };

  const isHighlight = isRecommended || plan.popular;

  return (
    <TimelineContent
      as="div"
      animationNum={4 + index}
      timelineRef={pricingRef}
      customVariants={revealVariants}
      className="flex"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full relative group flex cursor-pointer"
      >
        <Card
          className={`relative w-full border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
            isHighlight
              ? "border-blue-500 bg-white dark:bg-neutral-900 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/30"
              : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
          }`}
        >
          {/* Dynamic Moving Glare Spotlight */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, rgba(59, 130, 246, 0.12), rgba(255, 255, 255, 0.05) 40%, transparent 80%)`,
            }}
          />

          {/* Sweeping Light Beam Animation */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-20">
            <motion.div
              key={isHovered ? "hovered" : "unhovered"}
              initial={{ x: "-150%", opacity: 0 }}
              animate={isHovered ? { x: ["-150%", "250%"], opacity: [0, 0.4, 0] } : {}}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="w-[60%] h-[300%] -top-[100%] -rotate-[35deg] bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent"
            />
          </div>

          <CardHeader className="text-left relative z-10 p-6 pb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {plan.name}
              </h3>
              <div className="flex items-center gap-1">
                {isRecommended && (
                  <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm animate-pulse">
                    <Sparkles size={12} /> Rekomendasi
                  </span>
                )}
                {plan.popular && !isRecommended && (
                  <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Populer
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 min-h-[36px] leading-relaxed">{plan.description}</p>

            <div className="flex flex-col min-h-[56px] justify-end">
              {plan.originalPrice && !plan.isCustomPrice && (
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 line-through decoration-red-500 decoration-2 mb-0.5">
                  {plan.originalPrice}
                </span>
              )}
              <div className="flex items-baseline">
                {plan.isCustomPrice ? (
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.customPriceText}
                  </span>
                ) : (
                  <>
                    <span className="text-lg font-bold text-gray-900 dark:text-white mr-1">
                      Rp
                    </span>
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      format={{ useGrouping: true }}
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                    />
                    <span className="text-gray-600 dark:text-gray-400 ml-1 text-xs">
                      {isYearly ? "/bulan (tahunan)" : "/bulan"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-4 flex-grow flex flex-col justify-between relative z-10">
            <div>
              {plan.id === "Enterprise" ? (
                <a
                  href="https://wa.me/628197965599?text=Halo%20Luvion%2C%20saya%20tertarik%20dengan%20paket%20Enterprise"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center w-full mb-6 py-3 px-4 text-sm font-bold rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-white transition-all shadow-md"
                >
                  {plan.buttonText}
                </a>
              ) : (
                <Link
                  href={`/order?plan=${plan.id}`}
                  className={`block text-center w-full mb-6 py-3 px-4 text-sm font-bold rounded-xl transition-all shadow-md ${
                    isHighlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                      : "bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-white"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              )}

              <ul className="space-y-2.5 font-medium py-2">
                {plan.features.map((feature: any, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-center">
                    <span className="mt-0.5 mr-2.5 shrink-0">
                      {getFeatureIcon(featureIndex)}
                    </span>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
              <h4 className="font-semibold text-xs text-gray-900 dark:text-white mb-2">
                {plan.includes[0]}
              </h4>
              <ul className="space-y-1.5 font-medium">
                {plan.includes.slice(1).map((featureItem: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-center">
                    <span className="h-4 w-4 bg-green-100 dark:bg-green-950/60 border border-green-500 rounded-full grid place-content-center mt-0.5 mr-2 shrink-0">
                      <CheckCheck className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{featureItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TimelineContent>
  );
}

export default function PricingSection({ recommendedTier }: { recommendedTier?: string | null }) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const { data: backendData } = useQuery<any[] | null>({
    queryKey: ["pricing-section-data"],
    queryFn: fetchBackendPricing,
  });

  // Auto-scroll when recommended tier is updated by AI
  useEffect(() => {
    if (recommendedTier && pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [recommendedTier]);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    }),
    hidden: {
      y: 20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  // Map backend pricing tiers or fallback to default plans
  const rawDisplayPlans = Array.isArray(backendData) && backendData.length > 0
    ? backendData.map((item: any) => {
        const rawPriceStr = String(item.price || "");
        const isCustom = rawPriceStr.toLowerCase().includes("kustom") || rawPriceStr.toLowerCase().includes("custom");
        const numericMatch = rawPriceStr.replace(/[^0-9]/g, "");
        const parsedPrice = numericMatch ? parseInt(numericMatch, 10) : 0;
        const calculatedYearly = Math.round(parsedPrice * 0.8);

        const featuresList = Array.isArray(item.features)
          ? item.features.map((f: string | any) => ({
              text: typeof f === "string" ? f : f?.text || String(f),
            }))
          : [];

        return {
          id: item.id || item.name,
          name: item.name,
          subtitle: item.subtitle || item.name,
          description: item.description,
          price: parsedPrice,
          originalPrice: item.original_price || item.originalPrice || null,
          isCustomPrice: isCustom,
          customPriceText: rawPriceStr || "Kustom",
          formattedPricePrefix: "Rp ",
          formattedPriceSuffix: item.price_suffix || "/bulan",
          yearlyPrice: calculatedYearly,
          buttonText: isCustom ? "Hubungi Kami" : `Pilih ${item.name}`,
          buttonVariant: item.popular ? ("default" as const) : ("outline" as const),
          popular: !!item.popular,
          features: featuresList,
          includes: [
            `Fitur Paket ${item.name}:`,
            ...(item.features ? item.features.slice(0, 3) : []),
          ],
        };
      })
    : defaultPlans;

  // Sort plans: Starter (Left -> 1), Pro/Paid Pro (Middle -> 2), Enterprise (Right -> 3)
  const getSortScore = (idOrName: string) => {
    const name = String(idOrName).toLowerCase();
    if (name.includes("starter")) return 1;
    if (name.includes("pro")) return 2;
    if (name.includes("enterprise")) return 3;
    return 4;
  };

  const displayPlans = [...rawDisplayPlans].sort((a, b) => getSortScore(a.id) - getSortScore(b.id));

  return (
    <AuroraBackground id="pricing">
      <div className="w-full max-w-7xl px-4 pt-12 pb-16 mx-auto relative z-10" ref={pricingRef}>
        <div className="text-center mb-8 max-w-4xl mx-auto relative z-10">
          <TimelineContent
            as="h2"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-normal sm:leading-relaxed"
          >
            Pilih Paket Yang Paling Sesuai Dengan{" "}
            <span className="border border-dashed border-blue-500 px-3 py-1 rounded-xl bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 inline-block align-middle my-1">
              Skala Operasional Dan Finansial
            </span>
          </TimelineContent>
        </div>

        <TimelineContent
          as="div"
          animationNum={3}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="relative z-10 mb-8"
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>

        <div className="grid md:grid-cols-3 max-w-7xl gap-6 py-6 mx-auto relative z-10 items-stretch">
          {displayPlans.map((plan: any, index: number) => {
            const isRecommended = !!(recommendedTier && plan.id.toLowerCase() === recommendedTier.toLowerCase());

            return (
              <InteractivePricingCard
                key={plan.name}
                plan={plan}
                index={index}
                isYearly={isYearly}
                isRecommended={isRecommended}
                pricingRef={pricingRef}
                revealVariants={revealVariants}
              />
            );
          })}
        </div>
      </div>
    </AuroraBackground>
  );
}
