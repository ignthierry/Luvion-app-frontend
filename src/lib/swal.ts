import Swal from 'sweetalert2';

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonColor: '#10b981',
    background: '#18181b',
    color: '#ffffff',
    customClass: {
      popup: 'rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md',
      confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20'
    }
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#ef4444',
    background: '#18181b',
    color: '#ffffff',
    customClass: {
      popup: 'rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md',
      confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-red-500/20'
    }
  });
};

export const showWarning = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonColor: '#f59e0b',
    background: '#18181b',
    color: '#ffffff',
    customClass: {
      popup: 'rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md',
      confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20'
    }
  });
};

export const showConfirm = async (title: string, text?: string, confirmText: string = 'Ya, Hapus'): Promise<boolean> => {
  const result = await Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#3f3f46',
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    background: '#18181b',
    color: '#ffffff',
    customClass: {
      popup: 'rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md',
      confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-red-500/20',
      cancelButton: 'px-5 py-2.5 rounded-xl font-semibold text-sm'
    }
  });
  return result.isConfirmed;
};
