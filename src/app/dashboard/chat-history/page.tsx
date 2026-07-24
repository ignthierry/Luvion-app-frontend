"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/swal";
import { 
  MessageSquare, 
  Bot, 
  User, 
  Search, 
  Filter, 
  Loader2, 
  Trash2, 
  RefreshCw, 
  Clock,
  Layers,
  Sparkles,
  ListFilter,
  ChevronRight,
  SendHorizontal
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

interface ChatHistoryItem {
  id: number;
  session_id: string;
  intent: string | null;
  user_message: string;
  agent_response: string;
  agent_type: string;
  created_at: string;
}

interface ChatSessionSummary {
  session_id: string;
  total_messages: number;
  last_activity: string;
  latest_intent: string | null;
  agent_type: string;
}

export default function ChatHistoryPage() {
  const [histories, setHistories] = useState<ChatHistoryItem[]>([]);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"session" | "list">("session");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [histData, sessData] = await Promise.all([
        fetchApi("/chat-histories"),
        fetchApi("/chat-histories/sessions")
      ]);
      setHistories(histData);
      setSessions(sessData);
      if (sessData && sessData.length > 0 && !selectedSessionId) {
        setSelectedSessionId(sessData[0].session_id);
      }
    } catch (e: any) {
      console.error(e);
      showError("Gagal Memuat", e.message || "Gagal mengambil riwayat chat.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteMessage = async (msgId: number) => {
    if (!confirm("Hapus log pesan ini?")) return;
    try {
      await fetchApi(`/chat-histories/${msgId}`, { method: "DELETE" });
      showSuccess("Terhapus", "Pesan telah dihapus.");
      loadData();
    } catch (e: any) {
      showError("Gagal", e.message || "Gagal menghapus pesan.");
    }
  };

  const handleDeleteSession = async (sessId: string) => {
    if (!confirm(`Hapus seluruh sesi ${sessId}? Data tidak dapat dikembalikan.`)) return;
    try {
      await fetchApi(`/chat-histories/${sessId}?by_session=true`, { method: "DELETE" });
      showSuccess("Terhapus", "Sesi chat telah dihapus.");
      if (selectedSessionId === sessId) {
        setSelectedSessionId(null);
      }
      loadData();
    } catch (e: any) {
      showError("Gagal", e.message || "Gagal menghapus sesi.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = parseISO(dateStr);
      if (!isValid(d)) return dateStr;
      return format(d, "dd MMM yyyy, HH:mm", { locale: id });
    } catch (e) {
      return dateStr;
    }
  };

  const filteredHistories = histories.filter((item) => {
    const matchesSearch = 
      (item.user_message?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.agent_response?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.session_id?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesIntent = intentFilter === "all" || item.intent === intentFilter;
    const matchesAgent = agentFilter === "all" || item.agent_type === agentFilter;

    return matchesSearch && matchesIntent && matchesAgent;
  });

  const sessionMessages = histories.filter(
    (h) => h.session_id === selectedSessionId
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Collect unique intents & agent_types for filter options
  const uniqueIntents = Array.from(new Set(histories.map(h => h.intent).filter(Boolean)));
  const uniqueAgents = Array.from(new Set(histories.map(h => h.agent_type).filter(Boolean)));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Riwayat Chat AI (Chat History)
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Log percakapan pengguna dengan AI Agent dan n8n automation workflow.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-foreground font-semibold hover:bg-surface/60 transition-all border border-border/40 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Mode View Toggle & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-border/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-on-surface-variant">Total Pesan Chat</p>
            <p className="text-3xl font-extrabold text-foreground mt-1">{histories.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-on-surface-variant">Total Sesi Percakapan</p>
            <p className="text-3xl font-extrabold text-purple-400 mt-1">{sessions.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-border/40 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-on-surface-variant">Mode Tampilan</p>
            <div className="flex items-center gap-1.5 p-1 bg-surface/60 border border-border/40 rounded-xl">
              <button
                onClick={() => setViewMode("session")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "session"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Per Sesi
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                Tabel Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-2xl border border-border/40 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Memuat data riwayat chat...</p>
        </div>
      ) : viewMode === "session" ? (
        /* SESSION VIEW MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Session List Panel */}
          <div className="lg:col-span-4 glass-panel rounded-2xl border border-border/40 p-4 space-y-4 max-h-[750px] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Sesi Chat ({sessions.length})
              </h3>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Cari Sesi ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-surface/50 border border-border/40 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {sessions
                .filter(s => s.session_id.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sess) => {
                  const isSelected = selectedSessionId === sess.session_id;
                  return (
                    <div
                      key={sess.session_id}
                      onClick={() => setSelectedSessionId(sess.session_id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground shadow-lg shadow-primary/10"
                          : "bg-surface/30 border-border/30 text-on-surface-variant hover:bg-surface/60 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs truncate max-w-[170px] text-foreground">
                          {sess.session_id}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(sess.session_id);
                          }}
                          title="Hapus Sesi Ini"
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 text-[11px]">
                        <span className="bg-surface/80 px-2 py-0.5 rounded text-on-surface-variant font-medium">
                          {sess.total_messages} Pesan
                        </span>
                        {sess.latest_intent && (
                          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold uppercase">
                            {sess.latest_intent}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-[10px] text-on-surface-variant/70">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(sess.last_activity)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Session Chat Messages Panel */}
          <div className="lg:col-span-8 glass-panel rounded-2xl border border-border/40 flex flex-col h-[750px]">
            {selectedSessionId ? (
              <>
                {/* Header Chat */}
                <div className="p-4 border-b border-border/40 flex items-center justify-between bg-surface/40 rounded-t-2xl">
                  <div>
                    <p className="text-xs font-semibold uppercase text-on-surface-variant">Sesi Aktif</p>
                    <p className="text-base font-extrabold text-foreground font-mono">{selectedSessionId}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSession(selectedSessionId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Sesi
                  </button>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {sessionMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-on-surface-variant text-sm">
                      Tidak ada pesan dalam sesi ini.
                    </div>
                  ) : (
                    sessionMessages.map((msg) => (
                      <div key={msg.id} className="space-y-3">
                        {/* User Message Bubble */}
                        <div className="flex justify-end">
                          <div className="max-w-[80%] space-y-1">
                            <div className="flex items-center justify-end gap-2 text-xs text-on-surface-variant">
                              <span>Anda / User</span>
                              <User className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="bg-primary text-white p-3.5 rounded-2xl rounded-tr-none shadow-md shadow-primary/20 text-sm leading-relaxed">
                              {msg.user_message}
                            </div>
                            <p className="text-[10px] text-on-surface-variant/60 text-right">
                              {formatDate(msg.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Agent Response Bubble */}
                        <div className="flex justify-start">
                          <div className="max-w-[85%] space-y-1">
                            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                              <Bot className="w-3.5 h-3.5 text-purple-400" />
                              <span className="font-bold text-purple-400">{msg.agent_type || "AI Agent"}</span>
                              {msg.intent && (
                                <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] px-2 py-0.5 rounded uppercase font-semibold">
                                  {msg.intent}
                                </span>
                              )}
                            </div>
                            <div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-border/50 text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.agent_response}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-on-surface-variant/60 px-1">
                              <span>{formatDate(msg.created_at)}</span>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-on-surface-variant hover:text-rose-400 transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-on-surface-variant text-sm">
                Pilih sesi di sebelah kiri untuk melihat percakapan.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TABLE LIST LOG VIEW MODE */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-border/40 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Cari isi pesan, session ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-on-surface-variant">Intent:</span>
                <select
                  value={intentFilter}
                  onChange={(e) => setIntentFilter(e.target.value)}
                  className="bg-surface/60 border border-border/40 rounded-lg text-xs py-1.5 px-3 text-foreground focus:outline-none"
                >
                  <option value="all">Semua Intent</option>
                  {uniqueIntents.map((it) => (
                    <option key={it} value={it!}>{it}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-on-surface-variant">Agent:</span>
                <select
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className="bg-surface/60 border border-border/40 rounded-lg text-xs py-1.5 px-3 text-foreground focus:outline-none"
                >
                  <option value="all">Semua Agent</option>
                  {uniqueAgents.map((ag) => (
                    <option key={ag} value={ag}>{ag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-2xl border border-border/40 overflow-hidden">
            {filteredHistories.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant">
                Tidak ada data log chat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface/60 border-b border-border/40 text-on-surface-variant font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Waktu & Session ID</th>
                      <th className="px-6 py-4">Pesan User</th>
                      <th className="px-6 py-4">Respon Agent AI</th>
                      <th className="px-6 py-4">Intent & Agent</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredHistories.map((item) => (
                      <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                        <td className="px-6 py-4 text-xs">
                          <p className="font-mono font-bold text-foreground">{item.session_id}</p>
                          <p className="text-on-surface-variant mt-1">{formatDate(item.created_at)}</p>
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-foreground text-sm line-clamp-3">{item.user_message}</p>
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-on-surface-variant text-sm line-clamp-3">{item.agent_response}</p>
                        </td>

                        <td className="px-6 py-4 text-xs space-y-1">
                          <span className="inline-block bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-semibold uppercase">
                            {item.intent || "LAINNYA"}
                          </span>
                          <p className="text-on-surface-variant/80 font-medium">{item.agent_type}</p>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteMessage(item.id)}
                            title="Hapus Log"
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-on-surface-variant hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
