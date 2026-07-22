import React, { useState } from 'react';
import { UserAdmin } from '../../types';
import { 
  UserCheck, 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Key
} from 'lucide-react';
import { confirmDelete, confirmAction, showSuccessToast, showErrorAlert } from '../../lib/swal';

interface ManajemenPenggunaProps {
  users: UserAdmin[];
  onAddUser: (user: UserAdmin) => void;
  onUpdateUser: (user: UserAdmin) => void;
  onDeleteUser: (id: string) => void;
}

export const ManajemenPengguna: React.FC<ManajemenPenggunaProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAdmin | null>(null);

  // Form State
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'Super Admin' | 'Petugas Admin' | 'Wali Kelas'>('Petugas Admin');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  const filteredUsers = users.filter(u => 
    u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingUser(null);
    setNama('');
    setUsername('');
    setRole('Petugas Admin');
    setStatus('Aktif');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAdmin) => {
    setEditingUser(user);
    setNama(user.nama);
    setUsername(user.username);
    setRole(user.role);
    setStatus(user.status);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user: UserAdmin) => {
    const newStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const confirmed = await confirmAction({
      title: `Ubah Status Pengguna?`,
      text: `Apakah Anda yakin ingin mengubah status pengguna "${user.nama}" menjadi ${newStatus}?`,
      icon: 'question',
      confirmButtonText: `Ya, Ubah ke ${newStatus}`
    });

    if (confirmed) {
      onUpdateUser({
        ...user,
        status: newStatus
      });
      showSuccessToast(`Status ${user.nama} berhasil diubah menjadi ${newStatus}.`);
    }
  };

  const handleDelete = async (user: UserAdmin) => {
    if (users.length <= 1) {
      showErrorAlert('Tidak Dapat Dihapus', 'Sistem membutuhkan minimal satu akun admin aktif.');
      return;
    }

    const confirmed = await confirmDelete(`Pengguna Admin "${user.nama}"`);
    if (confirmed) {
      onDeleteUser(user.id);
      showSuccessToast(`Pengguna ${user.nama} berhasil dihapus.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim() || !username.trim()) {
      showErrorAlert('Form Tidak Lengkap', 'Nama dan Username wajib diisi.');
      return;
    }

    if (editingUser) {
      const updated: UserAdmin = {
        ...editingUser,
        nama: nama.trim(),
        username: username.trim().toLowerCase(),
        role,
        status
      };
      onUpdateUser(updated);
      showSuccessToast(`Pengguna ${updated.nama} berhasil diperbarui.`);
    } else {
      const newUser: UserAdmin = {
        id: `usr-${Date.now()}`,
        nama: nama.trim(),
        username: username.trim().toLowerCase(),
        role,
        status,
        terakhirLogin: 'Baru saja'
      };
      onAddUser(newUser);
      showSuccessToast(`Pengguna baru ${newUser.nama} berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Add Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, username, role..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-800 outline-hidden"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Admin</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">No</th>
                <th className="p-3.5">Nama Petugas Admin</th>
                <th className="p-3.5">Username</th>
                <th className="p-3.5">Peran (Role)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Terakhir Login</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ada pengguna yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-500 font-medium">{index + 1}</td>
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                        {u.nama.charAt(0)}
                      </div>
                      <span>{u.nama}</span>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 font-semibold">{u.username}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-md font-semibold text-[11px] bg-purple-100 text-purple-800 border border-purple-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                          u.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Aktif' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <span>{u.status}</span>
                      </button>
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] font-mono">{u.terakhirLogin}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit Pengguna"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          title="Hapus Pengguna"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingUser ? `Edit Pengguna ${editingUser.nama}` : 'Tambah Admin Baru'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Lengkap & Gelar"
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Role / Peran</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Petugas Admin">Petugas Admin</option>
                    <option value="Wali Kelas">Wali Kelas</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Status Akun</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
