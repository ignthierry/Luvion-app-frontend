"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/apiClient";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  X,
  CreditCard,
  Box,
  HelpCircle,
  ShoppingCart,
  Inbox,
  Calendar,
  MessageSquare,
  Activity,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    } else {
      // We can fetch user profile or just let the dashboard page fetch it
      // For now, we assume authenticated.
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetchApi("/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("auth_token");
      router.push("/login");
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Requests", href: "/dashboard/requests", icon: Inbox },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
    { name: "Chat History", href: "/dashboard/chat-history", icon: MessageSquare },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "User Logs", href: "/dashboard/user-logs", icon: Activity },
    { name: "Modules", href: "/dashboard/modules", icon: Box },
    { name: "Pricing", href: "/dashboard/pricing", icon: CreditCard },
    { name: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
    { name: "Accounting", href: "/dashboard/accounting", icon: Wallet },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // Bottom nav (mobile): top-5 items + "Menu" opens the rest
  const bottomNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Akuntansi", href: "/dashboard/accounting", icon: Wallet },
    { name: "Chat", href: "/dashboard/chat-history", icon: MessageSquare },
  ];
  const drawerItems = navItems.filter(
    (item) => !bottomNavItems.some((b) => b.href === item.href)
  );

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
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
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="/favicon-96x96.png" alt="Luvion Logo" className="h-8 w-auto object-contain" />
              <span className="font-extrabold text-xl tracking-tight uppercase text-foreground">Luvion</span>
            </Link>
            <button 
              className="ml-auto lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-on-surface-variant hover:bg-surface/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-on-surface-variant/70"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-border/40">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-error hover:bg-error/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-screen filter blur-[128px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[128px] pointer-events-none -z-10"></div>
        
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/40 glass-panel sticky top-0 z-30 rounded-none border-t-0 border-l-0 border-r-0">
          <button
            className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-white lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-foreground">Admin Luvion</p>
                <p className="text-xs text-on-surface-variant">admin@luvion.ai</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-sm font-bold text-white">AL</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass-panel border-t border-border/40 backdrop-blur-xl">
        <div className="grid grid-cols-5 items-stretch">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-all ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                <span className={`relative p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-primary/15 scale-110" : ""
                }`}>
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </span>
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={() => setIsMenuDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-on-surface-variant"
          >
            <span className="p-1.5 rounded-xl">
              <Menu className="w-5 h-5" />
            </span>
            Menu
          </button>
        </div>
      </nav>

      {/* ─── Mobile Menu Drawer (bottom sheet) ─── */}
      <AnimatePresence>
        {isMenuDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMenuDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 inset-x-0 z-[60] lg:hidden glass-panel border-t border-border/40 rounded-t-3xl"
            >
              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border/60" />
              <div className="flex items-center justify-between px-5 py-4">
                <h3 className="font-bold text-foreground">Menu Lainnya</h3>
                <button
                  onClick={() => setIsMenuDrawerOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 px-4 pb-6 max-h-[55vh] overflow-y-auto">
                {drawerItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all text-[11px] font-semibold ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-on-surface-variant hover:bg-surface/60"
                      }`}
                    >
                      <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all text-[11px] font-semibold text-error hover:bg-error/10"
                >
                  <LogOut className="w-6 h-6" />
                  Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
