"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/swal";
import { 
  Inbox, 
  Loader2, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  Bug,
  PlusCircle,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { format } from "date-fns";

interface CustomerRequestData {
  id: number;
  user_id: number | null;
  email: string;
  client_order_id: number | null;
  request_type: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
  client_order?: {
    id: number;
    company_name: string;
    plan_name: string;
    full_name: string;
  } | null;
}

export default function AdminCustomerRequestsPage() {
  const [requests, setRequests] = useState<CustomerRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi("/customer-requests");
      setRequests(data);
    } catch (e: any) {
      console.error(e);
      showError("Gagal Memuat Data", e.message || "Gagal mengambil daftar request pelanggan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetchApi(`/customer-requests/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === "success") {
        showSuccess("Status Diperbarui", `Status request berhasil diubah menjadi ${newStatus.toUpperCase()}`);
        loadRequests();
      } else {
        showError("Gagal", res.message || "Gagal memperbarui status.");
      }
    } catch (err: any) {
      showError("Gagal", err.message || "Terjadi kesalahan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus request ini?")) return;
    try {
      await fetchApi(`/customer-requests/${id}`, { method: "DELETE" });
      showSuccess("Berhasil Dihapus", "Request telah dihapus.");
      loadRequests();
    } catch (err: any) {
      showError("Gagal Hapus", err.message || "Terjadi kesalahan.");
    }
  };

  // Filtering
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.client_order?.company_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesType = typeFilter === "all" || req.request_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Count stats
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'addon':
        return <span className="px-2.5 py-1 rounded font-bold text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">Modul Add-on</span>;
      case 'upgrade_plan':
        return <span className="px-2.5 py-1 rounded font-bold text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">Upgrade Paket</span>;
      case 'extra_licenses':
        return <span className="px-2.5 py-1 rounded font-bold text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20">Tambah Lisensi</span>;
      case 'bug_report':
        return <span className="px-2.5 py-1 rounded font-bold text-xs bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1"><Bug className="w-3 h-3" /> Report Bug</span>;
      default:
        return <span className="px-2.5 py-1 rounded font-bold text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">Fitur Kustom</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full font-bold text-xs bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Disetujui</span>;
      case 'in_progress':
        return <span className="px-3 py-1 rounded-full font-bold text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1"><Clock className="w-3.5 h-3.5 animate-spin" /> Diproses</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full font-bold text-xs bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Ditolak</span>;
      default:
        return <span className="px-3 py-1 rounded-full font-bold text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Menunggu (Pending)</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <Inbox className="w-6 h-6 text-primary" />
          Request by User (Client Portal)
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Daftar pengajuan add-on, request fitur baru, upgrade paket, dan laporan bug yang dikirim pelanggan dari Client Portal.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">Total</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Total Request Masuk</p>
          <h3 className="text-2xl font-black text-foreground mt-1">{totalCount} Request</h3>
        </div>

        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">Perlu Respons</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Menunggu (Pending)</p>
          <h3 className="text-2xl font-black text-amber-400 mt-1">{pendingCount} Request</h3>
        </div>

        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-500">Pengerjaan</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Sedang Diproses</p>
          <h3 className="text-2xl font-black text-foreground mt-1">{inProgressCount} Request</h3>
        </div>

        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-500">Selesai</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Disetujui / Selesai</p>
          <h3 className="text-2xl font-black text-green-400 mt-1">{approvedCount} Request</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-border/40">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul request, email pelanggan, atau nama proyek..."
            className="w-full bg-surface border border-border/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-on-surface-variant" />
            <span className="text-xs font-semibold text-on-surface-variant">Jenis:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface border border-border/40 rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="all">Semua Jenis</option>
              <option value="addon">Modul Add-on</option>
              <option value="upgrade_plan">Upgrade Paket</option>
              <option value="extra_licenses">Tambah Lisensi</option>
              <option value="custom_feature">Fitur Kustom</option>
              <option value="bug_report">Report Bug</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-variant">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-border/40 rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending (Menunggu)</option>
              <option value="in_progress">In Progress (Diproses)</option>
              <option value="approved">Approved (Disetujui)</option>
              <option value="rejected">Rejected (Ditolak)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="glass-panel rounded-3xl border border-border/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/50 text-on-surface-variant border-b border-border/30 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 font-bold">Judul & Kebutuhan Request</th>
                <th className="px-5 py-4 font-bold">Pelanggan / Klien</th>
                <th className="px-5 py-4 font-bold">Proyek Langganan</th>
                <th className="px-5 py-4 font-bold">Jenis</th>
                <th className="px-5 py-4 font-bold">Tanggal</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-on-surface-variant text-xs">
                    Tidak ada request pelanggan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-extrabold text-foreground text-sm">{req.title}</p>
                      {req.description && (
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{req.description}</p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="font-bold text-foreground">{req.user?.name || req.email}</p>
                          <p className="text-[11px] text-on-surface-variant">{req.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      {req.client_order ? (
                        <div>
                          <span className="font-bold text-foreground block">{req.client_order.company_name}</span>
                          <span className="text-[10px] text-primary font-medium">Paket {req.client_order.plan_name}</span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/60 italic">-</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {getTypeBadge(req.request_type)}
                    </td>

                    <td className="px-5 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                      {req.created_at ? format(new Date(req.created_at), "dd MMM yyyy, HH:mm") : '-'}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={req.status}
                          disabled={updatingId === req.id}
                          onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                          className="bg-surface border border-border/50 rounded-xl px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                        >
                          <option value="pending">PENDING</option>
                          <option value="in_progress">IN PROGRESS</option>
                          <option value="approved">APPROVED</option>
                          <option value="rejected">REJECTED</option>
                        </select>
                        {updatingId === req.id && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
