"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  original_price: string | null;
  price_suffix: string;
  description: string;
  features: string[];
  popular: boolean;
  highlight_color: string;
}

export default function PricingCMS() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    subtitle: "",
    price: "",
    original_price: "",
    price_suffix: "",
    description: "",
    features: "", // We'll edit features as a newline-separated string
    popular: false,
    highlight_color: "",
  });

  const loadTiers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi("/pricing");
      setTiers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTiers();
  }, []);

  const openModal = (tier: PricingTier | null = null) => {
    if (tier) {
      setEditingTier(tier);
      setFormData({
        id: tier.id,
        name: tier.name,
        subtitle: tier.subtitle,
        price: tier.price,
        original_price: tier.original_price || "",
        price_suffix: tier.price_suffix || "",
        description: tier.description,
        features: tier.features.join("\n"),
        popular: tier.popular,
        highlight_color: tier.highlight_color || "",
      });
    } else {
      setEditingTier(null);
      setFormData({
        id: "",
        name: "",
        subtitle: "",
        price: "",
        original_price: "",
        price_suffix: "",
        description: "",
        features: "",
        popular: false,
        highlight_color: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTier(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features.split("\n").filter(f => f.trim() !== ""),
    };

    try {
      if (editingTier) {
        await fetchApi(`/pricing/${editingTier.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi("/pricing", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      closeModal();
      loadTiers();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket harga ini?")) {
      try {
        await fetchApi(`/pricing/${id}`, { method: "DELETE" });
        loadTiers();
      } catch (err: any) {
        alert("Error: " + err.message);
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
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Pricing</h1>
          <p className="text-on-surface-variant text-sm mt-1">Ubah harga, fitur, dan detail paket langganan Luvion.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Tambah Paket
        </button>
      </div>

      <div className="bg-surface border border-border/40 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-on-surface-variant">
          <thead className="bg-black/5 text-on-surface-variant/80 border-b border-border/40 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Paket</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4">Populer</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {tiers.map((tier) => (
              <tr key={tier.id} className="hover:bg-black/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-foreground">{tier.name}</p>
                  <p className="text-xs text-on-surface-variant/70">{tier.subtitle}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-foreground">{tier.price}</p>
                  <p className="text-xs text-on-surface-variant/70">{tier.price_suffix}</p>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{tier.description}</td>
                <td className="px-6 py-4">
                  {tier.popular ? (
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20">Ya</span>
                  ) : (
                    <span className="bg-black/10 text-on-surface-variant px-2 py-1 rounded text-xs font-semibold">Tidak</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openModal(tier)}
                    className="text-primary hover:text-primary/80 p-2 transition-colors rounded-lg hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tier.id)}
                    className="text-error hover:text-error/80 p-2 transition-colors ml-2 rounded-lg hover:bg-error/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-extrabold text-foreground">{editingTier ? "Edit Paket Harga" : "Tambah Paket Harga"}</h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">ID Paket</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingTier}
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Subtitle</label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div className="space-y-1 flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                      className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary/50 bg-background"
                    />
                    <span className="text-sm text-foreground font-medium">Tandai Paling Populer</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Harga</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Rp 50.000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Harga Asli (Coret)</label>
                  <input
                    type="text"
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Rp 150.000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Suffix Harga</label>
                  <input
                    type="text"
                    value={formData.price_suffix}
                    onChange={(e) => setFormData({...formData, price_suffix: e.target.value})}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="/bulan"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Deskripsi Pendek</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Fitur (Pisahkan dengan Enter/Baris Baru)</label>
                <textarea
                  required
                  rows={5}
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Highlight Color Class (Tailwind)</label>
                <input
                  type="text"
                  value={formData.highlight_color}
                  onChange={(e) => setFormData({...formData, highlight_color: e.target.value})}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="from-blue-500/10 to-transparent"
                />
              </div>
            </form>

            <div className="p-6 border-t border-border/40 flex justify-end gap-3 bg-surface/50 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:text-foreground hover:bg-black/5 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
