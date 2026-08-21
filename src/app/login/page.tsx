"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/apiClient";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticleBackground from "@/components/ui/ParticleBackground";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchApi("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.access_token) {
        localStorage.setItem("auth_token", response.access_token);
        if (response.user) {
          localStorage.setItem("user_role", response.user.role || "admin");
          localStorage.setItem("user_name", response.user.name || "");
          localStorage.setItem("user_email", response.user.email || "");
        }
        if (response.user?.role === "customer") {
          router.push("/client/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Gagal melakukan login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 group/login"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }}
    >
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-tertiary/5 to-transparent -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 to-tertiary/10 rounded-full blur-[120px] -z-15" />
      
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-10 group-hover/login:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 88, 188, 0.15), rgba(141, 34, 192, 0.15), transparent 90%)`,
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl p-8 shadow-2xl relative z-10 w-full max-w-md mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <img src="/favicon-96x96.png" alt="Luvion Logo" className="h-10 w-auto object-contain" />
              <span className="text-foreground font-extrabold tracking-tight uppercase text-2xl">Luvion</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Selamat Datang</h1>
            <p className="text-on-surface-variant text-sm">Masuk ke panel dashboard Luvion Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant/60" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border/40 rounded-xl bg-surface/50 text-foreground placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="admin@luvion.my.id"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-on-surface">Password</label>
                <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Lupa sandi?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-on-surface-variant/60" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border/40 rounded-xl bg-surface/50 text-foreground placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="relative w-full overflow-hidden flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 group bg-gradient-to-r from-blue-600 via-primary to-blue-700 hover:from-blue-500 hover:to-primary active:scale-[0.99]"
            >
              {/* Shimmer Sweep Animation Overlay on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                  <span className="text-white font-bold tracking-wide">Memproses Masuk...</span>
                </div>
              ) : (
                <>
                  <span className="text-white font-bold tracking-wide">Masuk Sekarang</span>
                  <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1.5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              Belum punya akun?{' '}
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                Hubungi Tim Sales
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
