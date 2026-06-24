"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/apiClient";
import { Users, CreditCard, Activity, Box, ArrowUpRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardData {
  stats: {
    total_users: number;
    total_users_growth: string;
    active_subscriptions: number;
    active_subscriptions_growth: string;
    revenue: string;
    revenue_growth: string;
    active_modules: number;
    active_modules_growth: string;
  };
  recent_activity: Array<{
    id: number;
    user: string;
    action: string;
    time: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetchApi("/dashboard");
        setData(response);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Pengguna",
      value: data?.stats.total_users,
      growth: data?.stats.total_users_growth,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Langganan Aktif",
      value: data?.stats.active_subscriptions,
      growth: data?.stats.active_subscriptions_growth,
      icon: Activity,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Pendapatan Bulan Ini",
      value: data?.stats.revenue,
      growth: data?.stats.revenue_growth,
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Modul Aktif",
      value: data?.stats.active_modules,
      growth: data?.stats.active_modules_growth,
      icon: Box,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-zinc-400 text-sm mt-1">Pantau performa platform Luvion Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                {stat.growth}
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white tracking-tight">Aktivitas Terbaru</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Lihat Semua</button>
          </div>
          <div className="divide-y divide-white/5">
            {data?.recent_activity.map((activity, idx) => (
              <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center shrink-0 border border-white/5">
                  <span className="text-xs font-bold">{activity.user.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.user}</p>
                  <p className="text-sm text-zinc-400 truncate">{activity.action}</p>
                </div>
                <div className="text-xs text-zinc-500 whitespace-nowrap">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions or Extra Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
          <h2 className="text-lg font-semibold text-white tracking-tight mb-4">Aksi Cepat</h2>
          <div className="space-y-3 relative z-10">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group/btn">
              <span className="text-sm font-medium text-zinc-200">Tambah Pengguna Baru</span>
              <Users className="w-4 h-4 text-zinc-400 group-hover/btn:text-white transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group/btn">
              <span className="text-sm font-medium text-zinc-200">Kelola Modul AI</span>
              <Box className="w-4 h-4 text-zinc-400 group-hover/btn:text-white transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group/btn">
              <span className="text-sm font-medium text-zinc-200">Laporan Keuangan</span>
              <CreditCard className="w-4 h-4 text-zinc-400 group-hover/btn:text-white transition-colors" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
