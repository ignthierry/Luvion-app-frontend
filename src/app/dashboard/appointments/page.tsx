"use client";

import { useState, useEffect } from "react";
import { fetchApi, API_BASE_URL } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/swal";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  User, 
  RefreshCw,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListFilter,
  X,
  Plus,
  Edit3,
  Save,
  CalendarPlus,
  Link as LinkIcon,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Info,
  Layers,
  FileText,
  Code2,
  Globe,
  ArrowRight
} from "lucide-react";
import { 
  format, 
  parseISO, 
  isValid, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { id } from "date-fns/locale";

function GoogleCalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="3.5" fill="#FFFFFF" stroke="#4285F4" strokeWidth="1.5" />
      <path d="M16 2V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 2V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 9.5H21" stroke="#4285F4" strokeWidth="1.5" />
      <circle cx="7.5" cy="13.5" r="1.5" fill="#EA4335" />
      <circle cx="12" cy="13.5" r="1.5" fill="#FBBC05" />
      <circle cx="16.5" cy="13.5" r="1.5" fill="#34A853" />
      <circle cx="7.5" cy="17.5" r="1.5" fill="#4285F4" />
      <circle cx="12" cy="17.5" r="1.5" fill="#9333EA" />
      <circle cx="16.5" cy="17.5" r="1.5" fill="#EA4335" />
    </svg>
  );
}

interface AppointmentData {
  id: number;
  session_id: string;
  customer_name: string | null;
  appointment_date: string;
  agenda: string;
  status: "PENDING_CONFIRMATION" | "CONFIRMED" | "CANCELLED" | string;
  created_at: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<{ day: Date; items: AppointmentData[] } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Google Calendar Sync states
  const [isGoogleSyncModalOpen, setIsGoogleSyncModalOpen] = useState(false);
  const [activeSyncTab, setActiveSyncTab] = useState<"url" | "file" | "webhook">("url");
  const [googleIcalUrl, setGoogleIcalUrl] = useState("");
  const [isSyncingGcal, setIsSyncingGcal] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    total_found: number;
    new_count: number;
    updated_count: number;
    events: Array<{ action: string; customer_name: string; appointment_date: string; agenda: string }>;
  } | null>(null);
  const [selectedIcsFile, setSelectedIcsFile] = useState<File | null>(null);
  const [isUploadingIcs, setIsUploadingIcs] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Form states
  const [formCustomerName, setFormCustomerName] = useState("");
  const [formAppointmentDate, setFormAppointmentDate] = useState("");
  const [formAgenda, setFormAgenda] = useState("");
  const [formStatus, setFormStatus] = useState("PENDING_CONFIRMATION");
  const [formSessionId, setFormSessionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi("/appointments");
      setAppointments(data);
    } catch (e: any) {
      console.error(e);
      showError("Gagal Memuat", e.message || "Tidak dapat mengambil daftar janji temu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    if (typeof window !== "undefined") {
      const savedUrl = localStorage.getItem("luvion_gcal_ical_url");
      if (savedUrl) setGoogleIcalUrl(savedUrl);
    }
  }, []);

  // Sync Google Calendar via iCal URL
  const handleSyncGoogleCalendar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!googleIcalUrl.trim()) {
      showError("URL Kosong", "Silakan masukkan URL iCal Google Calendar Anda.");
      return;
    }

    setIsSyncingGcal(true);
    setSyncResult(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("luvion_gcal_ical_url", googleIcalUrl.trim());
      }

      const res = await fetchApi("/appointments/sync-google-calendar", {
        method: "POST",
        body: JSON.stringify({ url: googleIcalUrl.trim() }),
      });

      if (res.status === "success") {
        setSyncResult(res.data);
        showSuccess(
          "Sinkronisasi Berhasil!",
          `${res.data.new_count} event baru ditambahkan, ${res.data.updated_count} event diperbarui.`
        );
        loadAppointments();
      } else {
        showError("Sinkronisasi Gagal", res.message || "Terjadi kesalahan.");
      }
    } catch (err: any) {
      showError("Gagal Sinkronisasi", err.message || "Tidak dapat menghubungi server.");
    } finally {
      setIsSyncingGcal(false);
    }
  };

  // Import .ICS file
  const handleImportIcsFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIcsFile) {
      showError("File Kosong", "Silakan pilih file .ics hasil ekspor Google Calendar.");
      return;
    }

    setIsUploadingIcs(true);
    setSyncResult(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedIcsFile);

      const res = await fetchApi("/appointments/import-ics", {
        method: "POST",
        body: formData,
      });

      if (res.status === "success") {
        setSyncResult(res.data);
        showSuccess(
          "Import Berhasil!",
          `${res.data.new_count} event baru ditambahkan, ${res.data.updated_count} event diperbarui.`
        );
        setSelectedIcsFile(null);
        loadAppointments();
      } else {
        showError("Import Gagal", res.message || "Gagal memproses file .ics.");
      }
    } catch (err: any) {
      showError("Gagal Import", err.message || "Terjadi kesalahan saat mengunggah file.");
    } finally {
      setIsUploadingIcs(false);
    }
  };

  // Copy webhook URL
  const webhookUrl = `${API_BASE_URL.replace(/\/api\/?$/, "")}/api/webhooks/google-calendar`;
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  // Copy Google Apps Script
  const googleAppsScriptCode = `// Google Apps Script untuk sinkronisasi otomatis Google Calendar ke Luvion Database
function syncCalendarToLuvion() {
  var calendarId = 'primary'; // atau ID email kalender Anda
  var now = new Date();
  var future = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 hari ke depan
  
  var events = CalendarApp.getCalendarById(calendarId).getEvents(now, future);
  var webhookUrl = "${webhookUrl}";
  
  events.forEach(function(event) {
    var payload = {
      id: event.getId(),
      summary: event.getTitle(),
      description: event.getDescription() || "",
      start: event.getStartTime().toISOString(),
      end: event.getEndTime().toISOString(),
      status: "CONFIRMED"
    };
    
    UrlFetchApp.fetch(webhookUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  });
}`;

  const copyScriptCode = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Open Create Modal (optionally for a specific date)
  const openCreateModal = (targetDate?: Date) => {
    const defaultDate = targetDate ? format(targetDate, "yyyy-MM-dd'T'09:00") : format(new Date(), "yyyy-MM-dd'T'09:00");
    setFormCustomerName("");
    setFormAppointmentDate(defaultDate);
    setFormAgenda("");
    setFormStatus("PENDING_CONFIRMATION");
    setFormSessionId("");
    setIsCreateModalOpen(true);
  };

  // Open Detail Modal & Sync Edit Form State
  const openDetailModal = (apt: AppointmentData) => {
    setSelectedAppointment(apt);
    setIsEditing(false);
    setFormCustomerName(apt.customer_name || "");
    setFormAppointmentDate(
      apt.appointment_date ? format(parseISO(apt.appointment_date), "yyyy-MM-dd'T'HH:mm") : ""
    );
    setFormAgenda(apt.agenda || "");
    setFormStatus(apt.status || "PENDING_CONFIRMATION");
  };

  // Handle Create Appointment
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerName.trim() || !formAppointmentDate || !formAgenda.trim()) {
      showError("Input Incomplete", "Nama pelanggan, tanggal & waktu, serta agenda wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        customer_name: formCustomerName,
        appointment_date: formAppointmentDate,
        agenda: formAgenda,
        status: formStatus,
      };
      if (formSessionId.trim()) {
        payload.session_id = formSessionId.trim();
      }

      const res = await fetchApi("/appointments", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.status === "success" || res.data) {
        showSuccess("Berhasil", "Janji temu baru berhasil ditambahkan!");
        setIsCreateModalOpen(false);
        loadAppointments();
      } else {
        showError("Gagal", res.message || "Gagal membuat janji temu.");
      }
    } catch (err: any) {
      showError("Gagal", err.message || "Terjadi kesalahan saat menyimpan janji temu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Appointment (Edit Mode or Status Quick Action)
  const handleUpdateAppointment = async (e?: React.FormEvent, customStatus?: string) => {
    if (e) e.preventDefault();
    if (!selectedAppointment) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        customer_name: formCustomerName,
        appointment_date: formAppointmentDate,
        agenda: formAgenda,
        status: customStatus || formStatus,
      };

      const res = await fetchApi(`/appointments/${selectedAppointment.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.status === "success") {
        showSuccess("Berhasil Diperbarui", "Data janji temu telah diperbarui.");
        setIsEditing(false);
        loadAppointments();
        setSelectedAppointment({
          ...selectedAppointment,
          customer_name: formCustomerName,
          appointment_date: formAppointmentDate,
          agenda: formAgenda,
          status: customStatus || formStatus,
        });
      } else {
        showError("Gagal", res.message || "Gagal memperbarui janji temu.");
      }
    } catch (err: any) {
      showError("Gagal", err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Status Update
  const handleQuickStatusUpdate = async (aptId: number, newStatus: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetchApi(`/appointments/${aptId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === "success") {
        showSuccess("Status Diperbarui", `Status diubah menjadi ${newStatus}`);
        loadAppointments();
        if (selectedAppointment && selectedAppointment.id === aptId) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus });
          setFormStatus(newStatus);
        }
      }
    } catch (err: any) {
      showError("Gagal", err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (aptId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus janji temu ini?")) return;
    try {
      await fetchApi(`/appointments/${aptId}`, { method: "DELETE" });
      showSuccess("Terhapus", "Janji temu berhasil dihapus.");
      if (selectedAppointment?.id === aptId) {
        setSelectedAppointment(null);
      }
      loadAppointments();
    } catch (err: any) {
      showError("Gagal Hapus", err.message || "Terjadi kesalahan.");
    }
  };

  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch = 
      (item.customer_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.session_id?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.agenda?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calendar calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getAppointmentsForDay = (day: Date) => {
    return filteredAppointments.filter((item) => {
      if (!item.appointment_date) return false;
      const d = parseISO(item.appointment_date);
      return isValid(d) && isSameDay(d, day);
    });
  };

  const totalCount = appointments.length;
  const pendingCount = appointments.filter(a => a.status === "PENDING_CONFIRMATION").length;
  const confirmedCount = appointments.filter(a => a.status === "CONFIRMED").length;
  const cancelledCount = appointments.filter(a => a.status === "CANCELLED").length;

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = parseISO(dateStr);
      if (!isValid(d)) return dateStr;
      return format(d, "dd MMMM yyyy, HH:mm", { locale: id });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTimeOnly = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = parseISO(dateStr);
      if (!isValid(d)) return "";
      return format(d, "HH:mm");
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Janji Temu (Appointments Calendar)
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Visualisasi kalender & kelola CRUD jadwal janji temu pelanggan (AI n8n, Manual, & Google Calendar).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsGoogleSyncModalOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface/80 hover:bg-surface border border-blue-500/40 hover:border-blue-500 text-foreground font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all text-sm group"
          >
            <GoogleCalendarIcon className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold">
              Tarik dari Google Calendar
            </span>
          </button>
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Janji Temu
          </button>
          <button
            onClick={loadAppointments}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-lg hover:bg-secondary/90 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-border/40 space-y-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Janji Temu</span>
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{totalCount}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-2">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Menunggu Konfirmasi</span>
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-800 dark:text-amber-400">{pendingCount}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Dikonfirmasi</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-400">{confirmedCount}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-2">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Dibatalkan</span>
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-800 dark:text-rose-400">{cancelledCount}</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-border/40 flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Left: View Mode Toggle & Today button */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-1.5 p-1 bg-surface/60 border border-border/40 rounded-xl">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                viewMode === "calendar"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kalender
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Tabel List
            </button>
          </div>

          {viewMode === "calendar" && (
            <button
              onClick={goToToday}
              className="px-3 py-1.5 rounded-xl bg-surface/50 border border-border/40 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors"
            >
              Hari Ini
            </button>
          )}
        </div>

        {/* Center: Month Navigator */}
        {viewMode === "calendar" && (
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-surface/50 border border-border/40 text-on-surface-variant hover:text-foreground hover:bg-surface/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-base font-extrabold text-foreground min-w-[150px] text-center capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: id })}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-surface/50 border border-border/40 text-on-surface-variant hover:text-foreground hover:bg-surface/80 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Search & Filters */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Cari pelanggan / agenda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface/50 border border-border/40 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface/60 border border-border/40 rounded-xl text-xs py-2 px-3 text-foreground focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="PENDING_CONFIRMATION">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Display: CALENDAR VIEW */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-2xl border border-border/40 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Memuat data kalender janji temu...</p>
        </div>
      ) : viewMode === "calendar" ? (
        <div className="glass-panel rounded-2xl border border-border/40 p-4 space-y-3">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-2 text-center border-b border-border/40 pb-3">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((dayName, idx) => (
              <div
                key={dayName}
                className={`text-xs font-bold uppercase tracking-wider ${
                  idx >= 5 ? "text-rose-400/80" : "text-on-surface-variant"
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-2 auto-rows-fr">
            {calendarDays.map((day) => {
              const dayAppts = getAppointmentsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    if (dayAppts.length > 0) {
                      setSelectedDayAppointments({ day, items: dayAppts });
                    } else {
                      openCreateModal(day);
                    }
                  }}
                  className={`min-h-[110px] sm:min-h-[130px] p-2 rounded-xl border transition-all flex flex-col justify-between group relative ${
                    !isCurrentMonth
                      ? "bg-surface/10 border-border/20 opacity-40"
                      : isCurrentDay
                      ? "bg-primary/10 border-primary/60 shadow-lg shadow-primary/10"
                      : "bg-surface/30 border-border/30 hover:border-border/60 hover:bg-surface/50"
                  } cursor-pointer`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                        isCurrentDay
                          ? "bg-primary text-white"
                          : isCurrentMonth
                          ? "text-foreground"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateModal(day);
                      }}
                      title="Tambah Janji Temu pada Tanggal Ini"
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-primary transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Appointments list */}
                  <div className="space-y-1 my-1 flex-1 overflow-hidden">
                    {dayAppts.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(apt);
                        }}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border truncate transition-transform hover:scale-[1.02] shadow-xs flex items-center gap-1 ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 border-emerald-500/50"
                            : apt.status === "CANCELLED"
                            ? "bg-rose-500/20 text-rose-950 dark:text-rose-200 border-rose-500/50"
                            : "bg-amber-500/30 text-amber-950 dark:text-amber-200 border-amber-500/50"
                        }`}
                      >
                        {apt.session_id?.startsWith("GCAL-") && (
                          <GoogleCalendarIcon className="w-3 h-3 shrink-0" />
                        )}
                        <span className="font-bold mr-0.5">
                          {formatTimeOnly(apt.appointment_date)}
                        </span>
                        <span className="truncate">{apt.customer_name || apt.agenda}</span>
                      </div>
                    ))}

                    {dayAppts.length > 3 && (
                      <p className="text-[10px] text-center text-primary font-bold">
                        +{dayAppts.length - 3} lainnya...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE VIEW MODE */
        <div className="glass-panel rounded-2xl border border-border/40 overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CalendarIcon className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
              <p className="text-lg font-bold text-foreground">Tidak Ada Janji Temu</p>
              <button
                onClick={() => openCreateModal()}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
              >
                + Tambah Janji Temu
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/60 border-b border-border/40 text-on-surface-variant font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Pelanggan</th>
                    <th className="px-6 py-4">Session ID</th>
                    <th className="px-6 py-4">Jadwal Janji Temu</th>
                    <th className="px-6 py-4">Agenda</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                            {apt.customer_name ? apt.customer_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-foreground">
                                {apt.customer_name || "Tanpa Nama"}
                              </p>
                              {apt.session_id?.startsWith("GCAL-") && (
                                <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/25 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  <GoogleCalendarIcon className="w-3 h-3" />
                                  Google Cal
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-on-surface-variant">
                              Dibuat: {formatDateString(apt.created_at)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-on-surface-variant">
                        <span className="bg-surface/60 border border-border/40 px-2.5 py-1 rounded-md">
                          {apt.session_id}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-foreground font-semibold">
                        <div className="flex items-center gap-2 text-primary">
                          <CalendarIcon className="w-4 h-4 shrink-0" />
                          <span>{formatDateString(apt.appointment_date)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-on-surface-variant max-w-xs truncate">
                        {apt.agenda}
                      </td>

                      <td className="px-6 py-4">
                        {apt.status === "PENDING_CONFIRMATION" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                        {apt.status === "CONFIRMED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed
                          </span>
                        )}
                        {apt.status === "CANCELLED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-800 dark:text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            Cancelled
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openDetailModal(apt)}
                          className="px-3 py-1.5 rounded-lg bg-surface/60 hover:bg-surface text-xs font-semibold text-foreground border border-border/40"
                        >
                          Detail / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: CREATE APPOINTMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-border/40 p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-foreground rounded-lg hover:bg-surface/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Tambah Janji Temu Baru</h3>
                <p className="text-xs text-on-surface-variant">Buat acara janji temu di kalender</p>
              </div>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formCustomerName}
                  onChange={(e) => setFormCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Tanggal & Waktu Janji Temu *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formAppointmentDate}
                  onChange={(e) => setFormAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Agenda / Tujuan Konsultasi *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Konsultasi implementasi AI chatbot & n8n..."
                  value={formAgenda}
                  onChange={(e) => setFormAgenda(e.target.value)}
                  className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none"
                  >
                    <option value="PENDING_CONFIRMATION">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Session ID (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Otomatis jika kosong"
                    value={formSessionId}
                    onChange={(e) => setFormSessionId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/30">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface/60 text-on-surface-variant hover:text-foreground text-xs font-semibold border border-border/40"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPOINTMENT DETAIL & EDIT MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-border/40 p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-foreground rounded-lg hover:bg-surface/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-lg">
                  {selectedAppointment.customer_name ? selectedAppointment.customer_name.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">
                    {selectedAppointment.customer_name || "Tanpa Nama Pelanggan"}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                    Session ID: {selectedAppointment.session_id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  isEditing
                    ? "bg-surface/80 text-foreground border-border/60"
                    : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? "Batal Edit" : "Edit Data"}
              </button>
            </div>

            {isEditing ? (
              /* EDIT FORM */
              <form onSubmit={(e) => handleUpdateAppointment(e)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Nama Pelanggan
                  </label>
                  <input
                    type="text"
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tanggal & Waktu
                  </label>
                  <input
                    type="datetime-local"
                    value={formAppointmentDate}
                    onChange={(e) => setFormAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Agenda
                  </label>
                  <textarea
                    rows={3}
                    value={formAgenda}
                    onChange={(e) => setFormAgenda(e.target.value)}
                    className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-surface/50 border border-border/40 rounded-xl text-sm text-foreground focus:outline-none"
                  >
                    <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-surface/60 text-on-surface-variant text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-primary/25"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            ) : (
              /* DETAIL VIEW */
              <div className="space-y-4">
                <div className="space-y-4 text-sm bg-surface/30 p-4 rounded-xl border border-border/30">
                  {selectedAppointment.session_id?.startsWith("GCAL-") && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-700 dark:text-blue-300">
                      <GoogleCalendarIcon className="w-4 h-4 shrink-0" />
                      <div>
                        <p className="font-bold">Tersinkronisasi dari Google Calendar</p>
                        <p className="text-[11px] opacity-80">Event ini ditarik dan disimpan di database Luvion.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-medium">Jadwal Tanggal & Waktu:</span>
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDateString(selectedAppointment.appointment_date)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-on-surface-variant font-medium">Agenda / Purpose:</span>
                    <span className="font-semibold text-foreground text-right">
                      {selectedAppointment.agenda}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-medium">Status Konfirmasi:</span>
                    <span>
                      {selectedAppointment.status === "PENDING_CONFIRMATION" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30">
                          Pending Confirmation
                        </span>
                      )}
                      {selectedAppointment.status === "CONFIRMED" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
                          Confirmed
                        </span>
                      )}
                      {selectedAppointment.status === "CANCELLED" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-800 dark:text-rose-400 border border-rose-500/30">
                          Cancelled
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-border/30">
                    <span>Dibuat pada:</span>
                    <span>{formatDateString(selectedAppointment.created_at)}</span>
                  </div>
                </div>

                {/* Quick Status Buttons */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status Cepat:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleQuickStatusUpdate(selectedAppointment.id, "CONFIRMED")}
                      disabled={isSubmitting}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        selectedAppointment.status === "CONFIRMED"
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirm
                    </button>

                    <button
                      onClick={() => handleQuickStatusUpdate(selectedAppointment.id, "PENDING_CONFIRMATION")}
                      disabled={isSubmitting}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        selectedAppointment.status === "PENDING_CONFIRMATION"
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </button>

                    <button
                      onClick={() => handleQuickStatusUpdate(selectedAppointment.id, "CANCELLED")}
                      disabled={isSubmitting}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        selectedAppointment.status === "CANCELLED"
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/30 flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(selectedAppointment.id)}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Janji Temu
                  </button>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="px-4 py-2 rounded-xl bg-surface/60 hover:bg-surface text-foreground text-xs font-semibold border border-border/40"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: DAY APPOINTMENTS LIST MODAL */}
      {selectedDayAppointments && !selectedAppointment && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-border/40 p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedDayAppointments(null)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-foreground rounded-lg hover:bg-surface/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-foreground capitalize">
                  Janji Temu: {format(selectedDayAppointments.day, "dd MMMM yyyy", { locale: id })}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Total {selectedDayAppointments.items.length} janji temu pada hari ini.
                </p>
              </div>
              <button
                onClick={() => {
                  const day = selectedDayAppointments.day;
                  setSelectedDayAppointments(null);
                  openCreateModal(day);
                }}
                className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {selectedDayAppointments.items.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => {
                    setSelectedDayAppointments(null);
                    openDetailModal(apt);
                  }}
                  className="p-3 rounded-xl bg-surface/40 hover:bg-surface/80 border border-border/30 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-foreground">
                        {apt.customer_name || "Tanpa Nama"}
                      </p>
                      {apt.session_id?.startsWith("GCAL-") && (
                        <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/25 text-blue-700 dark:text-blue-300 px-1 py-0.2 rounded text-[9px] font-bold">
                          <GoogleCalendarIcon className="w-2.5 h-2.5" />
                          GCal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {formatTimeOnly(apt.appointment_date)} - {apt.agenda}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      apt.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : apt.status === "CANCELLED"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: GOOGLE CALENDAR SYNC MODAL */}
      {isGoogleSyncModalOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-blue-500/30 p-6 sm:p-8 space-y-6 relative shadow-2xl my-8">
            <button
              onClick={() => setIsGoogleSyncModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-on-surface-variant hover:text-foreground rounded-xl hover:bg-surface/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <GoogleCalendarIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    Tarik Data Google Calendar
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 uppercase tracking-wide">
                    Sync to DB
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Sinkronisasikan seluruh jadwal event dari Google Calendar ke dalam database & kalender Luvion.
                </p>
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-2 p-1.5 bg-surface/50 border border-border/40 rounded-2xl">
              <button
                onClick={() => setActiveSyncTab("url")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSyncTab === "url"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>URL iCal (Rekomendasi)</span>
              </button>
              <button
                onClick={() => setActiveSyncTab("file")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSyncTab === "file"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload File .ICS</span>
              </button>
              <button
                onClick={() => setActiveSyncTab("webhook")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSyncTab === "webhook"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Webhook Otomatis</span>
              </button>
            </div>

            {/* TAB 1: SYNC VIA URL ICAL */}
            {activeSyncTab === "url" && (
              <div className="space-y-6">
                <form onSubmit={handleSyncGoogleCalendar} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Alamat Rahasia iCal Google Calendar (Secret iCal URL) *
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        required
                        placeholder="https://calendar.google.com/calendar/ical/contoh%40gmail.com/private-xxxx/basic.ics"
                        value={googleIcalUrl}
                        onChange={(e) => setGoogleIcalUrl(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-3 bg-surface/50 border border-border/40 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none transition-all font-mono"
                      />
                      {googleIcalUrl && (
                        <button
                          type="button"
                          onClick={() => setGoogleIcalUrl("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      URL ini akan otomatis disimpan di browser Anda untuk sinkronisasi berikutnya.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSyncingGcal || !googleIcalUrl.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-primary hover:opacity-95 text-white font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
                  >
                    {isSyncingGcal ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengunduh Event dari Google Calendar & Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <GoogleCalendarIcon className="w-4 h-4" />
                        <span>Mulai Tarik Data ke Database Sekarang</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Sync Results Banner */}
                {syncResult && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>Sinkronisasi Sukses Selesai</span>
                      </div>
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Total {syncResult.total_found} Event Ditemukan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-surface/50 border border-border/30">
                        <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Event Baru Ditambahkan</span>
                        <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">+{syncResult.new_count}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface/50 border border-border/30">
                        <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Event Diperbarui</span>
                        <span className="text-lg font-extrabold text-blue-700 dark:text-blue-300">{syncResult.updated_count}</span>
                      </div>
                    </div>

                    {syncResult.events.length > 0 && (
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
                        {syncResult.events.slice(0, 10).map((ev, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface/40 border border-border/20">
                            <span className="font-semibold text-foreground truncate max-w-[240px]">
                              {ev.customer_name} ({ev.agenda})
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ev.action === "created" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                            }`}>
                              {ev.action === "created" ? "Baru" : "Update"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step by Step Guide */}
                <div className="p-4 rounded-2xl bg-surface/30 border border-border/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-500" />
                      Cara Mengambil Secret iCal URL dari Google Calendar
                    </h4>
                    <a
                      href="https://calendar.google.com/calendar/u/0/r/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      Buka Google Calendar <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2 text-xs text-on-surface-variant">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                      <p>Buka <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline">calendar.google.com</a> di browser komputer Anda.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                      <p>Pada panel kiri di bawah <b>&quot;Kalender saya&quot;</b>, arahkan kursor ke nama kalender Anda ➔ klik tombol <b>titik tiga (⋮)</b> ➔ pilih <b>Pengaturan dan berbagi (Settings and sharing)</b>.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                      <p>Gulir halaman ke bawah sampai ke bagian <b>&quot;Integrasikan kalender&quot; (Integrate calendar)</b>.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                      <p>Cari kotak <b>&quot;Alamat rahasia dalam format iCal&quot; (Secret address in iCal format)</b>, lalu klik tombol <b>Salin (Copy)</b>.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">5</span>
                      <p>Tempel (Paste) link tersebut pada kolom input di atas, lalu klik <b>&quot;Mulai Tarik Data ke Database&quot;</b>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: IMPORT FILE .ICS */}
            {activeSyncTab === "file" && (
              <div className="space-y-5">
                <form onSubmit={handleImportIcsFile} className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-border/60 hover:border-primary/60 rounded-2xl bg-surface/20 hover:bg-surface/40 transition-all text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {selectedIcsFile ? selectedIcsFile.name : "Pilih File .ICS Google Calendar"}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {selectedIcsFile
                          ? `${(selectedIcsFile.size / 1024).toFixed(1)} KB`
                          : "Format kalender standar .ics (RFC 5545)"}
                      </p>
                    </div>

                    <input
                      type="file"
                      accept=".ics,text/calendar"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedIcsFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="ics-file-input"
                    />
                    <label
                      htmlFor="ics-file-input"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border/40 hover:border-primary text-xs font-bold text-foreground cursor-pointer transition-all shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {selectedIcsFile ? "Ganti File" : "Jelajahi File"}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingIcs || !selectedIcsFile}
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
                  >
                    {isUploadingIcs ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses File & Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Impor File ke Database</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Step Guide for Exporting ICS */}
                <div className="p-4 rounded-2xl bg-surface/30 border border-border/30 space-y-2 text-xs text-on-surface-variant">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5 uppercase text-[11px]">
                    <Info className="w-3.5 h-3.5 text-primary" />
                    Cara Mendapatkan File .ICS dari Google Calendar:
                  </h4>
                  <p>1. Buka <b>Google Calendar Settings ➔ Impor & Ekspor (Import & Export)</b>.</p>
                  <p>2. Klik tombol <b>Ekspor (Export)</b> untuk mengunduh file zip kalender Anda.</p>
                  <p>3. Ekstrak zip dan pilih file <code>.ics</code> kalender Anda di atas.</p>
                </div>
              </div>
            )}

            {/* TAB 3: REALTIME WEBHOOK & SCRIPT */}
            {activeSyncTab === "webhook" && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-surface/30 border border-border/30 space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Endpoint Webhook Sinkronisasi Real-time
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={webhookUrl}
                        className="w-full px-3 py-2 bg-surface/60 border border-border/40 rounded-xl text-xs font-mono text-foreground focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={copyWebhookUrl}
                        className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md"
                      >
                        {copiedWebhook ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedWebhook ? "Tersalin" : "Salin"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google Apps Script Snippet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-primary" />
                      Google Apps Script (Trigger Otomatis Setiap Buat Event)
                    </label>
                    <button
                      type="button"
                      onClick={copyScriptCode}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedScript ? "Script Tersalin!" : "Salin Script"}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-surface/80 border border-border/40 text-[11px] font-mono text-foreground overflow-x-auto max-h-48 leading-relaxed">
                    {googleAppsScriptCode}
                  </pre>
                  <p className="text-[11px] text-on-surface-variant">
                    Tempelkan script ini di <b>Google Apps Script (script.google.com)</b> dan buat trigger harian/event-based untuk sinkronisasi otomatis tanpa perlu membuka dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-border/30 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsGoogleSyncModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-surface/60 hover:bg-surface text-foreground text-xs font-semibold border border-border/40 transition-colors"
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
