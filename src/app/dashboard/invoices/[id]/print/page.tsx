"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/apiClient";
import { format } from "date-fns";
import { Loader2, Printer, ArrowLeft, CreditCard, ExternalLink } from "lucide-react";
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
  created_at: string;
  client_order: ClientOrder;
}

export default function InvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadInvoice(id as string);
    }
  }, [id]);

  const loadInvoice = async (invoiceId: string) => {
    try {
      const data = await fetchApi(`/invoices/${invoiceId}`);
      setInvoice(data);
    } catch (e) {
      console.error("Failed to load invoice", e);
    } finally {
      setIsLoading(false);
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
        <p className="text-xl text-on-surface-variant">Invoice not found.</p>
      </div>
    );
  }

  const order = invoice.client_order;

  const invoiceNumber = invoice.invoice_number;
  const totalPricing = Number(invoice.amount || 0);

  return (
    <div className="min-h-screen bg-white text-zinc-900 print:bg-white p-8 md:p-16 flex justify-center">
      
      {/* Floating Action Buttons (Hidden on Print) */}
      <div className="fixed top-6 right-6 flex gap-3 print:hidden z-50">
        <Link 
          href="/dashboard/orders"
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-all font-semibold text-sm shadow-md border border-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        {invoice.payment_url && invoice.status !== 'paid' && (
          <a
            href={invoice.payment_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-semibold text-sm shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4" /> Bayar via Midtrans
          </a>
        )}
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-semibold text-sm shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Printer className="w-4 h-4" /> Cetak Invoice
        </button>
      </div>

      {/* Invoice Container */}
      <div className="w-full max-w-4xl bg-white">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-zinc-200 pb-8 mb-8">
          <div>
            {/* You can replace this with an actual logo `<img>` */}
            <h1 className="text-4xl font-black text-primary tracking-tighter mb-2">LUVION</h1>
            <p className="text-sm text-zinc-500">Penyedia Layanan SaaS & ERP</p>
            <p className="text-sm text-zinc-500">Jakarta, Indonesia</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-zinc-300 uppercase tracking-widest mb-2">Invoice</h2>
            <p className="text-sm font-bold text-zinc-800">#{invoiceNumber}</p>
            <p className="text-sm text-zinc-500">Tanggal: {format(new Date(), "dd MMMM yyyy")}</p>
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
                <span className="inline-block px-4 py-1.5 rounded bg-green-100 text-green-700 font-bold text-sm">LUNAS</span>
                {invoice.payment_type && (
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                    VIA {invoice.payment_type.replace('_', ' ')}
                  </span>
                )}
              </div>
            ) : (
              <span className="inline-block px-4 py-1.5 rounded bg-red-100 text-red-700 font-bold text-sm">BELUM DIBAYAR</span>
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
                className="print:hidden inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 text-sm"
              >
                <ExternalLink className="w-4 h-4" /> Bayar Sekarang
              </a>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-200/60 print:bg-transparent print:p-0 print:border-none">
              <span className="text-xs font-semibold text-emerald-800 block mb-1">Link Pembayaran:</span>
              <a href={invoice.payment_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-mono text-xs break-all">
                {invoice.payment_url}
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-zinc-200 pt-8 text-center text-zinc-500 text-sm">
          <p>Terima kasih telah berbisnis dengan kami.</p>
          <p>Jika Anda memiliki pertanyaan mengenai invoice ini, silakan hubungi tim dukungan kami di support@luvion.com</p>
        </div>

      </div>
    </div>
  );
}
