"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi, API_BASE_URL } from "@/lib/apiClient";
import { 
  Wallet, BookOpen, FileText, Plus, Save, Trash2, Edit3, 
  ArrowRight, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2,
  HandCoins, TrendingDown, BookMarked
} from "lucide-react";

// Download file dari API (auth via Authorization header)
const downloadExport = async (e: any, path: string) => {
  e.preventDefault();
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "";
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`Gagal export (${res.status})`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const cd = res.headers.get("Content-Disposition") || "";
    const m = cd.match(/filename="?([^";]+)"?/);
    a.download = m ? m[1] : "laporan.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err: any) {
    alert(`Export gagal: ${err.message}`);
  }
};

export default function AccountingDashboard() {
  const [activeTab, setActiveTab] = useState<"coa" | "journals" | "input" | "reports" | "ledger" | "expenses">("coa");
  
  // States for COA
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  
  // States for Journals
  const [journals, setJournals] = useState<any[]>([]);
  const [editingJournalId, setEditingJournalId] = useState<number | null>(null);
  
  // States for Input Journal
  const [journalForm, setJournalForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: `JNL-${Date.now().toString().slice(-6)}`,
    description: "",
    details: [
      { account_id: "", debit: 0, credit: 0, description: "" },
      { account_id: "", debit: 0, credit: 0, description: "" }
    ]
  });

  // States for Reports
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [incomeStatement, setIncomeStatement] = useState<any>(null);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // States for Buku Besar (Ledger)
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [ledgerFilter, setLedgerFilter] = useState({
    account_id: "",
    start_date: "",
    end_date: new Date().toISOString().split('T')[0],
    type: "",
  });

  // Export dropdown (Neraca / Laba Rugi)
  const [openExportMenu, setOpenExportMenu] = useState<string | null>(null);
  
  // States for Pembiayaan (Expenses)
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expenseStats, setExpenseStats] = useState<any>(null);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: "server",
    description: "",
    amount: "",
    payment_method: "cash",
    account_id: "",
  });
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
    if (activeTab === "journals") fetchJournals();
    if (activeTab === "reports") fetchReports();
    if (activeTab === "ledger") fetchLedger();
    if (activeTab === "expenses") fetchExpenses();
  }, [activeTab]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  // --- API Calls ---
  const fetchAccounts = async () => {
    try {
      const data = await fetchApi("/accounting/accounts");
      setAccounts(data || []);
    } catch (e: any) {
      showError(e.message || "Gagal memuat daftar akun");
    }
  };

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/accounting/journals");
      setJournals(data || []);
    } catch (e: any) {
      showError(e.message || "Gagal memuat jurnal");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [bs, is] = await Promise.all([
        fetchApi(`/accounting/reports/balance-sheet?end_date=${reportDate}`),
        fetchApi(`/accounting/reports/income-statement?end_date=${reportDate}`)
      ]);
      setBalanceSheet(bs);
      setIncomeStatement(is);
    } catch (e: any) {
      showError(e.message || "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  // --- COA Handlers ---
  const handleSaveAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      code: formData.get("code"),
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description"),
      is_active: formData.get("is_active") === "true"
    };

    try {
      if (editingAccount) {
        await fetchApi(`/accounting/accounts/${editingAccount.id}`, { method: "PUT", body: JSON.stringify(payload) });
        showSuccess("Akun berhasil diperbarui");
      } else {
        await fetchApi("/accounting/accounts", { method: "POST", body: JSON.stringify(payload) });
        showSuccess("Akun berhasil ditambahkan");
      }
      setIsAccountModalOpen(false);
      fetchAccounts();
    } catch (e: any) {
      showError(e.message || "Gagal menyimpan akun");
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm("Yakin ingin menghapus akun ini?")) return;
    try {
      await fetchApi(`/accounting/accounts/${id}`, { method: "DELETE" });
      showSuccess("Akun berhasil dihapus");
      fetchAccounts();
    } catch (e: any) {
      showError(e.message || "Gagal menghapus akun (mungkin sedang digunakan)");
    }
  };

  // --- Journal Input Handlers ---
  const handleAddJournalDetail = () => {
    setJournalForm({
      ...journalForm,
      details: [...journalForm.details, { account_id: "", debit: 0, credit: 0, description: "" }]
    });
  };

  const handleRemoveJournalDetail = (index: number) => {
    const newDetails = [...journalForm.details];
    newDetails.splice(index, 1);
    setJournalForm({ ...journalForm, details: newDetails });
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...journalForm.details];
    (newDetails[index] as any)[field] = value;
    setJournalForm({ ...journalForm, details: newDetails });
  };

  const handleSubmitJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const totalDebit = journalForm.details.reduce((sum, d) => sum + Number(d.debit), 0);
    const totalCredit = journalForm.details.reduce((sum, d) => sum + Number(d.credit), 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      showError(`Jurnal tidak balance! Debit: ${totalDebit}, Kredit: ${totalCredit}`);
      return;
    }

    try {
      setLoading(true);
      if (editingJournalId) {
        await fetchApi(`/accounting/journals/${editingJournalId}`, { 
          method: "PUT", 
          body: JSON.stringify(journalForm) 
        });
        showSuccess("Jurnal berhasil diperbarui");
      } else {
        await fetchApi("/accounting/journals", { 
          method: "POST", 
          body: JSON.stringify(journalForm) 
        });
        showSuccess("Jurnal berhasil disimpan");
      }
      resetJournalForm();
      setActiveTab("journals");
    } catch (e: any) {
      showError(e.message || "Gagal menyimpan jurnal");
    } finally {
      setLoading(false);
    }
  };

  // Mulai edit jurnal — isi form dengan data jurnal terpilih
  const handleEditJournal = (journal: any) => {
    setJournalForm({
      date: journal.date?.slice(0, 10) || new Date().toISOString().split('T')[0],
      reference: journal.reference,
      description: journal.description || "",
      details: journal.details?.length
        ? journal.details.map((d: any) => ({
            account_id: d.account_id,
            debit: Number(d.debit),
            credit: Number(d.credit),
            description: d.description || "",
          }))
        : [{ account_id: "", debit: 0, credit: 0, description: "" }, { account_id: "", debit: 0, credit: 0, description: "" }]
    });
    setEditingJournalId(journal.id);
    setActiveTab("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hapus jurnal dengan konfirmasi
  const handleDeleteJournal = async (journal: any) => {
    if (!window.confirm(`Hapus jurnal ${journal.reference}? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      setLoading(true);
      await fetchApi(`/accounting/journals/${journal.id}`, { method: "DELETE" });
      showSuccess("Jurnal berhasil dihapus");
      fetchJournals();
    } catch (e: any) {
      showError(e.message || "Gagal menghapus jurnal");
    } finally {
      setLoading(false);
    }
  };

  const resetJournalForm = () => {
    setJournalForm({
      date: new Date().toISOString().split('T')[0],
      reference: `JNL-${Date.now().toString().slice(-6)}`,
      description: "",
      details: [
        { account_id: "", debit: 0, credit: 0, description: "" },
        { account_id: "", debit: 0, credit: 0, description: "" }
      ]
    });
    setEditingJournalId(null);
  };

  // --- Pembiayaan (Expense) Handlers ---
  const EXPENSE_CATEGORIES = [
    { value: "server", label: "Server / Cloud" },
    { value: "software", label: "Langganan Software" },
    { value: "utilities", label: "Internet & Listrik" },
    { value: "marketing", label: "Pemasaran" },
    { value: "gaji", label: "Gaji Karyawan" },
    { value: "transport", label: "Transportasi" },
    { value: "sewa", label: "Sewa" },
    { value: "bahan_baku", label: "Bahan Baku" },
    { value: "lisensi", label: "Lisensi & Legalitas" },
    { value: "konsumsi", label: "Konsumsi" },
    { value: "pelatihan", label: "Pendidikan & Pelatihan" },
    { value: "komunikasi", label: "Komunikasi" },
    { value: "perawatan", label: "Perawatan & Reparasi" },
    { value: "operasional", label: "Operasional Lainnya" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/expenses?per_page=50");
      const list = data.data || data || [];
      setExpenses(Array.isArray(list) ? list : (list.data || []));
      const stats = await fetchApi("/expenses/stats");
      setExpenseStats(stats);
    } catch (e: any) {
      showError(e.message || "Gagal memuat pembiayaan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      showError("Nominal biaya harus diisi dan lebih dari 0");
      return;
    }
    try {
      setLoading(true);
      await fetchApi("/expenses", {
        method: "POST",
        body: JSON.stringify({
          date: expenseForm.date,
          category: expenseForm.category,
          description: expenseForm.description,
          amount: Number(expenseForm.amount),
          payment_method: expenseForm.payment_method,
          account_id: expenseForm.account_id || undefined,
        }),
      });
      showSuccess("Pembiayaan tercatat! Jurnal otomatis: Debit Biaya, Kredit Kas.");
      setExpenseForm({
        date: new Date().toISOString().split('T')[0],
        category: "server",
        description: "",
        amount: "",
        payment_method: "cash",
        account_id: "",
      });
      fetchExpenses();
    } catch (e: any) {
      showError(e.message || "Gagal menyimpan pembiayaan");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Hapus pembiayaan ini beserta jurnalnya?")) return;
    try {
      await fetchApi(`/expenses/${id}`, { method: "DELETE" });
      showSuccess("Pembiayaan dihapus");
      fetchExpenses();
    } catch (e: any) {
      showError(e.message || "Gagal menghapus pembiayaan");
    }
  };

  // --- Buku Besar (Ledger) Handlers ---
  const fetchLedger = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (ledgerFilter.account_id) params.set("account_id", ledgerFilter.account_id);
      if (ledgerFilter.start_date) params.set("start_date", ledgerFilter.start_date);
      if (ledgerFilter.end_date) params.set("end_date", ledgerFilter.end_date);
      if (ledgerFilter.type) params.set("type", ledgerFilter.type);
      const qs = params.toString();
      const data = await fetchApi(`/accounting/ledger${qs ? `?${qs}` : ""}`);
      setLedgerData(data.accounts || []);
    } catch (e: any) {
      showError(e.message || "Gagal memuat buku besar");
    } finally {
      setLoading(false);
    }
  };

  const fmtRp = (n: any) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <Wallet className="w-8 h-8 text-primary" />
          Accounting & Tax
        </h1>
        <p className="text-on-surface-variant mt-2 text-sm max-w-2xl">
          Kelola Chart of Accounts, catat jurnal transaksi harian, dan pantau laporan keuangan Luvion secara real-time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2 overflow-x-auto no-scrollbar scrollbar-none">
        {[
          { id: "coa", label: "Master COA", icon: BookOpen },
          { id: "journals", label: "Jurnal Umum", icon: FileText },
          { id: "input", label: "Input Jurnal", icon: Plus },
          { id: "ledger", label: "Buku Besar", icon: BookOpen },
          { id: "expenses", label: "Pembiayaan", icon: HandCoins },
          { id: "reports", label: "Laporan Keuangan", icon: Wallet },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
              activeTab === tab.id 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "text-on-surface-variant hover:bg-surface/50 hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-error/10 text-error border border-error/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-semibold text-sm">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="font-semibold text-sm">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Contents */}
      <div className="min-h-[500px]">
        
        {/* COA TAB */}
        {activeTab === "coa" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Daftar Akun (Chart of Accounts)</h2>
              <button 
                onClick={() => { setEditingAccount(null); setIsAccountModalOpen(true); }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Akun
              </button>
            </div>
            
            <div className="glass-panel rounded-2xl overflow-hidden border border-border/40">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase text-on-surface-variant border-b border-border/40">
                      <tr>
                        <th className="px-6 py-4 font-bold">Kode</th>
                        <th className="px-6 py-4 font-bold">Nama Akun</th>
                        <th className="px-6 py-4 font-bold">Tipe</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-border/40">
                    {accounts.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Belum ada akun.</td></tr>
                    ) : (
                      accounts.map((acc) => (
                        <tr key={acc.id} className="hover:bg-surface/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{acc.code}</td>
                          <td className="px-6 py-4">{acc.name}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-surface/80 rounded-full text-xs font-semibold border border-border/50 text-primary">
                              {acc.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {acc.is_active ? (
                              <span className="text-emerald-500 font-semibold text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Aktif</span>
                            ) : (
                              <span className="text-error font-semibold text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Nonaktif</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => { setEditingAccount(acc); setIsAccountModalOpen(true); }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAccount(acc.id)}
                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* JOURNALS TAB */}
        {activeTab === "journals" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Jurnal Umum</h2>
              <button onClick={fetchJournals} className="btn-secondary py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm">
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {journals.length === 0 && !loading && (
                <div className="glass-panel p-8 text-center text-on-surface-variant rounded-2xl border border-border/40">
                  Belum ada transaksi jurnal.
                </div>
              )}
              
              {journals.map((journal) => (
                <div key={journal.id} className="glass-panel rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                  {/* Card Header */}
                  <div className="bg-surface/60 p-4 sm:px-6 sm:py-4 border-b border-border/40">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                            {journal.reference}
                          </span>
                          <span className="text-[11px] sm:text-xs font-medium text-on-surface-variant bg-surface px-2.5 py-0.5 rounded-full border border-border/40 whitespace-nowrap">
                            {journal.date}
                          </span>
                        </div>
                        {journal.description && (
                          <div className="text-xs sm:text-sm text-on-surface-variant mt-1">
                            {journal.description}
                          </div>
                        )}
                      </div>

                      {/* Desktop Total Amount & Actions */}
                      <div className="hidden sm:flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Total Amount</div>
                          <div className="font-bold text-base sm:text-lg text-primary">
                            Rp {Number(journal.total_amount).toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditJournal(journal)}
                            title="Edit jurnal"
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJournal(journal)}
                            title="Hapus jurnal"
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Actions (Top Right) */}
                      <div className="flex sm:hidden items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditJournal(journal)}
                          title="Edit jurnal"
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJournal(journal)}
                          title="Hapus jurnal"
                          className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Total Amount Bar */}
                    <div className="sm:hidden mt-3 pt-2.5 border-t border-border/20 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Total Amount</span>
                      <span className="font-extrabold text-sm text-primary">
                        Rp {Number(journal.total_amount).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Detail List View (sm:hidden) */}
                  <div className="sm:hidden divide-y divide-border/20">
                    {journal.details.map((detail: any) => {
                      const debitNum = Number(detail.debit || 0);
                      const creditNum = Number(detail.credit || 0);
                      return (
                        <div key={detail.id} className="p-3.5 space-y-1.5 hover:bg-surface/20 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface/80 border border-border/40 text-primary shrink-0">
                                  {detail.account?.code}
                                </span>
                                <span className="font-semibold text-xs text-foreground">
                                  {detail.account?.name}
                                </span>
                              </div>
                              {detail.description && detail.description !== '-' && (
                                <p className="text-[11px] text-on-surface-variant mt-1 pl-0.5 italic">
                                  {detail.description}
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              {debitNum > 0 && (
                                <div className="text-xs font-bold text-emerald-500 whitespace-nowrap">
                                  <span className="text-[10px] font-normal uppercase text-emerald-600/80 mr-1">D:</span>
                                  Rp {debitNum.toLocaleString('id-ID')}
                                </div>
                              )}
                              {creditNum > 0 && (
                                <div className="text-xs font-bold text-error whitespace-nowrap">
                                  <span className="text-[10px] font-normal uppercase text-red-500/80 mr-1">K:</span>
                                  Rp {creditNum.toLocaleString('id-ID')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View (hidden sm:block) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase text-on-surface-variant bg-surface/30 border-b border-border/40">
                        <tr>
                          <th className="px-6 py-3 font-bold">Akun</th>
                          <th className="px-6 py-3 font-bold">Deskripsi</th>
                          <th className="px-6 py-3 font-bold text-right">Debit</th>
                          <th className="px-6 py-3 font-bold text-right">Kredit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {journal.details.map((detail: any) => (
                          <tr key={detail.id} className="hover:bg-surface/20 transition-colors">
                            <td className="px-6 py-3 font-medium text-foreground">
                              <span className="font-mono text-xs text-primary mr-2 font-bold">{detail.account?.code}</span>
                              {detail.account?.name}
                            </td>
                            <td className="px-6 py-3 text-on-surface-variant">{detail.description || '-'}</td>
                            <td className="px-6 py-3 text-right text-emerald-500 font-medium">
                              {Number(detail.debit) > 0 ? `Rp ${Number(detail.debit).toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="px-6 py-3 text-right text-error font-medium">
                              {Number(detail.credit) > 0 ? `Rp ${Number(detail.credit).toLocaleString('id-ID')}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* INPUT JOURNAL TAB */}
        {activeTab === "input" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {editingJournalId ? "Edit Jurnal Transaksi" : "Input Jurnal Transaksi"}
            </h2>
            <form onSubmit={handleSubmitJournal} className="glass-panel p-4 sm:p-6 rounded-2xl border border-border/40 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Tanggal</label>
                  <input 
                    type="date" 
                    value={journalForm.date}
                    onChange={e => setJournalForm({...journalForm, date: e.target.value})}
                    className="input-field" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">No Referensi</label>
                  <input 
                    type="text" 
                    value={journalForm.reference}
                    onChange={e => setJournalForm({...journalForm, reference: e.target.value})}
                    className="input-field" 
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Deskripsi Transaksi</label>
                  <input 
                    type="text" 
                    value={journalForm.description}
                    onChange={e => setJournalForm({...journalForm, description: e.target.value})}
                    placeholder="Contoh: Setoran Modal Awal"
                    className="input-field" 
                    required 
                  />
                </div>
              </div>

              {/* Mobile Card-Based Line Items (sm:hidden) */}
              <div className="sm:hidden space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-on-surface-variant px-1">
                  <span>Daftar Akun & Nominal</span>
                  <span>{journalForm.details.length} Baris</span>
                </div>

                {journalForm.details.map((detail, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface/50 border border-border/40 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        Baris #{idx + 1}
                      </span>
                      {journalForm.details.length > 2 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveJournalDetail(idx)}
                          className="flex items-center gap-1 text-xs text-error hover:bg-error/10 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Pilih Akun</label>
                      <select 
                        value={detail.account_id}
                        onChange={(e) => handleDetailChange(idx, 'account_id', e.target.value)}
                        className="input-field py-2.5 text-xs font-medium w-full"
                        required
                      >
                        <option value="">-- Pilih Akun --</option>
                        {accounts.filter(a => a.is_active).map(a => (
                          <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                          Debit (Rp)
                        </label>
                        <input 
                          type="number" 
                          min="0" step="1"
                          placeholder="0"
                          value={detail.debit || ''}
                          onChange={(e) => handleDetailChange(idx, 'debit', e.target.value)}
                          className="input-field py-2 text-right text-emerald-500 font-bold text-sm bg-surface/80"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-error mb-1">
                          Kredit (Rp)
                        </label>
                        <input 
                          type="number" 
                          min="0" step="1"
                          placeholder="0"
                          value={detail.credit || ''}
                          onChange={(e) => handleDetailChange(idx, 'credit', e.target.value)}
                          className="input-field py-2 text-right text-error font-bold text-sm bg-surface/80"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile Totals & Balance Summary */}
                <div className="p-4 rounded-xl bg-surface/80 border border-border/50 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant">Total Debit:</span>
                    <span className="text-emerald-500 text-sm">
                      Rp {journalForm.details.reduce((s,d) => s + Number(d.debit || 0), 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant">Total Kredit:</span>
                    <span className="text-error text-sm">
                      Rp {journalForm.details.reduce((s,d) => s + Number(d.credit || 0), 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  {/* Balance indicator */}
                  {(() => {
                    const totalDebit = journalForm.details.reduce((s,d) => s + Number(d.debit || 0), 0);
                    const totalCredit = journalForm.details.reduce((s,d) => s + Number(d.credit || 0), 0);
                    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;
                    const diff = Math.abs(totalDebit - totalCredit);
                    
                    if (totalDebit === 0 && totalCredit === 0) return null;

                    return (
                      <div className={`mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-xs font-bold ${isBalanced ? 'text-emerald-500' : 'text-error'}`}>
                        <span className="flex items-center gap-1">
                          {isBalanced ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {isBalanced ? 'Status: Seimbang (Balanced)' : 'Status: Tidak Seimbang'}
                        </span>
                        {!isBalanced && (
                          <span>Selisih: Rp {diff.toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Desktop Table View (hidden sm:block) */}
              <div className="hidden sm:block border border-border/40 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase text-on-surface-variant border-b border-border/40 bg-surface/30">
                      <tr>
                        <th className="px-4 py-3 font-bold">Akun</th>
                        <th className="px-4 py-3 font-bold">Debit (Rp)</th>
                        <th className="px-4 py-3 font-bold">Kredit (Rp)</th>
                        <th className="px-4 py-3 font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-border/40">
                    {journalForm.details.map((detail, idx) => (
                      <tr key={idx} className="bg-surface/20">
                        <td className="p-2">
                          <select 
                            value={detail.account_id}
                            onChange={(e) => handleDetailChange(idx, 'account_id', e.target.value)}
                            className="input-field py-2"
                            required
                          >
                            <option value="">-- Pilih Akun --</option>
                            {accounts.filter(a => a.is_active).map(a => (
                              <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 w-48">
                          <input 
                            type="number" 
                            min="0" step="1"
                            value={detail.debit || ''}
                            onChange={(e) => handleDetailChange(idx, 'debit', e.target.value)}
                            className="input-field py-2 text-right text-emerald-500 font-semibold bg-surface/30"
                          />
                        </td>
                        <td className="p-2 w-48">
                          <input 
                            type="number" 
                            min="0" step="1"
                            value={detail.credit || ''}
                            onChange={(e) => handleDetailChange(idx, 'credit', e.target.value)}
                            className="input-field py-2 text-right text-error font-semibold bg-surface/30"
                          />
                        </td>
                        <td className="p-2 text-center w-16">
                          {journalForm.details.length > 2 && (
                            <button 
                              type="button"
                              onClick={() => handleRemoveJournalDetail(idx)}
                              className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors mx-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-surface/50 border-t border-border/40">
                    <tr>
                      <td className="px-4 py-3 font-bold text-right text-foreground">Total</td>
                      <td className="px-4 py-3 font-bold text-right text-emerald-500">
                        {journalForm.details.reduce((s,d) => s + Number(d.debit || 0), 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 font-bold text-right text-error">
                        {journalForm.details.reduce((s,d) => s + Number(d.credit || 0), 0).toLocaleString('id-ID')}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <button type="button" onClick={handleAddJournalDetail} className="btn-secondary py-2.5 sm:py-2 text-sm justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Baris
                </button>
                
                <div className="flex gap-2">
                  {editingJournalId && (
                    <button type="button" onClick={resetJournalForm} className="btn-secondary py-2.5 sm:py-2 px-4 flex-1 sm:flex-initial justify-center">
                      Batal
                    </button>
                  )}
                  <button type="submit" disabled={loading} className="btn-primary py-2.5 sm:py-2 px-6 flex-1 sm:flex-initial justify-center shadow-lg shadow-primary/25">
                    {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {editingJournalId ? "Perbarui Jurnal" : "Simpan Jurnal"}
                  </button>
                </div>
              </div>

            </form>
          </motion.div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface/40 p-4 rounded-xl border border-border/40">
              <div>
                <h2 className="text-xl font-bold text-foreground">Laporan Keuangan</h2>
                <p className="text-sm text-on-surface-variant">Neraca dan Laba Rugi terhitung hingga tanggal akhir.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <input 
                  type="date" 
                  value={reportDate}
                  onChange={e => setReportDate(e.target.value)}
                  className="input-field py-2 w-auto"
                />
                <button onClick={fetchReports} className="btn-primary py-2">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Generate
                </button>

                {/* Export dropdown: Neraca */}
                <div className="relative">
                  <button
                    onClick={() => setOpenExportMenu(openExportMenu === "balance" ? null : "balance")}
                    className="btn-secondary py-2 text-xs"
                  >
                    <BookOpen className="w-4 h-4 mr-1" /> Neraca
                    <span className="ml-1 text-[9px]">▼</span>
                  </button>
                  {openExportMenu === "balance" && (
                    <div className="absolute right-0 mt-1 z-20 bg-surface rounded-xl border border-border/40 shadow-xl overflow-hidden min-w-[130px]">
                      <button
                        onClick={(e) => { setOpenExportMenu(null); downloadExport(e, `/accounting/export/balance/pdf?end_date=${reportDate}`); }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-primary/10 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-error" /> PDF
                      </button>
                      <button
                        onClick={(e) => { setOpenExportMenu(null); downloadExport(e, `/accounting/export/balance/excel?end_date=${reportDate}`); }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-primary/10 flex items-center gap-2 border-t border-border/20"
                      >
                        <FileText className="w-4 h-4 text-emerald-500" /> Excel
                      </button>
                    </div>
                  )}
                </div>

                {/* Export dropdown: Laba Rugi */}
                <div className="relative">
                  <button
                    onClick={() => setOpenExportMenu(openExportMenu === "income" ? null : "income")}
                    className="btn-secondary py-2 text-xs"
                  >
                    <FileText className="w-4 h-4 mr-1" /> Laba Rugi
                    <span className="ml-1 text-[9px]">▼</span>
                  </button>
                  {openExportMenu === "income" && (
                    <div className="absolute right-0 mt-1 z-20 bg-surface rounded-xl border border-border/40 shadow-xl overflow-hidden min-w-[130px]">
                      <button
                        onClick={(e) => { setOpenExportMenu(null); downloadExport(e, `/accounting/export/income/pdf?end_date=${reportDate}`); }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-primary/10 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-error" /> PDF
                      </button>
                      <button
                        onClick={(e) => { setOpenExportMenu(null); downloadExport(e, `/accounting/export/income/excel?end_date=${reportDate}`); }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-primary/10 flex items-center gap-2 border-t border-border/20"
                      >
                        <FileText className="w-4 h-4 text-emerald-500" /> Excel
                      </button>
                    </div>
                  )}
                </div>

                {/* SPT */}
                <a
                  href={`${API_BASE_URL}/accounting/export/spt/pdf?year=${reportDate.slice(0, 4)}`}
                  className="btn-primary py-2 text-xs"
                  onClick={(e) => downloadExport(e, `/accounting/export/spt/pdf?year=${reportDate.slice(0, 4)}`)}
                >
                  <FileText className="w-4 h-4 mr-1" /> SPT 1771 PDF
                </a>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-primary"><RefreshCw className="w-8 h-8 mx-auto animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* BALANCE SHEET */}
                <div className="glass-panel p-6 rounded-2xl border border-border/40">
                  <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Balance Sheet (Neraca)
                  </h3>
                  
                  {balanceSheet && (
                    <div className="space-y-6 text-sm">
                      {/* Assets */}
                      <div>
                        <h4 className="font-bold uppercase tracking-wider text-on-surface-variant mb-2">Aset (Aktiva)</h4>
                        <div className="space-y-1">
                          {balanceSheet.assets.map((item:any, i:number) => (
                            <div key={i} className="flex justify-between py-1 border-b border-border/20">
                              <span>{item.code} - {item.name}</span>
                              <span className="font-semibold">Rp {Number(item.balance).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between py-2 mt-2 font-bold text-primary border-t border-border/40">
                          <span>TOTAL ASET</span>
                          <span>Rp {Number(balanceSheet.total_assets).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Liabilities & Equity */}
                      <div>
                        <h4 className="font-bold uppercase tracking-wider text-on-surface-variant mb-2">Kewajiban & Modal (Pasiva)</h4>
                        
                        <div className="mb-1 font-semibold text-foreground">Kewajiban</div>
                        <div className="space-y-1 pl-2 mb-3">
                          {balanceSheet.liabilities.map((item:any, i:number) => (
                            <div key={i} className="flex justify-between py-1 border-b border-border/20">
                              <span>{item.code} - {item.name}</span>
                              <span className="font-semibold">Rp {Number(item.balance).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mb-1 font-semibold text-foreground">Modal (Ekuitas)</div>
                        <div className="space-y-1 pl-2">
                          {balanceSheet.equity.map((item:any, i:number) => (
                            <div key={i} className="flex justify-between py-1 border-b border-border/20">
                              <span>{item.code} - {item.name}</span>
                              <span className="font-semibold">Rp {Number(item.balance).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between py-2 mt-4 font-bold text-primary border-t border-border/40">
                          <span>TOTAL PASIVA</span>
                          <span>Rp {Number(balanceSheet.total_liabilities + balanceSheet.total_equity).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Balance Status */}
                      <div className={`p-3 rounded-lg text-center font-bold border ${balanceSheet.is_balanced ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-error/10 text-error border-error/20'}`}>
                        {balanceSheet.is_balanced ? 'SEIMBANG (BALANCED)' : 'TIDAK SEIMBANG (UNBALANCED)'}
                      </div>
                    </div>
                  )}
                </div>

                {/* INCOME STATEMENT */}
                <div className="glass-panel p-6 rounded-2xl border border-border/40">
                  <h3 className="text-lg font-bold text-purple-500 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Income Statement (Laba/Rugi)
                  </h3>

                  {incomeStatement && (
                    <div className="space-y-6 text-sm">
                      {/* Revenue */}
                      <div>
                        <h4 className="font-bold uppercase tracking-wider text-on-surface-variant mb-2">Pendapatan</h4>
                        <div className="space-y-1">
                          {incomeStatement.revenues.map((item:any, i:number) => (
                            <div key={i} className="flex justify-between py-1 border-b border-border/20">
                              <span>{item.code} - {item.name}</span>
                              <span className="font-semibold text-emerald-500">Rp {Number(item.balance).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between py-2 mt-2 font-bold text-emerald-500 border-t border-border/40">
                          <span>TOTAL PENDAPATAN</span>
                          <span>Rp {Number(incomeStatement.total_revenue).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Expenses */}
                      <div>
                        <h4 className="font-bold uppercase tracking-wider text-on-surface-variant mb-2">Beban Operasional</h4>
                        <div className="space-y-1">
                          {incomeStatement.expenses.map((item:any, i:number) => (
                            <div key={i} className="flex justify-between py-1 border-b border-border/20">
                              <span>{item.code} - {item.name}</span>
                              <span className="font-semibold text-error">Rp {Number(item.balance).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between py-2 mt-2 font-bold text-error border-t border-border/40">
                          <span>TOTAL BEBAN</span>
                          <span>Rp {Number(incomeStatement.total_expense).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Net Income */}
                      <div className={`flex justify-between p-4 mt-6 rounded-xl font-bold border ${incomeStatement.net_income >= 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-error/10 text-error border-error/20'}`}>
                        <span className="text-base uppercase">{incomeStatement.net_income >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}</span>
                        <span className="text-lg">Rp {Number(incomeStatement.net_income).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* BUKU BESAR (LEDGER) TAB */}
        {activeTab === "ledger" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Filter bar */}
            <div className="glass-panel rounded-2xl border border-border/40 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Filter Buku Besar</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Akun</label>
                  <select
                    value={ledgerFilter.account_id}
                    onChange={e => setLedgerFilter({ ...ledgerFilter, account_id: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Semua Akun</option>
                    {accounts.map((acc: any) => (
                      <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tipe</label>
                  <select
                    value={ledgerFilter.type}
                    onChange={e => setLedgerFilter({ ...ledgerFilter, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Semua Tipe</option>
                    <option value="Asset">Aset</option>
                    <option value="Liability">Kewajiban</option>
                    <option value="Equity">Ekuitas</option>
                    <option value="Revenue">Pendapatan</option>
                    <option value="Expense">Beban</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Dari Tanggal</label>
                  <input
                    type="date"
                    value={ledgerFilter.start_date}
                    onChange={e => setLedgerFilter({ ...ledgerFilter, start_date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={ledgerFilter.end_date}
                    onChange={e => setLedgerFilter({ ...ledgerFilter, end_date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={fetchLedger} disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <BookMarked className="w-4 h-4 mr-2" />}
                    Tampilkan
                  </button>
                </div>
                <div className="flex items-end gap-2">
                  <a
                    href={`${API_BASE_URL}/accounting/export/ledger/pdf?${new URLSearchParams({
                      account_id: ledgerFilter.account_id,
                      start_date: ledgerFilter.start_date,
                      end_date: ledgerFilter.end_date,
                      type: ledgerFilter.type,
                    }).toString()}`}
                    className="btn-secondary py-2 text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadExport(e, `/accounting/export/ledger/pdf?${new URLSearchParams({
                        account_id: ledgerFilter.account_id,
                        start_date: ledgerFilter.start_date,
                        end_date: ledgerFilter.end_date,
                        type: ledgerFilter.type,
                      }).toString()}`);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-1" /> PDF
                  </a>
                  <a
                    href={`${API_BASE_URL}/accounting/export/ledger/excel?${new URLSearchParams({
                      account_id: ledgerFilter.account_id,
                      start_date: ledgerFilter.start_date,
                      end_date: ledgerFilter.end_date,
                      type: ledgerFilter.type,
                    }).toString()}`}
                    className="btn-secondary py-2 text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadExport(e, `/accounting/export/ledger/excel?${new URLSearchParams({
                        account_id: ledgerFilter.account_id,
                        start_date: ledgerFilter.start_date,
                        end_date: ledgerFilter.end_date,
                        type: ledgerFilter.type,
                      }).toString()}`);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-1" /> Excel
                  </a>
                </div>
              </div>
            </div>

            {/* Ledger cards per account */}
            {ledgerData.length === 0 && !loading && (
              <div className="glass-panel p-8 text-center text-on-surface-variant rounded-2xl border border-border/40">
                Belum ada data buku besar. Pilih filter lalu klik Tampilkan.
              </div>
            )}

            {ledgerData.map((ledger: any) => (
              <div key={ledger.account.id} className="glass-panel rounded-2xl border border-border/40 overflow-hidden">
                {/* Account header */}
                <div className="bg-surface/50 p-4 sm:px-6 sm:py-4 border-b border-border/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2 flex-wrap">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-extrabold">{ledger.account.code}</span>
                      <span className="text-sm sm:text-base">{ledger.account.name}</span>
                      <span className="text-xs font-normal text-on-surface-variant bg-surface/50 px-2 py-0.5 rounded-full border border-border/30">
                        {ledger.account.type}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:gap-6 gap-3 text-left lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-border/20">
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Saldo Awal</div>
                      <div className="font-bold text-xs sm:text-sm">{fmtRp(ledger.opening_balance)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Total Debit</div>
                      <div className="font-bold text-xs sm:text-sm text-emerald-500">{fmtRp(ledger.total_debit)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Total Kredit</div>
                      <div className="font-bold text-xs sm:text-sm text-error">{fmtRp(ledger.total_credit)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Saldo Akhir</div>
                      <div className="font-bold text-sm sm:text-base text-primary">{fmtRp(ledger.closing_balance)}</div>
                    </div>
                  </div>
                </div>

                {/* Mutations table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-on-surface-variant border-b border-border/40">
                      <tr>
                        <th className="px-6 py-3 font-bold">Tanggal</th>
                        <th className="px-6 py-3 font-bold">Referensi</th>
                        <th className="px-6 py-3 font-bold">Keterangan</th>
                        <th className="px-6 py-3 font-bold text-right">Debit</th>
                        <th className="px-6 py-3 font-bold text-right">Kredit</th>
                        <th className="px-6 py-3 font-bold text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {ledger.mutations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-6 text-center text-on-surface-variant">
                            Tidak ada mutasi pada rentang ini.
                          </td>
                        </tr>
                      )}
                      {ledger.mutations.map((m: any) => (
                        <tr key={m.id} className="hover:bg-surface/40 transition-colors">
                          <td className="px-6 py-3 text-on-surface-variant whitespace-nowrap">{m.date}</td>
                          <td className="px-6 py-3 font-semibold text-foreground whitespace-nowrap">{m.journal_reference}</td>
                          <td className="px-6 py-3 text-on-surface-variant max-w-xs truncate">{m.journal_description}</td>
                          <td className="px-6 py-3 text-right text-emerald-500 font-medium">
                            {Number(m.debit) > 0 ? fmtRp(m.debit) : '-'}
                          </td>
                          <td className="px-6 py-3 text-right text-error font-medium">
                            {Number(m.credit) > 0 ? fmtRp(m.credit) : '-'}
                          </td>
                          <td className="px-6 py-3 text-right font-bold text-foreground">{fmtRp(m.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* PEMBIAYAAN (EXPENSES) TAB */}
        {activeTab === "expenses" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel rounded-2xl border border-border/40 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Total Pembiayaan</div>
                    <div className="text-xl font-extrabold text-foreground">
                      Rp {Number(expenseStats?.total_amount || 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-panel rounded-2xl border border-border/40 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <HandCoins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Transaksi</div>
                    <div className="text-xl font-extrabold text-foreground">{expenseStats?.total_expenses || 0} biaya</div>
                  </div>
                </div>
              </div>
              <div className="glass-panel rounded-2xl border border-border/40 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Bulan Ini</div>
                    <div className="text-xl font-extrabold text-foreground">
                      Rp {Number(expenseStats?.this_month || 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form + List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <form onSubmit={handleSubmitExpense} className="glass-panel p-6 rounded-2xl border border-border/40 space-y-5 lg:sticky lg:top-6 self-start">
                <div className="flex items-center gap-2">
                  <HandCoins className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Catat Pembiayaan Baru</h3>
                </div>
                <p className="text-xs text-on-surface-variant -mt-3">
                  Jurnal otomatis dibuat: <span className="text-error font-semibold">Debit Biaya</span> & <span className="text-emerald-500 font-semibold">Kredit Kas</span>
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Tanggal</label>
                    <input type="date" required value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })} className="input-field" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-on-surface-variant">Akun Pembayaran</label>
                    <select 
                      value={expenseForm.account_id} 
                      onChange={e => setExpenseForm({ ...expenseForm, account_id: e.target.value })} 
                      className="input-field w-full"
                    >
                      <option value="">Pilih Kas/Bank</option>
                      {accounts
                        .filter(a => a.type.toLowerCase().includes('kas') || a.type.toLowerCase().includes('bank'))
                        .map(a => (
                          <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Kategori Biaya</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })} className="input-field" required>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Deskripsi</label>
                  <input type="text" value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="Contoh: Biaya server Vercel bulanan" className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Nominal (Rp)</label>
                  <input type="number" min="1" step="any" required value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} placeholder="0" className="input-field" />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Pembiayaan
                </button>
              </form>

              {/* List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-foreground">Riwayat Pembiayaan</h3>
                  <button onClick={fetchExpenses} className="btn-secondary">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {expenses.length === 0 && !loading && (
                  <div className="glass-panel p-8 text-center text-on-surface-variant rounded-2xl border border-border/40">
                    Belum ada pembiayaan tercatat.
                  </div>
                )}

                {expenses.map((exp) => (
                  <div key={exp.id} className="glass-panel rounded-2xl border border-border/40 p-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground">{exp.reference}</span>
                        <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full font-semibold uppercase">{exp.category}</span>
                        {exp.journal && (
                          <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-semibold">Jurnal: {exp.journal.reference}</span>
                        )}
                      </div>
                      <div className="text-sm text-on-surface-variant mt-1 truncate">{exp.description || exp.category}</div>
                      <div className="text-xs text-on-surface-variant mt-1">
                        {exp.date} • {exp.payment_method || 'cash'} • {exp.account?.code ? `${exp.account.code} - ${exp.account.name}` : 'Kas Tunai'}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-extrabold text-error">- Rp {Number(exp.amount).toLocaleString('id-ID')}</div>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="text-on-surface-variant hover:text-error transition-colors mt-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* COA Modal */}
      <AnimatePresence>
        {isAccountModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAccountModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass-panel border border-border/40 p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-foreground mb-6">
                {editingAccount ? "Edit Akun" : "Tambah Akun Baru"}
              </h3>
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Kode Akun</label>
                  <input name="code" type="text" defaultValue={editingAccount?.code} className="input-field" required placeholder="Contoh: 101" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Nama Akun</label>
                  <input name="name" type="text" defaultValue={editingAccount?.name} className="input-field" required placeholder="Contoh: Kas Kecil" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Tipe Akun</label>
                  <select name="type" defaultValue={editingAccount?.type || "Asset"} className="input-field" required>
                    <option value="Asset">Aset (Aktiva)</option>
                    <option value="Liability">Kewajiban (Pasiva)</option>
                    <option value="Equity">Ekuitas (Modal)</option>
                    <option value="Revenue">Pendapatan</option>
                    <option value="Expense">Beban</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Status</label>
                  <select name="is_active" defaultValue={editingAccount ? String(editingAccount.is_active) : "true"} className="input-field" required>
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-border/40">
                  <button type="button" onClick={() => setIsAccountModalOpen(false)} className="btn-secondary">Batal</button>
                  <button type="submit" className="btn-primary">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
