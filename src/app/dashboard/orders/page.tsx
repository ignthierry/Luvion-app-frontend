"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { Loader2, Trash2, X, RefreshCw, Receipt, Copy, Edit2 } from "lucide-react";
import { format } from "date-fns";

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
  billing_due_day?: number | null;
  pricing_payment?: string | number | null;
  payment_url?: string | null;
  snap_token?: string | null;
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
  created_at: string;
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ClientOrder | null>(null);
  
  const [orderInvoices, setOrderInvoices] = useState<Invoice[]>([]);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [invoiceModalData, setInvoiceModalData] = useState<{order: ClientOrder, invoice: Invoice} | null>(null);
  const [isSendingInvoice, setIsSendingInvoice] = useState<number | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<ClientOrder>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi("/orders");
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLink = async (invoice: Invoice, order: ClientOrder) => {
    // If it already has a link, just open the modal directly
    if (invoice.payment_url) {
      setInvoiceModalData({ order, invoice });
      return;
    }

    setIsSendingInvoice(invoice.id);
    try {
      const res = await fetchApi(`/invoices/${invoice.id}/payment-link`, {
        method: "POST"
      });
      if (res.status === 'success' || res.payment_url) {
        // Fetch fresh invoices
        const updatedInvoices = await fetchApi(`/orders/${order.id}/invoices`);
        setOrderInvoices(updatedInvoices);
        const freshInvoice = updatedInvoices.find((i: Invoice) => i.id === invoice.id) || { ...invoice, payment_url: res.payment_url, snap_token: res.snap_token };
        setInvoiceModalData({ order, invoice: freshInvoice });
      } else {
        alert("Gagal: " + (res.message || 'Terjadi kesalahan'));
      }
    } catch (err: any) {
      console.error(err);
      alert("Terjadi kesalahan saat membuat link tagihan.");
    } finally {
      setIsSendingInvoice(null);
    }
  };

  const handleCreateInvoice = async (orderId: number) => {
    setIsGeneratingInvoice(true);
    try {
      const res = await fetchApi(`/orders/${orderId}/invoices`, { method: "POST" });
      if (res.status === 'success') {
        const invoices = await fetchApi(`/orders/${orderId}/invoices`);
        setOrderInvoices(invoices);
      } else {
        alert("Gagal: " + (res.message || 'Terjadi kesalahan'));
      }
    } catch (e: any) {
      alert("Terjadi kesalahan. Pastikan pesanan memiliki harga dasar.");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openModal = async (order: ClientOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setOrderInvoices([]);
    try {
      const invoices = await fetchApi(`/orders/${order.id}/invoices`);
      setOrderInvoices(invoices);
    } catch (e) {
      console.error("Gagal load invoices", e);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const openEditModal = (order: ClientOrder) => {
    setSelectedOrder(order);
    setEditFormData(order);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedOrder(null);
    setEditFormData({});
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    setIsSavingEdit(true);
    try {
      await fetchApi(`/orders/${selectedOrder.id}`, {
        method: "PUT",
        body: JSON.stringify(editFormData),
      });
      loadOrders();
      closeEditModal();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Gagal memperbarui data pesanan.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleUpdateField = async (id: number, field: string, value: string | number | null) => {
    try {
      await fetchApi(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ [field]: value }),
      });
      loadOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, [field]: value });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert(`Gagal memperbarui ${field}.`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pesanan ini? Aksi ini akan menyembunyikan data (soft delete).")) {
      try {
        await fetchApi(`/orders/${id}`, { method: "DELETE" });
        loadOrders();
        closeModal();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Gagal menghapus pesanan.");
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Pesanan SaaS</h1>
          <p className="text-on-surface-variant text-sm mt-1">Lihat dan kelola pesanan aplikasi Luvion dari klien.</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 bg-surface hover:bg-surface/80 text-foreground px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-border/40"
        >
          <RefreshCw className="w-4 h-4" /> Segarkan
        </button>
      </div>

      <div className="glass-panel border-border/40 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="bg-surface/50 text-on-surface-variant border-b border-border/40">
            <tr>
              <th className="px-6 py-4 font-semibold">Klien</th>
              <th className="px-6 py-4 font-semibold">Paket</th>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Belum ada pesanan masuk.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground">{order.company_name}</p>
                    <p className="text-xs text-on-surface-variant">{order.full_name} ({order.email})</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{order.plan_name}</p>
                    <p className="text-xs text-primary">{order.billing_cycle} • {order.users_count} users</p>
                  </td>
                  <td className="px-6 py-4 text-on-surface">
                    {format(new Date(order.created_at), "dd MMM yyyy, HH:mm")}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateField(order.id, 'status', e.target.value)}
                      className={`text-xs px-2 py-1 rounded font-medium border-0 focus:ring-2 focus:ring-primary/50 outline-none
                        ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                        ${order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' : ''}
                        ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : ''}
                      `}
                    >
                      <option value="pending" className="bg-zinc-900 text-yellow-500">Pending</option>
                      <option value="processing" className="bg-zinc-900 text-blue-400">Processing</option>
                      <option value="completed" className="bg-zinc-900 text-green-400">Completed</option>
                      <option value="cancelled" className="bg-zinc-900 text-red-400">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => openEditModal(order)}
                          className="text-blue-500 hover:text-blue-400 p-1.5 transition-colors"
                          title="Edit Pesanan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-error hover:text-error/80 p-1.5 transition-colors ml-1"
                          title="Hapus (Soft Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => openModal(order)}
                        className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors w-full justify-center"
                        title="Lihat Tagihan & Detail"
                      >
                        <Receipt className="w-4 h-4" /> Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border-border/40 rounded-3xl w-full max-w-6xl my-8 flex flex-col shadow-2xl relative z-[1000]">
            
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Detail Pesanan #{selectedOrder.id}</h2>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={closeModal} className="text-on-surface-variant hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Header Info */}
              <div className="flex flex-wrap gap-4 items-center justify-between bg-surface/30 p-4 rounded-xl border border-border/20">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateField(selectedOrder.id, 'status', e.target.value)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-bold border-0 focus:ring-2 focus:ring-primary/50 outline-none
                      ${selectedOrder.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                      ${selectedOrder.status === 'processing' ? 'bg-blue-500/20 text-blue-400' : ''}
                      ${selectedOrder.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                      ${selectedOrder.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : ''}
                    `}
                  >
                    <option value="pending" className="bg-zinc-900 text-yellow-500">Pending</option>
                    <option value="processing" className="bg-zinc-900 text-blue-400">Processing</option>
                    <option value="completed" className="bg-zinc-900 text-green-400">Completed</option>
                    <option value="cancelled" className="bg-zinc-900 text-red-400">Cancelled</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Tanggal Pesanan</p>
                  <p className="font-semibold">{format(new Date(selectedOrder.created_at), "dd MMM yyyy, HH:mm")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Client Data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary border-b border-border/20 pb-2">Data Klien</h3>
                  
                  <div>
                    <p className="text-xs text-on-surface-variant">Perusahaan / Organisasi</p>
                    <p className="font-medium text-foreground">{selectedOrder.company_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Nama Kontak Utama</p>
                    <p className="font-medium text-foreground">{selectedOrder.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Email</p>
                    <p className="font-medium text-foreground">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Telepon / WhatsApp</p>
                    <p className="font-medium text-foreground">{selectedOrder.phone}</p>
                  </div>
                  {selectedOrder.website && (
                    <div>
                      <p className="text-xs text-on-surface-variant">Website</p>
                      <a href={selectedOrder.website.startsWith('http') ? selectedOrder.website : `https://${selectedOrder.website}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                        {selectedOrder.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Plan Data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary border-b border-border/20 pb-2">Detail Langganan</h3>
                  
                  <div>
                    <p className="text-xs text-on-surface-variant">Paket Terpilih</p>
                    <p className="font-medium text-foreground">{selectedOrder.plan_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Siklus Penagihan</p>
                    <p className="font-medium text-foreground capitalize">{selectedOrder.billing_cycle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Jumlah Pengguna / Lisensi</p>
                    <p className="font-medium text-foreground">{selectedOrder.users_count} Users</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Harga Langganan (Rp)</p>
                    <input
                      type="number"
                      value={selectedOrder.pricing_payment || ''}
                      onChange={(e) => handleUpdateField(selectedOrder.id, 'pricing_payment', e.target.value ? parseInt(e.target.value, 10) : null)}
                      className="text-sm px-3 py-1.5 rounded-lg font-bold border-0 bg-surface focus:ring-2 focus:ring-primary/50 outline-none w-full text-foreground"
                      placeholder="Contoh: 1500000"
                    />
                  </div>
                  {selectedOrder.subdomain && (
                    <div>
                      <p className="text-xs text-on-surface-variant">Subdomain Preferensi</p>
                      <p className="font-medium text-foreground bg-surface/50 px-2 py-1 rounded inline-block mt-1">{selectedOrder.subdomain}.luvion.ai</p>
                    </div>
                  )}
                  {selectedOrder.theme_color && (
                    <div>
                      <p className="text-xs text-on-surface-variant">Warna Tema Kustom</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: selectedOrder.theme_color }}></div>
                        <span className="font-mono text-sm">{selectedOrder.theme_color}</span>
                      </div>
                    </div>
                  )}
                </div>
              {/* Extra Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b border-border/20 pb-2">Kebutuhan Tambahan</h3>
                
                {selectedOrder.purpose && (
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Tujuan Penggunaan Utama</p>
                    <p className="text-sm bg-surface/30 p-3 rounded-lg border border-border/20">{selectedOrder.purpose}</p>
                  </div>
                )}
                {selectedOrder.integration_needs && (
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Kebutuhan Integrasi API</p>
                    <p className="text-sm bg-surface/30 p-3 rounded-lg border border-border/20">{selectedOrder.integration_needs}</p>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Catatan Tambahan</p>
                    <p className="text-sm bg-surface/30 p-3 rounded-lg border border-border/20">{selectedOrder.notes}</p>
                  </div>
                )}
                {selectedOrder.addons && (
                  <div>
                    <p className="text-xs text-on-surface-variant mb-2">Modul Add-on Terpilih</p>
                    <div className="flex flex-wrap gap-2">
                      {typeof selectedOrder.addons === 'string' 
                        ? JSON.parse(selectedOrder.addons).map((addon: string, i: number) => (
                            <span key={i} className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full">{addon}</span>
                          ))
                        : (Array.isArray(selectedOrder.addons) ? selectedOrder.addons.map((addon: string, i: number) => (
                            <span key={i} className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full">{addon}</span>
                          )) : <span className="text-sm italic text-on-surface-variant">Format addons tidak dikenali</span>)
                      }
                    </div>
                  </div>
                )}
                
                {selectedOrder.logo_path && (
                  <div>
                    <p className="text-xs text-on-surface-variant mb-2">Logo Perusahaan</p>
                    <div className="bg-white p-2 rounded-lg inline-block">
                      <img 
                        src={`http://localhost:8000/storage/${selectedOrder.logo_path}`} 
                        alt="Logo Klien" 
                        className="h-16 w-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150?text=Error+Loading+Image';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* Tagihan Invoices Section (Inside Detail Modal) */}
            <div className="p-6 pt-0">
              <div className="space-y-4 pt-6 border-t border-border/40 mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary">Daftar Tagihan (Invoices)</h3>
                  <button
                    onClick={() => handleCreateInvoice(selectedOrder.id)}
                    disabled={isGeneratingInvoice || !selectedOrder.pricing_payment}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isGeneratingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                    Buat Tagihan Baru
                  </button>
                </div>
                
                <div className="bg-surface/30 rounded-xl overflow-hidden border border-border/20">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-on-surface-variant border-b border-border/20">
                      <tr>
                        <th className="px-4 py-3 font-semibold">No. Invoice</th>
                        <th className="px-4 py-3 font-semibold">Tgl Jatuh Tempo</th>
                        <th className="px-4 py-3 font-semibold">Nominal</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {orderInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-on-surface-variant text-xs">Belum ada tagihan untuk pesanan ini.</td>
                        </tr>
                      ) : (
                        orderInvoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-white/5">
                            <td className="px-4 py-3 font-medium">{inv.invoice_number}</td>
                            <td className="px-4 py-3">{inv.due_date ? format(new Date(inv.due_date), "dd MMM yyyy") : '-'}</td>
                            <td className="px-4 py-3">Rp {Number(inv.amount).toLocaleString('id-ID')}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium 
                                ${inv.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}
                              >
                                {inv.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleGenerateLink(inv, selectedOrder)}
                                disabled={isSendingInvoice === inv.id}
                                className="text-green-500 hover:text-green-400 p-1.5 transition-colors disabled:opacity-50"
                                title="Kirim/Generate Tagihan Midtrans"
                              >
                                {isSendingInvoice === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                              </button>
                              <a
                                href={`/dashboard/invoices/${inv.id}/print`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:text-primary/80 p-1.5 transition-colors inline-block ml-1"
                                title="Cetak PDF"
                              >
                                <Copy className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border/40 flex justify-end gap-3 bg-surface/50 rounded-b-3xl">
              <button
                onClick={() => handleDelete(selectedOrder.id)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-error hover:bg-error/10 transition-colors"
              >
                Hapus
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModalData && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border-border/40 rounded-3xl w-full max-w-lg flex flex-col shadow-2xl relative">
            
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-extrabold text-foreground">Kirim Tagihan</h2>
              <button onClick={() => setInvoiceModalData(null)} className="text-on-surface-variant hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-surface/30 p-4 rounded-xl border border-border/20 text-center">
                <p className="text-sm text-on-surface-variant mb-1">Total Tagihan (Rp)</p>
                <p className="text-3xl font-extrabold text-primary">{new Intl.NumberFormat('id-ID').format(Number(invoiceModalData.invoice.amount || 0))}</p>
                <p className="text-sm text-foreground mt-2">{invoiceModalData.order.plan_name} - {invoiceModalData.invoice.invoice_number}</p>
                <p className="text-xs text-on-surface-variant">{invoiceModalData.order.company_name} ({invoiceModalData.order.full_name})</p>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant mb-2">Pilih metode pengiriman:</p>
                <div className="flex flex-col gap-3">
                  <a 
                    href={`https://wa.me/${invoiceModalData.order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${invoiceModalData.order.full_name},\n\nBerikut adalah tagihan untuk layanan Luvion SaaS (${invoiceModalData.order.plan_name}).\n\nTotal: Rp ${new Intl.NumberFormat('id-ID').format(Number(invoiceModalData.invoice.amount || 0))}\nSilakan lakukan pembayaran melalui link berikut:\n${invoiceModalData.invoice.payment_url}\n\nTerima kasih,\nTim Luvion`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex justify-center items-center gap-2 py-3 bg-green-500/20 text-green-500 font-bold rounded-xl hover:bg-green-500/30 transition-colors"
                  >
                    Kirim via WhatsApp
                  </a>
                  
                  <a 
                    href={`mailto:${invoiceModalData.order.email}?subject=Tagihan Layanan Luvion SaaS - ${invoiceModalData.order.company_name}&body=${encodeURIComponent(`Halo ${invoiceModalData.order.full_name},\n\nBerikut adalah tagihan untuk layanan Luvion SaaS (${invoiceModalData.order.plan_name}).\n\nTotal: Rp ${new Intl.NumberFormat('id-ID').format(Number(invoiceModalData.invoice.amount || 0))}\nSilakan lakukan pembayaran melalui link berikut:\n${invoiceModalData.invoice.payment_url}\n\nTerima kasih,\nTim Luvion`)}`}
                    className="w-full flex justify-center items-center gap-2 py-3 bg-blue-500/20 text-blue-400 font-bold rounded-xl hover:bg-blue-500/30 transition-colors"
                  >
                    Kirim via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border-border/40 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl relative my-8">
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-extrabold text-foreground">Edit Header Pesanan</h2>
              <button onClick={closeEditModal} className="text-on-surface-variant hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col">
              <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Nama Perusahaan</label>
                    <input 
                      type="text" 
                      value={editFormData.company_name || ''} 
                      onChange={(e) => setEditFormData({...editFormData, company_name: e.target.value})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Nama Kontak</label>
                    <input 
                      type="text" 
                      value={editFormData.full_name || ''} 
                      onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Email</label>
                    <input 
                      type="email" 
                      value={editFormData.email || ''} 
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Telepon / WA</label>
                    <input 
                      type="text" 
                      value={editFormData.phone || ''} 
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Nama Paket</label>
                    <input 
                      type="text" 
                      value={editFormData.plan_name || ''} 
                      onChange={(e) => setEditFormData({...editFormData, plan_name: e.target.value})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Siklus Penagihan</label>
                    <select 
                      value={editFormData.billing_cycle || ''} 
                      onChange={(e) => setEditFormData({...editFormData, billing_cycle: e.target.value})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    >
                      <option value="bulanan">Bulanan</option>
                      <option value="tahunan">Tahunan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Jumlah Pengguna</label>
                    <input 
                      type="number" 
                      value={editFormData.users_count || ''} 
                      onChange={(e) => setEditFormData({...editFormData, users_count: parseInt(e.target.value) || 0})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Harga Langganan (Rp)</label>
                    <input 
                      type="number" 
                      value={editFormData.pricing_payment || ''} 
                      onChange={(e) => setEditFormData({...editFormData, pricing_payment: parseInt(e.target.value) || null})}
                      className="w-full bg-surface border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/40 flex justify-end gap-3 bg-surface/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
