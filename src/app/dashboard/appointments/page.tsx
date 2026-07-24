"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
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
  CalendarPlus
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
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Janji Temu (Appointments Calendar)
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Visualisasi kalender & kelola CRUD jadwal janji temu pelanggan (AI n8n & Manual).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Janji Temu
          </button>
          <button
            onClick={loadAppointments}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass-panel text-foreground font-semibold hover:bg-surface/60 transition-all border border-border/40 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
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
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border truncate transition-transform hover:scale-[1.02] shadow-xs ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 border-emerald-500/50"
                            : apt.status === "CANCELLED"
                            ? "bg-rose-500/20 text-rose-950 dark:text-rose-200 border-rose-500/50"
                            : "bg-amber-500/30 text-amber-950 dark:text-amber-200 border-amber-500/50"
                        }`}
                      >
                        <span className="font-bold mr-1">
                          {formatTimeOnly(apt.appointment_date)}
                        </span>
                        <span>{apt.customer_name || apt.agenda}</span>
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
                            <p className="font-bold text-foreground">
                              {apt.customer_name || "Tanpa Nama"}
                            </p>
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
                    <p className="font-bold text-sm text-foreground">
                      {apt.customer_name || "Tanpa Nama"}
                    </p>
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
    </div>
  );
}
