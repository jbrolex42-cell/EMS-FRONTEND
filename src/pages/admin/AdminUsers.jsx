import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/formatTime';
import { FiRefreshCw, FiUserCheck, FiUserX, FiShield, FiArrowRight } from 'react-icons/fi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ role: '', search: '' });

  useEffect(() => { fetchUsers(); }, [page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: 20,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      });
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const toggleActive = async (userId, currentState, userRole) => {
    // Only superadmins can toggle admin/superadmin accounts
    if ((userRole === 'admin' || userRole === 'superadmin') && !isSuperAdmin) {
      toast.error('Only superadmins can modify admin accounts');
      return;
    }
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !currentState });
      toast.success(`User ${currentState ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (e) { toast.error('Failed to update user'); }
  };

  // Can this user's row be toggled by the current session?
  const canToggle = (u) => {
    if (u._id === currentUser?._id) return false; // can't toggle self
    if (u.role === 'admin' || u.role === 'superadmin') return isSuperAdmin;
    return true; // patients & emts: all admins can toggle
  };

  const roleBadge = (role) => {
    const map = {
      patient: 'bg-blue-500/20 text-blue-400',
      emt: 'bg-green-500/20 text-green-400',
      admin: 'bg-purple-500/20 text-purple-400',
      superadmin: 'bg-red-500/20 text-red-400'
    };
    return map[role] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <AdminLayout title="Users">
      {/* Superadmin shortcut banner */}
      {isSuperAdmin && (
        <Link
          to="/admin/manage-admins"
          className="flex items-center justify-between gap-3 mb-5 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FiShield className="text-purple-400" size={15} />
            </div>
            <div>
              <p className="text-ems-white text-sm font-medium">Admin Management Console</p>
              <p className="text-ems-muted text-xs">Create, view, and remove administrator accounts</p>
            </div>
          </div>
          <FiArrowRight className="text-purple-400 group-hover:translate-x-1 transition-transform" size={16} />
        </Link>
      )}

      {/* Filters */}
      <div className="ems-card mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            value={filters.role}
            onChange={e => { setFilters(f => ({ ...f, role: e.target.value })); setPage(1); }}
            className="ems-input text-sm"
          >
            <option value="">All Roles</option>
            {['patient', 'emt', 'admin', 'superadmin'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <input
            placeholder="Search name, email, phone..."
            value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
            className="ems-input text-sm"
          />
          <button
            onClick={fetchUsers}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white transition-colors"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ems-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ems-white font-semibold">All Users ({total})</h3>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                  {['Name', 'Email', 'Phone', 'Role', 'Status', 'Emergencies', 'Joined', 'Action'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ems-border">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-ems-dark transition-colors group">
                    <td className="py-3 pr-4 text-ems-white">{u.firstName} {u.lastName}</td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{u.email}</td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{u.phone}</td>
                    <td className="py-3 pr-4">
                      <span className={`status-badge ${roleBadge(u.role)}`}>{u.role}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`status-badge ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-ems-muted text-center">{u.totalEmergencies || 0}</td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{timeAgo(u.createdAt)}</td>
                    <td className="py-3">
                      {canToggle(u) ? (
                        <button
                          onClick={() => toggleActive(u._id, u.isActive, u.role)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.isActive
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-green-400 hover:bg-green-500/10'
                          }`}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {u.isActive ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                        </button>
                      ) : u._id === currentUser?._id ? (
                        <span className="text-ems-muted text-xs px-1.5">You</span>
                      ) : (
                        /* Admin rows for non-superadmin viewers: show lock */
                        <span className="text-ems-muted text-xs px-1.5" title="Superadmin only">
                          <FiShield size={13} className="text-purple-400/50" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-ems-muted py-10">No users found</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ems-border">
            <p className="text-ems-muted text-xs">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs hover:text-white disabled:opacity-40"
              >Prev</button>
              <button
                disabled={page * 20 >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs hover:text-white disabled:opacity-40"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
