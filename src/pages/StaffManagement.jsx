import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  KeyRound,
  Mail,
  Lock,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  Sparkles,
  X,
  UserX
} from 'lucide-react';

export const StaffManagement = () => {
  const { users, addUser, updateUser, deleteUser, currentUser, notify } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Sales Staff',
    status: 'Active'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Sales Staff',
      status: 'Active'
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || user.username || '',
      password: user.password || '',
      role: user.role || 'Sales Staff',
      status: user.status || 'Active'
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: generated }));
    setShowPassword(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      notify('Please fill out all required fields', 'error');
      return;
    }

    if (editingUser) {
      const res = updateUser(editingUser.id, formData);
      if (res?.success) {
        handleCloseModal();
      }
    } else {
      const res = addUser(formData);
      if (res?.success) {
        handleCloseModal();
      }
    }
  };

  const handleDelete = (user) => {
    if (user.id === currentUser?.id) {
      notify('You cannot delete your own active administrator account!', 'error');
      return;
    }
    if (confirm(`Are you sure you want to remove staff member "${user.name}" (${user.email})?`)) {
      deleteUser(user.id);
    }
  };

  const handleCopyCredentials = (user) => {
    const text = `MobiPulse Login:\nEmail: ${user.email || user.username}\nPassword: ${user.password}\nRole: ${user.role}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    notify(`Copied credentials for ${user.name}!`, 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered staff list
  const filteredUsers = users.filter((u) => {
    const nameMatch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (u.email || u.username || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;

    if (roleFilter === 'all') return matchesSearch;
    return matchesSearch && u.role === roleFilter;
  });

  const totalStaff = users.filter((u) => u.role === 'Sales Staff').length;
  const totalAdmins = users.filter((u) => u.role === 'Admin').length;

  return (
    <div className="space-y-3 animate-fade-in pb-6">
      {/* Compact Top Banner */}
      <div className="rounded-xl bg-gradient-to-r from-sky-50 via-slate-50 to-pink-50 border border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-[#701F47] text-white shadow-xs shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              Staff &amp; User Management
            </h2>
            <p className="text-[11px] font-medium text-slate-500 truncate hidden sm:block">
              Assign login emails, manage secure passwords, and control team permissions
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-3 py-1.5 bg-[#701F47] hover:bg-[#5a1738] active:scale-[0.99] text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Low-Profile Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="py-2 px-3 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-500 block leading-tight">Total Accounts</span>
            <span className="text-sm font-black text-slate-900 leading-tight">{users.length} Users</span>
          </div>
          <Users className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        <div className="py-2 px-3 bg-pink-50/40 border border-pink-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-pink-700 block leading-tight">Sales Staff</span>
            <span className="text-sm font-black text-pink-900 leading-tight">{totalStaff} Members</span>
          </div>
          <UserCheck className="w-4 h-4 text-pink-600 shrink-0" />
        </div>

        <div className="py-2 px-3 bg-sky-50/40 border border-sky-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-sky-700 block leading-tight">Administrators</span>
            <span className="text-sm font-black text-sky-900 leading-tight">{totalAdmins} Admins</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
        </div>
      </div>

      {/* Streamlined Search & Filter Row */}
      <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by staff name or email..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#701F47] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('Sales Staff')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              roleFilter === 'Sales Staff'
                ? 'bg-pink-600 text-white'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
            }`}
          >
            Sales Staff ({totalStaff})
          </button>
          <button
            onClick={() => setRoleFilter('Admin')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              roleFilter === 'Admin'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            Admins ({totalAdmins})
          </button>
        </div>
      </div>

      {/* Reduced-Height Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredUsers.map((user) => {
          const isAdmin = user.role === 'Admin';
          const isCurrentUser = user.id === currentUser?.id;
          const isInactive = user.status === 'Inactive';

          return (
            <div
              key={user.id}
              className={`bg-white border rounded-xl p-3.5 shadow-2xs space-y-2.5 relative transition-all hover:shadow-sm ${
                isInactive
                  ? 'border-slate-300 bg-slate-50/50 opacity-75'
                  : isAdmin
                  ? 'border-sky-200'
                  : 'border-pink-200'
              }`}
            >
              {/* Card Header: Avatar, Name, Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0 shadow-2xs ${
                      isAdmin ? 'bg-sky-500' : 'bg-pink-500'
                    }`}
                  >
                    {user.name?.slice(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-xs truncate leading-tight">
                        {user.name}
                      </h3>
                      {isCurrentUser && (
                        <span className="text-[9px] font-bold px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          isAdmin
                            ? 'bg-sky-50 text-sky-800 border border-sky-200'
                            : 'bg-pink-50 text-pink-800 border border-pink-200'
                        }`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isInactive
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {user.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick actions top-right */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(user)}
                    title="Edit Staff & Credentials"
                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {!isCurrentUser && (
                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      title="Remove Staff"
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Compact Credentials Box */}
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Email</span>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-mono font-bold text-slate-800 truncate text-[11px]">
                      {user.email || user.username}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(user)}
                      title="Copy Login Details"
                      className="p-0.5 hover:bg-slate-200 text-slate-400 hover:text-slate-800 rounded transition cursor-pointer shrink-0"
                    >
                      {copiedId === user.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Password</span>
                  <span className="font-mono font-semibold text-slate-700 text-[11px]">
                    {user.password ? '••••••••' : 'No password'}
                  </span>
                </div>
              </div>

              {/* Permission Tag */}
              <div
                className={`text-[10px] font-semibold px-2 py-1 rounded-lg border leading-tight ${
                  isAdmin
                    ? 'bg-sky-50/60 border-sky-100 text-sky-900'
                    : 'bg-pink-50/60 border-pink-100 text-pink-900'
                }`}
              >
                {isAdmin
                  ? 'Full Admin: Inventory, Purchases, Reports, Settings & Staff'
                  : 'Staff: POS Quick Billing, Catalog & Customer Orders'}
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <UserX className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-xs">No Staff Members Found</h3>
          <p className="text-[11px] text-slate-500">
            Try adjusting your search query or filter.
          </p>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 shadow-2xl space-y-4 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#701F47] text-white">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    {editingUser ? 'Edit Staff & Credentials' : 'Create New Staff Member'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {editingUser
                      ? 'Update name, login email, password or permissions.'
                      : 'Create a new login account for sales staff or admin.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Staff Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-600 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-[#701F47] focus:bg-white"
                />
              </div>

              {/* Login Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Login Email Address <span className="text-rose-600 font-extrabold">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-medium focus:outline-none focus:border-[#701F47] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Login Password <span className="text-rose-600 font-extrabold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] text-[#701F47] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password..."
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-8 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-medium focus:outline-none focus:border-[#701F47] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-[#701F47] focus:bg-white cursor-pointer"
                  >
                    <option value="Sales Staff">Sales Staff</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-[#701F47] focus:bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#701F47] hover:bg-[#5a1738] active:scale-[0.99] text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingUser ? 'Save Changes' : 'Create Staff'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
