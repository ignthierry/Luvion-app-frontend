'use client';

import React, { useState, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, Upload, Info, Loader2, Sparkles } from 'lucide-react';

type FormData = {
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  website: string;
  plan_name: string;
  billing_cycle: string;
  users_count: number;
  purpose: string;
  addons: string[];
  integration_needs: string;
  subdomain: string;
  logo: File | null;
  theme_color: string;
  notes: string;
  timeline: string;
};

const STEPS = [
  { id: 1, title: 'Profil Bisnis', subtitle: 'Informasi Dasar & Kontak' },
  { id: 2, title: 'Pilih Paket & Fitur', subtitle: 'SaaS Plan & Subscription' },
  { id: 3, title: 'Setup & Selesai', subtitle: 'Branding & Konfirmasi' },
];

const ADDONS_OPTIONS = [
  'WhatsApp Gateway',
  'Payment Gateway',
  'Multi-cabang',
  'Laporan Kustom',
];

export default function OrderForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'Starter';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    website: '',
    plan_name: initialPlan,
    billing_cycle: 'Bulanan',
    users_count: 1,
    purpose: '',
    addons: [],
    integration_needs: '',
    subdomain: '',
    logo: null,
    theme_color: '#0058bc',
    notes: '',
    timeline: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddonChange = (addon: string) => {
    setFormData((prev) => {
      if (prev.addons.includes(addon)) {
        return { ...prev, addons: prev.addons.filter((a) => a !== addon) };
      }
      return { ...prev, addons: [...prev.addons, addon] };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step !== STEPS.length) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === '') return;
        if (key === 'addons') {
          (value as string[]).forEach((v) => data.append('addons[]', v));
        } else if (key === 'logo') {
          data.append('logo', value as File);
        } else {
          data.append(key, value.toString());
        }
      });

      const res = await fetch('/api/orders', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Terjadi kesalahan saat memproses pesanan.');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirim pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center glass-panel rounded-3xl mt-12 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-on-surface mb-4">Pesanan Berhasil Diterima!</h2>
        <p className="text-on-surface-variant mb-8 text-lg">
          Terima kasih {formData.full_name}, tim kami akan segera menghubungi Anda melalui WhatsApp atau Email untuk proses selanjutnya.
        </p>
        <a href="/" className="inline-flex bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-24">
      {/* Stepper */}
      <div className="mb-12 flex justify-between items-center relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container rounded-full -z-10 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step >= s.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {step > s.id ? <Check className="w-5 h-5" /> : s.id}
            </div>
            <span className={`mt-2 text-xs font-semibold ${step >= s.id ? 'text-primary' : 'text-on-surface-variant/60'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-semibold flex items-start gap-2">
          <Info className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
        {/* Subtle bg glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-8 border-b border-surface-container pb-6">
          <h2 className="text-2xl font-bold text-on-surface">{STEPS[step - 1].title}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{STEPS[step - 1].subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-on-surface">Nama Lengkap (Kontak Utama) <span className="text-error">*</span></label>
                  <input required name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Misal: Budi Santoso" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Nama Perusahaan / Organisasi <span className="text-error">*</span></label>
                  <input required name="company_name" value={formData.company_name} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="PT Luvion Teknologi" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Email Bisnis <span className="text-error">*</span></label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="budi@perusahaan.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">No. WhatsApp / Telepon <span className="text-error">*</span></label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="0812xxxxxx" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Website (Opsional)</label>
                  <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="https://perusahaan.com" />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface">Pilih Paket Aplikasi <span className="text-error">*</span></label>
                    <select name="plan_name" value={formData.plan_name} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise (Kustom)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface">Siklus Penagihan</label>
                    <div className="flex bg-surface-container-low rounded-xl p-1 border border-surface-container">
                      <button type="button" onClick={() => setFormData(p => ({ ...p, billing_cycle: 'Bulanan' }))} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formData.billing_cycle === 'Bulanan' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Bulanan</button>
                      <button type="button" onClick={() => setFormData(p => ({ ...p, billing_cycle: 'Tahunan' }))} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${formData.billing_cycle === 'Tahunan' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                        Tahunan <Sparkles className="w-3 h-3 text-yellow-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Jumlah Kuota User / Staf <span className="text-error">*</span></label>
                  <input required type="number" min="1" name="users_count" value={formData.users_count} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  <p className="text-xs text-on-surface-variant">Berapa banyak staf yang akan menggunakan aplikasi ini.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Tujuan Utama Menggunakan Aplikasi <span className="text-error">*</span></label>
                  <textarea required name="purpose" value={formData.purpose} onChange={handleInputChange} rows={3} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Masalah apa yang paling ingin Anda selesaikan?" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-on-surface">Fitur Tambahan (Add-ons)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ADDONS_OPTIONS.map((addon) => (
                      <label key={addon} className="flex items-center gap-3 p-3 border border-surface-container rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
                        <input type="checkbox" checked={formData.addons.includes(addon)} onChange={() => handleAddonChange(addon)} className="w-5 h-5 text-primary border-surface-container rounded focus:ring-primary focus:ring-2" />
                        <span className="text-sm font-medium text-on-surface">{addon}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface flex items-center gap-1">Kebutuhan Integrasi Sistem <div className="group relative cursor-help"><Info className="w-4 h-4 text-on-surface-variant/60" /><div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-on-surface text-surface text-xs rounded-lg shadow-xl z-10">Apakah perlu dihubungkan dengan sistem lama seperti SAP, Accurate, dsb?</div></div></label>
                  <textarea name="integration_needs" value={formData.integration_needs} onChange={handleInputChange} rows={2} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Tuliskan jika ada sistem pihak ketiga yang perlu diintegrasikan." />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface flex items-center gap-1">Request Subdomain / Domain <div className="group relative cursor-help"><Info className="w-4 h-4 text-on-surface-variant/60" /><div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-on-surface text-surface text-xs rounded-lg shadow-xl z-10">Misal: namabisnis.luvion.my.id atau apps.namabisnis.com</div></div></label>
                  <input name="subdomain" value={formData.subdomain} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Misal: tokosaya.luvion.my.id" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Upload Logo Perusahaan (Opsional)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-surface-container hover:border-primary/50 bg-surface-container-low/50 rounded-xl p-8 text-center cursor-pointer transition-all group"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" className="hidden" />
                    <div className="w-12 h-12 bg-surface-container group-hover:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                      <Upload className="w-5 h-5 text-on-surface-variant group-hover:text-primary" />
                    </div>
                    <p className="text-sm font-bold text-on-surface">
                      {formData.logo ? formData.logo.name : 'Klik untuk upload logo'}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">Format PNG/JPG, maks 2MB.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Warna Tema Utama</label>
                  <div className="flex items-center gap-4">
                    <input type="color" name="theme_color" value={formData.theme_color} onChange={handleInputChange} className="w-12 h-12 rounded cursor-pointer border-0 p-0 bg-transparent" />
                    <span className="text-sm font-medium text-on-surface-variant uppercase">{formData.theme_color}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Target Waktu Penggunaan (Timeline)</label>
                  <input type="date" name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Catatan Khusus</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Permintaan khusus lainnya yang tidak ada di pilihan form." />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 pt-6 border-t border-surface-container flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
            ) : step === STEPS.length ? (
              <><Check className="w-4 h-4" /> Selesaikan Pesanan</>
            ) : (
              <>Lanjut <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
