"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { Loader2, Eye, Trash2, X, RefreshCw } from "lucide-react";
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
  created_at: string;
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ClientOrder | null>(null);

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

  useEffect(() => {
    loadOrders();
  }, []);

  const openModal = (order: ClientOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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
    if (confirm("Apakah Anda yakin ingin menghapus pesanan ini? Aksi ini tidak dapat dibatalkan.")) {
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
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openModal(order)}
                      className="text-primary hover:text-primary/80 p-2 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-error hover:text-error/80 p-2 transition-colors ml-2"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border-border/40 rounded-3xl w-full max-w-3xl my-8 flex flex-col shadow-2xl relative">
            
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-extrabold text-foreground">Detail Pesanan #{selectedOrder.id}</h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
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
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Status Pembayaran</p>
                  <select
                    value={selectedOrder.payment_status || 'unpaid'}
                    onChange={(e) => handleUpdateField(selectedOrder.id, 'payment_status', e.target.value)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-bold border-0 focus:ring-2 focus:ring-primary/50 outline-none
                      ${(!selectedOrder.payment_status || selectedOrder.payment_status === 'unpaid') ? 'bg-zinc-500/20 text-zinc-500' : ''}
                      ${selectedOrder.payment_status === 'paid' ? 'bg-green-500/20 text-green-500' : ''}
                      ${selectedOrder.payment_status === 'overdue' ? 'bg-red-500/20 text-red-500' : ''}
                      ${selectedOrder.payment_status === 'failed' ? 'bg-red-500/20 text-red-500' : ''}
                    `}
                  >
                    <option value="unpaid" className="bg-background text-zinc-500">Unpaid</option>
                    <option value="paid" className="bg-background text-green-500">Paid</option>
                    <option value="overdue" className="bg-background text-red-500">Overdue</option>
                    <option value="failed" className="bg-background text-red-500">Failed</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Tgl Jatuh Tempo (1-31)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={selectedOrder.billing_due_day || ''}
                      onChange={(e) => handleUpdateField(selectedOrder.id, 'billing_due_day', e.target.value ? parseInt(e.target.value, 10) : null)}
                      className="text-sm px-3 py-1.5 rounded-lg font-bold border-0 bg-surface focus:ring-2 focus:ring-primary/50 outline-none w-20 text-foreground"
                      placeholder="Tgl"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Tanggal Pesanan</p>
                  <p className="font-semibold">{format(new Date(selectedOrder.created_at), "dd MMM yyyy, HH:mm")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    </div>
  );
}
