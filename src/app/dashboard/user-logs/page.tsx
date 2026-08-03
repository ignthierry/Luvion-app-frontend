"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { Loader2, Activity, User, Monitor } from "lucide-react";

interface UserLog {
  id: number;
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function UserLogsPage() {
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi("/user-logs");
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseUserAgent = (ua: string) => {
    if (!ua) return "Unknown";
    // Simple parser for common browsers and OS to keep it neat
    let browser = "Unknown Browser";
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    
    let os = "Unknown OS";
    if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
    else if (ua.includes("Mac OS X")) os = "Mac OS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone")) os = "iOS";

    return `${os} - ${browser}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Log Aktivitas Pengguna</h1>
          <p className="text-on-surface-variant text-sm mt-1">Pantau aktivitas login dan logout pengguna sistem.</p>
        </div>
        <button
          onClick={loadLogs}
          className="flex items-center gap-2 bg-surface hover:bg-surface-container text-foreground border border-border/40 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-sm"
        >
          <Activity className="w-4 h-4" /> Segarkan Data
        </button>
      </div>

      <div className="bg-surface border border-border/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface-variant">
            <thead className="bg-black/5 text-xs uppercase text-on-surface-variant/80 font-bold border-b border-border/40">
              <tr>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Aktivitas</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Perangkat (Browser/OS)</th>
                <th className="px-6 py-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground">
                    <div className="flex flex-col">
                      <span>{log.user?.name || 'Unknown'}</span>
                      <span className="text-xs font-normal text-on-surface-variant">{log.user?.email || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      log.action === 'login' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                      {log.action === 'login' ? 'Masuk' : 'Keluar'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs">{log.ip_address || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2" title={log.user_agent}>
                      <Monitor className="w-4 h-4 text-on-surface-variant/70" />
                      <span className="truncate max-w-[200px] block">{parseUserAgent(log.user_agent)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    Belum ada log aktivitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
