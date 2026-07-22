import Swal from 'sweetalert2';

// Custom SweetAlert Mixin for sleek notifications
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showSuccessToast = (message: string) => {
  Toast.fire({
    icon: 'success',
    title: message
  });
};

export const showErrorToast = (message: string) => {
  Toast.fire({
    icon: 'error',
    title: message
  });
};

export const showInfoToast = (message: string) => {
  Toast.fire({
    icon: 'info',
    title: message
  });
};

export const confirmAction = async ({
  title,
  text,
  icon = 'warning',
  confirmButtonText = 'Ya, Lanjutkan',
  cancelButtonText = 'Batal',
  confirmButtonColor = '#059669', // Emerald 600
  cancelButtonColor = '#6b7280'  // Gray 500
}: {
  title: string;
  text: string;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl shadow-xl font-sans',
      confirmButton: 'px-5 py-2.5 rounded-xl text-white font-medium shadow-md transition-all',
      cancelButton: 'px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-all mr-2'
    }
  });

  return result.isConfirmed;
};

export const confirmDelete = async (itemName: string = 'data ini'): Promise<boolean> => {
  return confirmAction({
    title: 'Konfirmasi Hapus Data',
    text: `Apakah Anda yakin ingin menghapus ${itemName}? Data yang dihapus tidak dapat dikembalikan!`,
    icon: 'error',
    confirmButtonText: 'Ya, Hapus Data',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626' // Red 600
  });
};

export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#059669',
    customClass: {
      popup: 'rounded-2xl shadow-xl font-sans',
      confirmButton: 'px-6 py-2.5 rounded-xl text-white font-medium shadow-md'
    }
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Mengerti',
    confirmButtonColor: '#dc2626',
    customClass: {
      popup: 'rounded-2xl shadow-xl font-sans',
      confirmButton: 'px-6 py-2.5 rounded-xl text-white font-medium shadow-md'
    }
  });
};

export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'Mengerti',
    confirmButtonColor: '#d97706',
    customClass: {
      popup: 'rounded-2xl shadow-xl font-sans',
      confirmButton: 'px-6 py-2.5 rounded-xl text-white font-medium shadow-md'
    }
  });
};
