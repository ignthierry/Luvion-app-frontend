"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi, API_BASE_URL } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/swal";
import { format } from "date-fns";
import { Loader2, Printer, ArrowLeft, CreditCard, ExternalLink, MessageSquare, Mail } from "lucide-react";
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
  status: string;
  payment_status?: string;
  pricing_payment?: string | number | null;
  payment_url?: string | null;
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
  client_order: ClientOrder;
}

export default function PublicInvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingWaha, setIsSendingWaha] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("auth_token"));
    }
    if (id) {
      loadInvoice(id as string);
    }
  }, [id]);

  const loadInvoice = async (invoiceId: string) => {
    try {
      // Use direct fetch so guests can view without auth errors
      const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Invoice tidak ditemukan");
      const data = await res.json();
      setInvoice(data);
    } catch (e) {
      console.error("Failed to load invoice", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWaha = async () => {
    if (!invoice) return;
    setIsSendingWaha(true);
    try {
      const res = await fetchApi(`/invoices/${invoice.id}/send-whatsapp`, {
        method: "POST"
      });
      if (res.status === 'success') {
        showSuccess("WhatsApp Terkirim", res.message || "Pesan WhatsApp berhasil dikirim via WAHA API!");
      } else {
        showError("Gagal Kirim WhatsApp", res.message || "Terjadi kesalahan");
      }
    } catch (err: any) {
      showError("Gagal Kirim WhatsApp", err.message || "Terjadi kesalahan saat mengirim pesan WhatsApp.");
    } finally {
      setIsSendingWaha(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!invoice || !invoice.client_order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-surface rounded-2xl border border-border/40 max-w-md shadow-xl">
          <p className="text-xl font-bold text-foreground mb-2">Invoice Tidak Ditemukan</p>
          <p className="text-sm text-on-surface-variant mb-6">Invoice yang Anda cari tidak ditemukan atau telah dihapus.</p>
          <Link href="/" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const order = invoice.client_order;
  const invoiceNumber = invoice.invoice_number;
  const totalPricing = Number(invoice.amount || 0);
  const publicInvoiceUrl = typeof window !== "undefined" ? window.location.href : `https://luvion.my.id/invoices/${invoice.id}`;

  return (
    <div className="min-h-screen bg-white text-zinc-900 print:bg-white p-4 sm:p-8 md:p-12 flex flex-col items-center">
      
      {/* Action Bar Header (Hidden on Print) */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
        {isLoggedIn ? (
          <Link 
            href="/dashboard/orders"
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-all font-semibold text-sm shadow-sm border border-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Pesanan
          </Link>
        ) : (
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-all font-semibold text-sm shadow-sm border border-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda Luvion
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Kirim WAHA (jika admin) */}
          {isLoggedIn && (
            <button
              onClick={handleSendWaha}
              disabled={isSendingWaha}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-sm shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              title="Kirim pesan invoice langsung via WAHA API"
            >
              {isSendingWaha ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              <span>{isSendingWaha ? 'Mengirim WA...' : 'Kirim WA (WAHA)'}</span>
            </button>
          )}

          {/* Kirim Email */}
          <a
            href={`mailto:${order.email}?subject=Invoice Tagihan Luvion SaaS - ${order.company_name}&body=${encodeURIComponent(`Halo ${order.full_name},\n\nBerikut adalah tagihan invoice #${invoice.invoice_number} untuk layanan Luvion SaaS (${order.plan_name}).\n\nTotal Tagihan: Rp ${new Intl.NumberFormat('id-ID').format(totalPricing)}\nStatus: ${invoice.status.toUpperCase()}\nLink Invoice: ${publicInvoiceUrl}\n\nTerima kasih,\nTim Luvion`)}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold text-sm shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
            title="Kirim Invoice via Email"
          >
            <Mail className="w-4 h-4" />
            <span>Kirim Email</span>
          </a>

          {/* Bayar via Midtrans (jika belum lunas) */}
          {invoice.payment_url && invoice.status !== 'paid' && (
            <a
              href={invoice.payment_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-extrabold text-sm shadow-lg shadow-teal-600/30 hover:scale-[1.03] active:scale-[0.98]"
            >
              <CreditCard className="w-4 h-4" /> Bayar via Midtrans
            </a>
          )}

          {/* Cetak / Simpan PDF */}
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all font-bold text-sm shadow-md shadow-zinc-900/20 hover:scale-[1.02] active:scale-[0.98]"
            title="Cetak atau Simpan Dokumen sebagai PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Container */}
      <div className="w-full max-w-4xl bg-white border border-zinc-200 print:border-none rounded-2xl p-6 sm:p-10 shadow-sm print:shadow-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-zinc-200 pb-8 mb-8">
          <div>
            <img 
              src="/Banner.png" 
              alt="Luvion Banner Logo" 
              className="h-14 w-auto object-contain mb-2"
            />
            <p className="text-xs font-semibold text-zinc-700">Perum. Shojiland Blok EJ.02 Candi Sidoarjo</p>
            <p className="text-xs text-zinc-500">Telp/WA: 081357748559 | Email: admin@luvion.my.id</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-zinc-300 uppercase tracking-widest mb-2">Invoice</h2>
            <p className="text-sm font-bold text-zinc-800">#{invoiceNumber}</p>
            <p className="text-sm text-zinc-500">Tgl Dibuat: {invoice.created_at ? format(new Date(invoice.created_at), "dd MMMM yyyy") : '-'}</p>
            <p className="text-sm text-zinc-500">Jatuh Tempo: {invoice.due_date ? format(new Date(invoice.due_date), "dd MMMM yyyy") : '-'}</p>
          </div>
        </div>

        {/* Bill To & Info */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">Ditagihkan Kepada:</p>
            <p className="font-bold text-lg text-zinc-800">{order.company_name}</p>
            <p className="text-zinc-600">{order.full_name}</p>
            <p className="text-zinc-600">{order.email}</p>
            <p className="text-zinc-600">{order.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">Status Pembayaran:</p>
            {invoice.status === 'paid' ? (
              <div className="flex flex-col items-end gap-1">
                <span className="inline-block px-4 py-1.5 rounded-lg bg-green-100 text-green-700 font-bold text-sm border border-green-300">LUNAS</span>
                {invoice.paid_at && (
                  <span className="text-[11px] font-semibold text-green-700">
                    Pada {format(new Date(invoice.paid_at), "dd MMM yyyy, HH:mm")}
                  </span>
                )}
                {invoice.payment_type && (
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                    VIA {invoice.payment_type.replace('_', ' ')}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <span className="inline-block px-4 py-1.5 rounded-lg bg-red-100 text-red-700 font-bold text-sm border border-red-300">BELUM DIBAYAR</span>
                {invoice.due_date && (
                  <span className="text-[11px] text-red-600 font-medium">
                    Jatuh Tempo: {format(new Date(invoice.due_date), "dd MMM yyyy")}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Item Table */}
        <table className="w-full text-left border-collapse mb-12">
          <thead>
            <tr className="border-b-2 border-zinc-800 text-zinc-800">
              <th className="py-3 px-2 font-bold w-12">No.</th>
              <th className="py-3 px-2 font-bold">Deskripsi Layanan</th>
              <th className="py-3 px-2 font-bold">Lisensi</th>
              <th className="py-3 px-2 font-bold text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-200">
              <td className="py-4 px-2 text-zinc-600">1</td>
              <td className="py-4 px-2">
                <p className="font-bold text-zinc-800">Langganan {order.plan_name}</p>
                <p className="text-sm text-zinc-500">Siklus: {order.billing_cycle}</p>
              </td>
              <td className="py-4 px-2 text-zinc-600">{order.users_count} Users</td>
              <td className="py-4 px-2 text-right font-bold text-zinc-800">
                Rp {new Intl.NumberFormat('id-ID').format(totalPricing)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-zinc-200">
              <span className="text-zinc-600">Subtotal:</span>
              <span className="font-bold text-zinc-800">Rp {new Intl.NumberFormat('id-ID').format(totalPricing)}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-zinc-800">
              <span className="text-lg font-bold text-zinc-800">TOTAL:</span>
              <span className="text-lg font-bold text-primary">Rp {new Intl.NumberFormat('id-ID').format(totalPricing)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {invoice.payment_url && invoice.status !== 'paid' && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 print:border-none print:bg-transparent print:p-0 mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
              <div>
                <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600 print:hidden" />
                  Pembayaran Online via Midtrans
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Selesaikan pembayaran secara cepat dan aman melalui berbagai metode pembayaran (QRIS, Transfer Bank, E-Wallet, dll).
                </p>
              </div>
              <a 
                href={invoice.payment_url} 
                target="_blank" 
                rel="noreferrer" 
                className="print:hidden inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-lg shadow-teal-600/30 transition-all hover:scale-105 text-sm"
              >
                <ExternalLink className="w-4 h-4" /> Bayar Sekarang (Midtrans)
              </a>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-200/60 print:bg-transparent print:p-0 print:border-none">
              <span className="text-xs font-semibold text-emerald-800 block mb-1">Link Pembayaran Langsung:</span>
              <a href={invoice.payment_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-mono text-xs break-all">
                {invoice.payment_url}
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-zinc-200 pt-8 text-center text-zinc-500 text-xs space-y-1">
          <p className="font-semibold text-zinc-700">Terima kasih telah berbisnis dengan Luvion.</p>
          <p>Jika Anda memiliki pertanyaan mengenai invoice ini, silakan hubungi <a href="mailto:cs@luvion.my.id" className="text-primary hover:underline font-medium">cs@luvion.my.id</a> atau WhatsApp <span className="font-medium text-zinc-700">081357748559</span></p>
        </div>

      </div>
    </div>
  );
}
