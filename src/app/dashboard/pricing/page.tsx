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
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Kelola Pricing</h1>
          <p className="text-zinc-400 text-sm mt-1">Ubah harga, fitur, dan detail paket langganan Luvion.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Tambah Paket
        </button>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-800/50 text-zinc-400 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Paket</th>
              <th className="px-6 py-4 font-medium">Harga</th>
              <th className="px-6 py-4 font-medium">Deskripsi</th>
              <th className="px-6 py-4 font-medium">Populer</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tiers.map((tier) => (
              <tr key={tier.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-white">{tier.name}</p>
                  <p className="text-xs text-zinc-500">{tier.subtitle}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{tier.price}</p>
                  <p className="text-xs text-zinc-500">{tier.price_suffix}</p>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{tier.description}</td>
                <td className="px-6 py-4">
                  {tier.popular ? (
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Ya</span>
                  ) : (
                    <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs">Tidak</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openModal(tier)}
                    className="text-blue-400 hover:text-blue-300 p-2 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tier.id)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors ml-2"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingTier ? "Edit Paket Harga" : "Tambah Paket Harga"}</h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">ID Paket</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingTier}
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Subtitle</label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-1 flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                      className="w-4 h-4 rounded border-white/10 text-blue-500 focus:ring-blue-500/50 bg-black/20"
                    />
                    <span className="text-sm text-zinc-300">Tandai Paling Populer</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Harga</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 50.000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Harga Asli (Coret)</label>
                  <input
                    type="text"
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 150.000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Suffix Harga</label>
                  <input
                    type="text"
                    value={formData.price_suffix}
                    onChange={(e) => setFormData({...formData, price_suffix: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/bulan"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Deskripsi Pendek</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Fitur (Pisahkan dengan Enter/Baris Baru)</label>
                <textarea
                  required
                  rows={5}
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Highlight Color Class (Tailwind)</label>
                <input
                  type="text"
                  value={formData.highlight_color}
                  onChange={(e) => setFormData({...formData, highlight_color: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="from-blue-500/10 to-transparent"
                />
              </div>
            </form>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-zinc-900/50">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
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
