"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/apiClient";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Loader2, Printer, ArrowLeft, CreditCard, ExternalLink,
  MessageSquare, Mail, CheckCircle2, Clock, Landmark, Building2, ShieldCheck
} from "lucide-react";
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

const formatRp = (n: number) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(n);

const fmtDate = (d: string | null) =>
  d ? format(new Date(d), "dd MMMM yyyy", { locale: idLocale }) : "-";

export default function PublicInvoicePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingWaha, setIsSendingWaha] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("user_role"));
      if (searchParams.get("print") === "1") {
        const t = setTimeout(() => window.print(), 600);
        return () => clearTimeout(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInvoice = async (invoiceId: string) => {
    try {
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

  useEffect(() => {
    if (id) loadInvoice(id as string);
  }, [id]);

  const handleSendWaha = async () => {
    if (!invoice) return;
    setIsSendingWaha(true);
    try {
      const res = await fetch(`${API_BASE_URL}/invoices/${invoice.id}/send-whatsapp`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (data.status === "success") {
        alert("✅ WhatsApp Terkirim: " + (data.message || "Pesan berhasil dikirim via WAHA API!"));
      } else {
        alert("⚠️ Gagal: " + (data.message || "Terjadi kesalahan"));
      }
    } catch (err: any) {
      alert("❌ Gagal Kirim WhatsApp: " + (err.message || "Terjadi kesalahan."));
    } finally {
      setIsSendingWaha(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-[#0058bc] animate-spin" />
      </div>
    );
  }

  if (!invoice || !invoice.client_order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 max-w-md shadow-xl">
          <p className="text-xl font-bold text-slate-800 mb-2">Invoice Tidak Ditemukan</p>
          <p className="text-sm text-slate-500 mb-6">Invoice yang Anda cari tidak ditemukan atau telah dihapus.</p>
          <Link href="/" className="px-6 py-2.5 bg-[#0058bc] text-white rounded-xl font-bold text-sm inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const order = invoice.client_order;
  const invoiceNumber = invoice.invoice_number;
  const totalPricing = Number(invoice.amount || 0);
  const isPaid = invoice.status === "paid";
  const paymentType = invoice.payment_type ? invoice.payment_type.replace("_", " ") : null;

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white py-4 sm:py-10 print:py-0 print:m-0">
      <div className="max-w-[210mm] mx-auto px-2 sm:px-6 print:max-w-none print:p-0 print:mx-0">

        {/* ─── Action Bar (never printed) ─── */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 print:hidden">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all font-semibold text-xs sm:text-sm shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSendWaha}
              disabled={isSendingWaha}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {isSendingWaha ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline sm:inline">Kirim WA</span>
            </button>
            <a
              href={`mailto:${order.email}?subject=Invoice Tagihan Luvion - ${order.company_name}&body=${encodeURIComponent(
                `Halo ${order.full_name},\n\nBerikut tagihan invoice #${invoice.invoice_number} untuk layanan Luvion (${order.plan_name}).\n\nTotal Tagihan: ${formatRp(totalPricing)}\nStatus: ${invoice.status.toUpperCase()}\n${invoice.payment_url ? `Link Pembayaran: ${invoice.payment_url}\n` : ""}\nTerima kasih,\nTim Luvion`
              )}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
            {invoice.payment_url && !isPaid && (
              <a
                href={invoice.payment_url}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20"
              >
                <CreditCard className="w-3.5 h-3.5" /> Bayar
              </a>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-bold text-xs sm:text-sm shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak
            </button>
          </div>
        </div>

        {/* ─── Invoice Document (A4) ─── */}
        <div className="bg-white shadow-xl rounded-2xl print:shadow-none print:rounded-none invoice-sheet overflow-hidden">

          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-[#0058bc] via-[#0070eb] to-teal-400 print:h-1.5"></div>

          {/* Header */}
          <div className="px-5 sm:px-12 pt-8 sm:pt-12 print:pt-8">
            <div className="flex flex-row justify-between items-start gap-4 sm:gap-8">
              {/* Company */}
              <div className="flex flex-col items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <img
                  src="/Banner.png"
                  alt="Luvion"
                  className="h-10 sm:h-16 print:h-16 w-auto object-contain shrink-0"
                />
                <div className="hidden sm:block print:block">
                  <p className="text-[13px] font-bold text-slate-800 leading-snug">Luvion — Platform Scale Up Berbasis AI</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Perum. Shojiland Blok EJ.02, Candi, Sidoarjo
                    <br />
                    Telp/WA: +628197965599 | Email: admin@luvion.my.id
                  </p>
                </div>
              </div>

              {/* Invoice title */}
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-100 rounded-lg mb-1 sm:mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0058bc]" />
                  <span className="text-[9px] sm:text-xs font-extrabold tracking-widest text-slate-700 uppercase">Invoice</span>
                </div>
                <h2 className="text-sm sm:text-3xl font-extrabold text-slate-900 tracking-tight sm:whitespace-nowrap break-all sm:break-normal">
                  {invoiceNumber}
                </h2>
                <p className="text-[8px] sm:text-xs font-semibold text-[#0058bc] mt-0.5 uppercase tracking-wider">
                  Dokumen Resmi Tagihan
                </p>
              </div>
            </div>
          </div>

          {/* Bill To + Status */}
          <div className="px-5 sm:px-12 mt-6 sm:mt-10 print:mt-8">
            <div className="flex flex-row justify-between items-start gap-4 sm:gap-6">
              <div className="flex-1 min-w-0 sm:min-w-[240px]">
                <div className="flex items-center gap-2 mb-2.5">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 h-4 text-[#0058bc]" />
                  <p className="text-[9px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500">Ditagihkan Kepada</p>
                </div>
                <div className="border-l-[3px] border-[#0058bc] pl-2.5 sm:pl-3.5">
                  <p className="font-bold text-sm sm:text-lg text-slate-900 truncate">{order.company_name || "—"}</p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 truncate">{order.full_name}</p>
                  <p className="text-[11px] sm:text-sm text-slate-500 truncate">{order.email}</p>
                  {order.phone && <p className="text-[11px] sm:text-sm text-slate-500 truncate">{order.phone}</p>}
                </div>
              </div>

              {/* Payment status */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 mb-2.5 justify-end">
                  <span className="text-[9px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500">Status Pembayaran</span>
                </div>
                {isPaid ? (
                  <div className="inline-flex flex-col items-end gap-1 bg-emerald-50 border border-emerald-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs sm:text-sm uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> LUNAS
                    </span>
                    {invoice.paid_at && (
                      <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-700 text-right">
                        Pada {format(new Date(invoice.paid_at), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                      </span>
                    )}
                    {paymentType && (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Via {paymentType}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex flex-col items-end gap-1 bg-amber-50 border border-amber-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                    <span className="inline-flex items-center gap-1.5 text-amber-700 font-extrabold text-xs sm:text-sm uppercase tracking-wide">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Belum Dibayar
                    </span>
                    {invoice.due_date && (
                      <span className="text-[9px] sm:text-[11px] font-semibold text-amber-700 text-right">
                        Jatuh tempo: {fmtDate(invoice.due_date)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-5 sm:px-12 mt-8 sm:mt-10 print:mt-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0058bc]">
                  <th className="py-3 px-2 sm:px-4 font-bold !text-white text-[10px] sm:text-xs uppercase tracking-wider rounded-l-lg w-8 sm:w-12 text-center">No</th>
                  <th className="py-3 px-2 sm:px-4 font-bold !text-white text-[10px] sm:text-xs uppercase tracking-wider">Deskripsi Layanan</th>
                  <th className="py-3 px-2 sm:px-4 font-bold !text-white text-[10px] sm:text-xs uppercase tracking-wider">Lisensi</th>
                  <th className="py-3 px-2 sm:px-4 font-bold !text-white text-[10px] sm:text-xs uppercase tracking-wider text-right rounded-r-lg">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 bg-white">
                  <td className="py-4 px-2 sm:px-4 text-center text-slate-500 font-semibold text-xs sm:text-sm">1</td>
                  <td className="py-4 px-2 sm:px-4">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {(invoice as any).description || `Langganan ${order.plan_name}`}
                    </p>
                    <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">Siklus: {order.billing_cycle || "Bulanan"}</p>
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap">{order.users_count} Users</td>
                  <td className="py-4 px-2 sm:px-4 text-right font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">{formatRp(totalPricing)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-5 sm:px-12 mt-5 sm:mt-6 print:mt-5 flex justify-end">
            <div className="w-full sm:w-80">
              <div className="flex justify-between py-2.5 border-b border-slate-200 gap-2">
                <span className="text-xs sm:text-sm text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">{formatRp(totalPricing)}</span>
              </div>
              <div className="flex justify-between py-3.5 gap-2">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">Total Tagihan</span>
                <span className="text-base sm:text-xl font-extrabold text-[#0058bc]">{formatRp(totalPricing)}</span>
              </div>
            </div>
          </div>

          {/* Payment info (unpaid only) */}
          {invoice.payment_url && !isPaid && (
            <div className="mx-5 sm:mx-12 mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-2xl border border-emerald-200 print:hidden">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h3 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Pembayaran Online via Xendit
                </h3>
                <a
                  href={invoice.payment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] sm:text-xs shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Bayar Sekarang
                </a>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-700">
                QRIS, Transfer Bank, E-Wallet, dan metode pembayaran lainnya.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 sm:mt-14 px-5 sm:px-12 pb-8 sm:pb-10 print:mt-8 print:pb-6">
            <div className="border-t-2 border-slate-100 pt-5 sm:pt-6 text-center">
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                Terima kasih telah berbisnis dengan <span className="text-[#0058bc]">Luvion</span>.
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5">
                Pertanyaan seputar invoice ini? Hubungi{" "}
                <a href="mailto:cs@luvion.my.id" className="text-[#0058bc] font-semibold hover:underline">cs@luvion.my.id</a>{" "}
                atau WhatsApp{" "}
                <span className="font-semibold text-slate-500">+628197965599</span>
              </p>
              <p className="text-[10px] text-slate-300 mt-3">
                Dokumen ini dibuat otomatis oleh sistem Luvion. Tidak memerlukan tanda tangan.
              </p>
            </div>
          </div>

        </div>

        {/* ─── Mobile company info fallback (hidden on print) ─── */}
        <div className="mt-4 text-center text-xs text-slate-400 sm:hidden print:hidden">
          Perum. Shojiland Blok EJ.02, Candi, Sidoarjo · admin@luvion.my.id · +628197965599
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm 14mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background: #fff !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          .invoice-sheet {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
          }
          .invoice-sheet thead tr {
            background: #0058bc !important;
            -webkit-print-color-adjust: exact !important;
          }
          .invoice-sheet thead th {
            color: #fff !important;
          }
          .invoice-sheet .bg-emerald-50,
          .invoice-sheet .bg-amber-50 {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .invoice-sheet a {
            color: #0058bc !important;
            text-decoration: none;
          }
        }
      `}</style>
    </div>
  );
}