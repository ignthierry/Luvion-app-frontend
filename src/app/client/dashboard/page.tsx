"use client";

import { useEffect, useState } from "react";
import { fetchApi, STORAGE_BASE_URL } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/swal";
import { 
  Activity, 
  CreditCard, 
  Receipt, 
  PlusCircle, 
  Send, 
  ExternalLink, 
  Printer, 
  Loader2, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Layers,
  FileText,
  Building2,
  Filter,
  Palette
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface ClientOrder {
  id: number;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  website: string | null;
  plan_name: string;
  billing_cycle: string;
  users_count: number;
  purpose: string | null;
  addons: any | null;
  integration_needs: string | null;
  subdomain: string | null;
  logo_path: string | null;
  theme_color: string | null;
  notes: string | null;
  timeline: string | null;
  status: string;
  payment_status?: string;
  pricing_payment?: string | number | null;
  created_at: string;
}

interface Invoice {
  id: number;
  client_order_id: number;
  invoice_number: string;
  amount: number | string;
  status: string;
  due_date: string | null;
  payment_url: string | null;
  snap_token: string | null;
  payment_type?: string | null;
  paid_at?: string | null;
  created_at: string;
  client_order?: ClientOrder;
}

interface CustomerRequest {
  id: number;
  request_type: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function ClientDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [userName, setUserName] = useState("");

  // Filters & Tabs state
  const [selectedOrderId, setSelectedOrderId] = useState<number | "all">("all");
  const [invoiceFilterOrderId, setInvoiceFilterOrderId] = useState<number | "all">("all");

  // Request form state
  const [requestType, setRequestType] = useState("addon");
  const [requestOrderId, setRequestOrderId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem("user_name") || "Pelanggan Luvion");
    loadClientData();
  }, []);

  const loadClientData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi("/client/dashboard");
      setStats(res.stats);
      setOrders(res.orders || []);
      setInvoices(res.invoices || []);
      setRequests(res.requests || []);
      if (res.orders && res.orders.length > 0) {
        setRequestOrderId(res.orders[0].id);
      }
    } catch (e: any) {
      console.error(e);
      showError("Gagal Loading", e.message || "Gagal memuat data dashboard klien.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showError("Data Tidak Lengkap", "Harap isi judul request.");
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const res = await fetchApi("/client/requests", {
        method: "POST",
        body: JSON.stringify({
          request_type: requestType,
          title,
          description,
          client_order_id: requestOrderId || (orders.length > 0 ? orders[0].id : null),
        }),
      });

      if (res.status === 'success') {
        showSuccess("Request Terkirim", "Request paket/fitur baru berhasil dikirim ke tim Luvion.");
        setTitle("");
        setDescription("");
        loadClientData();
      } else {
        showError("Gagal", res.message || "Terjadi kesalahan.");
      }
    } catch (err: any) {
      showError("Gagal", err.message || "Gagal mengirim request.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Filtered orders & invoices
  const displayedOrders = selectedOrderId === "all" 
    ? orders 
    : orders.filter(o => o.id === selectedOrderId);

  const filteredInvoices = invoiceFilterOrderId === "all" 
    ? invoices 
    : invoices.filter(inv => inv.client_order_id === invoiceFilterOrderId);

  return (
    <div className="space-y-8">
      {/* Header Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary/20 via-surface to-surface p-6 rounded-3xl border border-primary/20 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Client Portal Active
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Selamat Datang, {userName}!</h1>
          <p className="text-on-surface-variant text-sm">
            Semua {orders.length} proyek langganan SaaS dan {invoices.length} invoice tagihan Anda dikelompokkan secara otomatis di sini.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-500 uppercase">{orders.length} Proyek</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Total Proyek / Pesanan</p>
          <h3 className="text-xl font-black text-foreground mt-1">{orders.length} Layanan Active</h3>
        </div>

        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Subdomain</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Subdomain Utama</p>
          <h3 className="text-sm font-bold text-foreground mt-1 truncate">{stats?.subdomain || '-'}</h3>
        </div>

        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Receipt className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${stats?.unpaid_invoices > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
              {stats?.unpaid_invoices > 0 ? `${stats.unpaid_invoices} Belum Dibayar` : 'Semua Lunas'}
            </span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Total Invoice Tagihan</p>
          <h3 className="text-xl font-black text-foreground mt-1">{invoices.length} Tagihan</h3>
        </div>

        <div className="bg-surface border border-border/40 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-500">Total Lunas</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Total Pembayaran Lunas</p>
          <h3 className="text-lg font-black text-foreground mt-1">{stats?.total_spent || 'Rp 0'}</h3>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Projects & Invoices */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Projects & Subscriptions Section */}
          <div className="glass-panel border-border/40 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Daftar Proyek / Layanan Saya ({orders.length})
                </h2>
                <p className="text-xs text-on-surface-variant">Seluruh orderan SaaS yang terdaftar pada email akun Anda</p>
              </div>

              {/* Project Filter Tabs */}
              {orders.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 bg-surface/80 p-1 rounded-xl border border-border/40 text-xs">
                  <button
                    onClick={() => setSelectedOrderId("all")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${selectedOrderId === "all" ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-foreground'}`}
                  >
                    Semua ({orders.length})
                  </button>
                  {orders.map((ord, idx) => (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${selectedOrderId === ord.id ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-foreground'}`}
                    >
                      {ord.company_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List of Projects */}
            <div className="space-y-6">
              {displayedOrders.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant text-sm">
                  Belum ada data proyek langganan.
                </div>
              ) : (
                displayedOrders.map((ord, idx) => (
                  <div 
                    key={ord.id}
                    className="p-5 rounded-2xl bg-surface/50 border border-border/40 space-y-4 hover:border-primary/40 transition-all shadow-sm"
                  >
                    {/* Project Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/30 pb-3">
                      <div className="flex items-center gap-3">
                        {ord.logo_path ? (
                          <img 
                            src={ord.logo_path.startsWith('http') ? ord.logo_path : `${STORAGE_BASE_URL}/${ord.logo_path}`} 
                            alt={ord.company_name}
                            className="w-10 h-10 object-contain rounded-lg border border-border/40 bg-white p-1"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                            {ord.company_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-extrabold text-foreground text-base">{ord.company_name}</h3>
                          <p className="text-xs text-on-surface-variant">Kontak: {ord.full_name} ({ord.email})</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                          Paket {ord.plan_name} ({ord.billing_cycle})
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          ord.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          ord.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Project Specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-background/50 p-3 rounded-xl border border-border/30">
                        <span className="text-on-surface-variant block mb-0.5">Subdomain Aplikasi:</span>
                        <span className="font-bold text-foreground font-mono">
                          {ord.subdomain ? (ord.subdomain.includes('.') ? ord.subdomain : `${ord.subdomain}.luvion.my.id`) : '-'}
                        </span>
                      </div>

                      <div className="bg-background/50 p-3 rounded-xl border border-border/30">
                        <span className="text-on-surface-variant block mb-0.5">Lisensi User:</span>
                        <span className="font-bold text-foreground">{ord.users_count} User Lisensi</span>
                      </div>

                      <div className="bg-background/50 p-3 rounded-xl border border-border/30">
                        <span className="text-on-surface-variant block mb-0.5">Harga Langganan:</span>
                        <span className="font-bold text-emerald-400">
                          {ord.pricing_payment ? `Rp ${Number(ord.pricing_payment).toLocaleString('id-ID')}` : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {(ord.purpose || ord.integration_needs || ord.notes || ord.theme_color) && (
                      <div className="pt-2 border-t border-border/20 space-y-2 text-xs">
                        {ord.theme_color && (
                          <div className="flex items-center gap-2">
                            <span className="text-on-surface-variant">Warna Tema:</span>
                            <span className="inline-block w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: ord.theme_color }} />
                            <span className="font-mono text-foreground font-semibold">{ord.theme_color}</span>
                          </div>
                        )}
                        {ord.purpose && (
                          <p><span className="text-on-surface-variant">Tujuan Utama:</span> <span className="text-foreground">{ord.purpose}</span></p>
                        )}
                        {ord.integration_needs && (
                          <p><span className="text-on-surface-variant">Integrasi API:</span> <span className="text-foreground">{ord.integration_needs}</span></p>
                        )}
                        {ord.notes && (
                          <p><span className="text-on-surface-variant">Catatan Tambahan:</span> <span className="text-foreground">{ord.notes}</span></p>
                        )}
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setInvoiceFilterOrderId(ord.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface hover:bg-surface-variant text-foreground border border-border/50 transition-all flex items-center gap-1.5"
                      >
                        <Filter className="w-3.5 h-3.5 text-primary" /> Filter Tagihan Proyek Ini
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Invoice History Section */}
          <div className="glass-panel border-border/40 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-500" />
                  Riwayat Tagihan & Pembayaran ({filteredInvoices.length})
                </h2>
                <p className="text-xs text-on-surface-variant">Daftar invoice dan status pembayaran Midtrans untuk seluruh proyek Anda</p>
              </div>

              {/* Invoice Filter Select */}
              {orders.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-semibold">Proyek:</span>
                  <select
                    value={invoiceFilterOrderId}
                    onChange={(e) => setInvoiceFilterOrderId(e.target.value === "all" ? "all" : Number(e.target.value))}
                    className="bg-surface border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground font-semibold focus:outline-none"
                  >
                    <option value="all">Semua Proyek ({invoices.length})</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>{o.company_name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/50 text-on-surface-variant border-b border-border/30 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-semibold">No. Invoice</th>
                    <th className="px-4 py-3 font-semibold">Proyek / Perusahaan</th>
                    <th className="px-4 py-3 font-semibold">Tanggal</th>
                    <th className="px-4 py-3 font-semibold">Nominal</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-on-surface-variant text-xs">
                        Belum ada tagihan invoice untuk proyek ini.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-bold text-foreground font-mono text-xs">{inv.invoice_number}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="font-bold text-foreground block">{inv.client_order?.company_name || 'Proyek Luvion'}</span>
                          <span className="text-[10px] text-on-surface-variant">{inv.client_order?.plan_name}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant">
                          <div>{inv.created_at ? format(new Date(inv.created_at), "dd MMM yyyy") : '-'}</div>
                          {inv.due_date && <div className="text-[10px] text-zinc-500">Jth Tempo: {format(new Date(inv.due_date), "dd MMM yyyy")}</div>}
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground">
                          Rp {Number(inv.amount).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                          {inv.status === 'paid' ? (
                            <span className="px-2.5 py-1 rounded text-[11px] font-extrabold bg-green-500/20 text-green-400 border border-green-500/30">
                              LUNAS
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded text-[11px] font-extrabold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                              BELUM DIBAYAR
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {inv.status !== 'paid' && inv.payment_url && (
                              <a
                                href={inv.payment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Bayar Midtrans</span>
                              </a>
                            )}
                            <a
                              href={`/invoices/${inv.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-surface hover:bg-surface-variant text-foreground border border-border/50 transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Lihat / PDF</span>
                            </a>
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

        {/* Right 1 Col: Request Feature & Status */}
        <div className="space-y-6">
          
          {/* Submit Request Form */}
          <div className="glass-panel border-border/40 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-border/40 pb-3">
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                Request Fitur & Upgrade
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">Ajukan penambahan fitur, modul add-on, atau upgrade paket langganan Anda.</p>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              {/* Target Project Dropdown */}
              {orders.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-on-surface-variant mb-1 block">Pilih Proyek Langganan</label>
                  <select
                    value={requestOrderId}
                    onChange={(e) => setRequestOrderId(Number(e.target.value))}
                    className="w-full bg-surface border border-border/50 rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>{o.company_name} ({o.plan_name})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1 block">Jenis Request</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full bg-surface border border-border/50 rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="addon">Modul Add-on Baru</option>
                  <option value="upgrade_plan">Upgrade Paket Langganan</option>
                  <option value="extra_licenses">Tambah Kuota User / Staf</option>
                  <option value="custom_feature">Fitur Kustom Aplikasi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1 block">Judul Request <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Request Integrasi Accurate POS"
                  className="w-full bg-surface border border-border/50 rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1 block">Detail Kebutuhan / Catatan</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan penjelasan mengenai fitur atau modul tambahan yang dibutuhkan..."
                  className="w-full bg-surface border border-border/50 rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRequest}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                {isSubmittingRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSubmittingRequest ? 'Kirim Request...' : 'Kirim Request ke Tim Luvion'}</span>
              </button>
            </form>
          </div>

          {/* List of Submitted Requests */}
          <div className="glass-panel border-border/40 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-border/40 pb-3 flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Status Request Saya ({requests.length})</h2>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {requests.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-4">Belum ada request fitur yang diajukan.</p>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="p-3 rounded-xl bg-surface/50 border border-border/30 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground line-clamp-1">{req.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                        req.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        req.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    {req.description && (
                      <p className="text-xs text-on-surface-variant line-clamp-2">{req.description}</p>
                    )}
                    <p className="text-[10px] text-on-surface-variant/70">
                      {req.created_at ? format(new Date(req.created_at), "dd MMM yyyy, HH:mm") : '-'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
