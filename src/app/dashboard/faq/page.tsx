"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";

interface FAQ {
  id: number;
  question_id: string;
  answer_id: string;
  question_en: string;
  answer_en: string;
  is_active: boolean;
  sort_order: number;
}

export default function FaqCMS() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    question_id: "",
    answer_id: "",
    question_en: "",
    answer_en: "",
    is_active: true,
    sort_order: 0,
  });

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi("/faq?all=true");
      setFaqs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openModal = (faq: FAQ | null = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question_id: faq.question_id,
        answer_id: faq.answer_id,
        question_en: faq.question_en,
        answer_en: faq.answer_en,
        is_active: faq.is_active,
        sort_order: faq.sort_order,
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question_id: "",
        answer_id: "",
        question_en: "",
        answer_en: "",
        is_active: true,
        sort_order: faqs.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        sort_order: parseInt(formData.sort_order.toString(), 10)
      };

      if (editingFaq) {
        await fetchApi(`/faq/${editingFaq.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi("/faq", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      closeModal();
      loadFaqs();
    } catch (error) {
      console.error("Error saving faq:", error);
      alert("Gagal menyimpan FAQ. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      try {
        await fetchApi(`/faq/${id}`, { method: "DELETE" });
        loadFaqs();
      } catch (error) {
        console.error("Error deleting faq:", error);
        alert("Gagal menghapus FAQ.");
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
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola FAQ</h1>
          <p className="text-on-surface-variant text-sm mt-1">Atur Pertanyaan yang Sering Diajukan di beranda.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Tambah FAQ
        </button>
      </div>

      <div className="bg-surface border border-border/40 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-on-surface-variant">
          <thead className="bg-black/5 text-on-surface-variant/80 border-b border-border/40 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Urutan</th>
              <th className="px-6 py-4">Pertanyaan (ID)</th>
              <th className="px-6 py-4">Jawaban (ID)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {faqs.map((faq) => (
              <tr key={faq.id} className="hover:bg-black/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">{faq.sort_order}</td>
                <td className="px-6 py-4 font-bold text-foreground">{faq.question_id}</td>
                <td className="px-6 py-4 max-w-xs truncate">{faq.answer_id}</td>
                <td className="px-6 py-4">
                  {faq.is_active ? (
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20">Aktif</span>
                  ) : (
                    <span className="bg-black/10 text-on-surface-variant px-2 py-1 rounded text-xs font-semibold">Tidak Aktif</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openModal(faq)}
                    className="text-primary hover:text-primary/80 p-2 transition-colors rounded-lg hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
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
              <h2 className="text-xl font-extrabold text-foreground">{editingFaq ? "Edit FAQ" : "Tambah FAQ"}</h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1 flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary/50 bg-background"
                  />
                  <span className="text-sm text-foreground font-medium">Aktifkan FAQ ini</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Pertanyaan (ID)</label>
                  <input
                    type="text"
                    required
                    value={formData.question_id}
                    onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Question (EN)</label>
                  <input
                    type="text"
                    required
                    value={formData.question_en}
                    onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
                    className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Jawaban (ID)</label>
                <textarea
                  required
                  rows={3}
                  value={formData.answer_id}
                  onChange={(e) => setFormData({ ...formData, answer_id: e.target.value })}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Answer (EN)</label>
                <textarea
                  required
                  rows={3}
                  value={formData.answer_en}
                  onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Urutan (Sort Order)</label>
                <input
                  type="number"
                  required
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-background border border-border/40 rounded-lg p-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
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
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
