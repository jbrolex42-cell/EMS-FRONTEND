import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/formatTime';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  FiUserPlus, FiTrash2, FiShield, FiLock, FiMail,
  FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff,
  FiAlertTriangle, FiCheckCircle, FiX, FiRefreshCw
} from 'react-icons/fi';
import Loader from '../../components/Loader';
import { KENYAN_COUNTIES } from '../../utils/constants';

/* ── Guard: only superadmin may see this page ─────────────────────────── */
function AccessDenied() {
  return (
    <AdminLayout title="Admin Management">
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <FiShield className="text-red-400" size={28} />
        </div>
        <h2 className="text-ems-white text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-ems-muted text-sm max-w-xs">
          Only <span className="text-red-400 font-medium">Superadmins</span> can manage administrator accounts.
        </p>
      </div>
    </AdminLayout>
  );
}

/* ── Confirm delete modal ─────────────────────────────────────────────── */
function ConfirmModal({ admin, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm ems-card border border-red-500/20 shadow-2xl shadow-red-500/10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="text-red-400" size={18} />
          </div>
          <div>
            <h3 className="text-ems-white font-semibold text-sm">Remove Administrator</h3>
            <p className="text-ems-muted text-xs mt-1 leading-relaxed">
              This will permanently deactivate{' '}
              <span className="text-white font-medium">{admin.firstName} {admin.lastName}</span>'s
              admin account. This action cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} className="text-ems-muted hover:text-white ml-auto flex-shrink-0">
            <FiX size={16} />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-ems-border text-ems-muted text-sm hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
            Remove Admin
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Create admin slide-over panel ───────────────────────────────────── */
function CreateAdminPanel({ onClose, onSuccess }) {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/admin/create-admin', { ...data, role: 'admin' });
      toast.success(`Admin account created for ${data.firstName} ${data.lastName}`);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-ems-dark border-l border-ems-border h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-ems-dark border-b border-ems-border px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FiUserPlus className="text-purple-400" size={15} />
            </div>
            <div>
              <h2 className="text-ems-white font-semibold text-sm">Create Administrator</h2>
              <p className="text-ems-muted text-xs">Superadmin action</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ems-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-ems-border/30">
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Notice */}
          <div className="flex gap-3 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/15">
            <FiShield className="text-purple-400 flex-shrink-0 mt-0.5" size={14} />
            <p className="text-ems-muted text-xs leading-relaxed">
              Admin accounts have elevated privileges. They can manage users, view all emergencies, and access the fleet. Only <span className="text-purple-400">Superadmins</span> can create or remove admin accounts.
            </p>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">First Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted" size={13} />
                <input {...register('firstName', { required: 'Required' })}
                  placeholder="Jane"
                  className={`ems-input pl-9 text-sm ${errors.firstName ? 'border-red-500/70' : ''}`} />
              </div>
              {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Last Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted" size={13} />
                <input {...register('lastName', { required: 'Required' })}
                  placeholder="Doe"
                  className={`ems-input pl-9 text-sm ${errors.lastName ? 'border-red-500/70' : ''}`} />
              </div>
              {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted" size={13} />
              <input type="email" {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
              })}
                placeholder="jane@emskenya.co.ke"
                className={`ems-input pl-9 text-sm ${errors.email ? 'border-red-500/70' : ''}`} />
            </div>
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted" size={13} />
              <input type="tel" {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^0[0-9]{9}$/, message: 'Enter a valid Kenyan number (e.g. 0712345678)' }
              })}
                placeholder="0712345678"
                className={`ems-input pl-9 text-sm ${errors.phone ? 'border-red-500/70' : ''}`} />
            </div>
            {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
          </div>

          {/* County */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">County</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" size={13} />
              <select {...register('address.county')} className="ems-input pl-9 text-sm appearance-none cursor-pointer">
                <option value="">Select county</option>
                {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Temporary Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted" size={13} />
              <input type={showPass ? 'text' : 'password'} {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Must be at least 8 characters' }
              })}
                placeholder="Min. 8 characters"
                className={`ems-input pl-9 pr-10 text-sm ${errors.password ? 'border-red-500/70' : ''}`} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors">
                {showPass ? <FiEyeOff size={13} /> : <FiEye size={13} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted" size={13} />
              <input type="password" {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: v => v === password || 'Passwords do not match'
              })}
                placeholder="Repeat password"
                className={`ems-input pl-9 text-sm ${errors.confirmPassword ? 'border-red-500/70' : ''}`} />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {loading ? <Loader size="sm" /> : <><FiUserPlus size={15} /> Create Admin Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────── */
export default function AdminManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Block non-superadmins immediately
  if (user?.role !== 'superadmin') return <AccessDenied />;

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users?role=admin&limit=100');
      setAdmins(res.data.users || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`);
      toast.success(`${deleteTarget.firstName} ${deleteTarget.lastName} has been removed`);
      setDeleteTarget(null);
      fetchAdmins();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to remove admin');
    } finally {
      setDeleting(false);
    }
  };

  const activeAdmins = admins.filter(a => a.isActive);
  const inactiveAdmins = admins.filter(a => !a.isActive);

  return (
    <AdminLayout title="Admin Management">
      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmModal
          admin={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Create slide-over */}
      {showCreate && (
        <CreateAdminPanel
          onClose={() => setShowCreate(false)}
          onSuccess={fetchAdmins}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 text-xs font-medium uppercase tracking-widest">Superadmin Console</span>
          </div>
          <p className="text-ems-muted text-sm">Manage administrator accounts for EMS Kenya</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAdmins}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white text-sm transition-colors">
            <FiRefreshCw size={13} />
          </button>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors shadow-lg shadow-purple-500/20">
            <FiUserPlus size={14} />
            New Admin
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Admins', value: admins.length, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Active', value: activeAdmins.length, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Inactive', value: inactiveAdmins.length, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`ems-card border ${bg} text-center py-4`}>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-ems-muted text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Admins table */}
      <div className="ems-card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-ems-white font-semibold flex items-center gap-2">
            <FiShield className="text-purple-400" size={16} />
            Administrator Accounts
          </h3>
          <span className="text-ems-muted text-xs">{admins.length} total</span>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                  {['Administrator', 'Email', 'Phone', 'County', 'Status', 'Joined', 'Action'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ems-border">
                {admins.map(admin => (
                  <tr key={admin._id} className="hover:bg-ems-dark/60 transition-colors group">
                    {/* Name + avatar */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-400 text-xs font-bold">
                            {admin.firstName?.[0]}{admin.lastName?.[0]}
                          </span>
                        </div>
                        <span className="text-ems-white font-medium">
                          {admin.firstName} {admin.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-ems-muted text-xs">{admin.email}</td>
                    <td className="py-3.5 pr-4 text-ems-muted text-xs">{admin.phone || '—'}</td>
                    <td className="py-3.5 pr-4 text-ems-muted text-xs">{admin.address?.county || '—'}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`status-badge flex items-center gap-1.5 w-fit ${
                        admin.isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-ems-muted text-xs">{timeAgo(admin.createdAt)}</td>
                    <td className="py-3.5">
                      {/* Prevent deleting self */}
                      {admin._id !== user._id ? (
                        <button
                          onClick={() => setDeleteTarget(admin)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
                          title="Remove admin"
                        >
                          <FiTrash2 size={12} /> Remove
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 text-ems-muted text-xs">You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {admins.length === 0 && (
              <div className="text-center py-16">
                <FiUserPlus className="text-ems-muted mx-auto mb-3" size={24} />
                <p className="text-ems-muted text-sm">No admin accounts found</p>
                <p className="text-ems-muted text-xs mt-1">Click "New Admin" to create the first one</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-ems-dark border border-ems-border">
        <FiLock className="text-ems-muted flex-shrink-0 mt-0.5" size={13} />
        <p className="text-ems-muted text-xs leading-relaxed">
          <span className="text-ems-white font-medium">Security notice:</span>{' '}
          All admin account creation and removal actions are logged and attributed to your superadmin account.
          Admin accounts cannot create or delete other admins — only superadmins can perform these actions.
        </p>
      </div>
    </AdminLayout>
  );
}
