import React, { useState } from 'react';
import { Lock, User, Key, X, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { UserAdmin } from '../../types';
import { showErrorAlert, showSuccessToast } from '../../lib/swal';

interface AdminLoginModalProps {
  users: UserAdmin[];
  onLoginSuccess: (user: UserAdmin) => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  users,
  onLoginSuccess,
  onClose
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const found = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.status === 'Aktif'
    );

    if (found || username.toLowerCase() === 'admin') {
      const loggedUser = found || users[0];
      showSuccessToast(`Selamat datang kembali, ${loggedUser.nama}!`);
      onLoginSuccess(loggedUser);
    } else {
      showErrorAlert('Akses Ditolak', 'Username tidak ditemukan atau akun sedang nonaktif.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Login Portal Admin</h3>
              <p className="text-xs text-slate-400">Masuk untuk mengelola data siswa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Username Admin</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white placeholder-slate-500 outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Kata Sandi</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-xs text-white placeholder-slate-500 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-white rounded transition-colors"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Akses Demo Langsung:</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Username: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-300 font-mono">admin</code> | Sandi: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-300 font-mono">admin123</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>Masuk Ke Dashboard Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
