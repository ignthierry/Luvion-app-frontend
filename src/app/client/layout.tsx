"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/apiClient";
import { 
  LayoutDashboard, 
  Receipt, 
  PlusCircle, 
  LogOut, 
  Menu,
  X,
  UserCheck,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    } else {
      setUserName(localStorage.getItem("user_name") || "Klien Luvion");
      setUserEmail(localStorage.getItem("user_email") || "");
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetchApi("/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.clear();
      router.push("/login");
    }
  };

  const navItems = [
    { name: "Dashboard Klien", href: "/client/dashboard", icon: LayoutDashboard },
  ];

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-bold">Memuat Client Portal...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-border/40 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-border/40">
            <Link href="/client/dashboard" className="flex items-center gap-3">
              <img src="/favicon-96x96.png" alt="Luvion Logo" className="h-8 w-auto object-contain" />
              <div>
                <span className="font-extrabold text-xl tracking-tight uppercase text-foreground block leading-none">Luvion</span>
                <span className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider">Client Portal</span>
              </div>
            </Link>
            <button 
              className="ml-auto lg:hidden text-on-surface-variant hover:text-foreground"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 m-4 bg-surface/50 border border-border/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-foreground truncate">{userName}</p>
                <p className="text-xs text-on-surface-variant truncate">{userEmail}</p>
                <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Role: Customer
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border/40">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 glass-panel border-b border-border/40 z-10">
          <button
            className="lg:hidden text-on-surface-variant hover:text-foreground"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Luvion SaaS Customer Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-foreground hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
