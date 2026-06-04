import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { timeAgo, formatDate } from '../../utils/formatTime';
import { FiSearch, FiEdit2, FiUserX, FiUserCheck, FiEye, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { STATUS_COLORS } from '../../utils/constants';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const ROLES = ['', 'patient', 'emt', 'admin', 'hospital'];

const roleBadge = (role) => {
  const map = {
    patient: 'bg-blue-500/10 text-blue-400',
    emt: 'bg-green-500/10 text-green-400',
    admin: 'bg-purple-500/10 text-purple-400',
    superadmin: 'bg-red-500/10 text-red-400',
    hospital: 'bg-yellow-500/10 text-yellow-400'
  };
  return map[role] || 'bg-ems-dark text-ems-muted';
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({ firstName:'',lastName:'',email:'',phone:'',password:'',role:'emt' });
  const [saving, setSaving] = useState(false);
  const limit = 15;

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
      setTotal(data.total);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const openDetail = async (id) => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      setSelectedUser(data);
      setShowDetail(true);
    } catch { toast.error('Failed to load user details'); }
  };

  const toggleActive = async (id, current) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !current });
      toast.success(current ? 'User deactivated' : 'User reactivated');
      fetchUsers();
    } catch { toast.error('Failed to update user'); }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role });
      toast.success(`Role updated to ${role}`);
      fetchUsers();
      if (selectedUser?.user?._id === id) {
        setSelectedUser(prev => ({ ...prev, user: { ...prev.user, role } }));
      }
    } catch { toast.error('Failed to update role'); }
  };

  const createStaff = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/auth/register-staff', staffForm);
      toast.success(`${staffForm.role} account created`);
      setShowStaffModal(false);
      setStaffForm({ firstName:'',lastName:'',email:'',phone:'',password:'',role:'emt' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create staff'); }
    finally { setSaving(false); }
  };

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout title="User Management">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display text-ems-white">USER MANAGEMENT</h2>
          <p className="text-ems-muted text-sm">{total.toLocaleString()} registered users</p>
        </div>
        <button onClick={() => setShowStaffModal(true)} className="btn-emergency py-2 px-5 flex items-center gap-2 text-sm">
          <FiPlus size={15} /> Add Staff
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone..." className="ems-input pl-10" />
          </div>
          <button type="submit" className="btn-emergency px-5 py-2.5 text-sm">Search</button>
        </form>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="ems-input w-40">
          <option value="">All Roles</option>
          {ROLES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={fetchUsers} className="btn-ghost p-2.5"><FiRefreshCw size={15} /></button>
      </div>

      {/* Table */}
      <div className="ems-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ems-border">
                {['User','Contact','Role','Membership','Emergencies','Joined','Status','Actions'].map(h => (
                  <th key={h} className="text-left text-ems-muted text-xs uppercase tracking-wider px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ems-border">
              {loading ? (
                <tr><td colSpan={8} className="py-16 text-center"><Loader /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-ems-muted">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-ems-dark/40 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emergency-red/20 rounded-lg flex items-center justify-center text-emergency-red text-xs font-bold flex-shrink-0">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-ems-white text-sm font-medium">{u.firstName} {u.lastName}</p>
                        <p className="text-ems-muted text-xs">{u.idNumber || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ems-muted text-xs">{u.email}</p>
                    <p className="text-ems-muted text-xs">{u.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${u.membership?.status === 'active' ? 'text-green-400' : 'text-ems-muted'}`}>
                      {u.membership?.status === 'active' ? `✓ ${u.membership.type}` : 'None'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-ems-white font-medium">{u.totalEmergencies || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-ems-muted text-xs">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${u.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openDetail(u._id)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-ems-muted hover:text-blue-400 transition-all" title="View details">
                        <FiEye size={14} />
                      </button>
                      <button onClick={() => toggleActive(u._id, u.isActive)}
                        className={`p-1.5 rounded-lg transition-all ${u.isActive ? 'hover:bg-red-500/10 text-ems-muted hover:text-red-400' : 'hover:bg-green-500/10 text-ems-muted hover:text-green-400'}`}
                        title={u.isActive ? 'Deactivate' : 'Reactivate'}>
                        {u.isActive ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white hover:border-emergency-red disabled:opacity-30 text-xs transition-all">← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white hover:border-emergency-red disabled:opacity-30 text-xs transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="User Profile" size="lg">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emergency-red/20 rounded-2xl flex items-center justify-center text-emergency-red text-2xl font-bold">
                {selectedUser.user.firstName?.[0]}{selectedUser.user.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-ems-white font-bold text-lg">{selectedUser.user.firstName} {selectedUser.user.lastName}</h3>
                <p className="text-ems-muted text-sm">{selectedUser.user.email} · {selectedUser.user.phone}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`status-badge ${roleBadge(selectedUser.user.role)}`}>{selectedUser.user.role}</span>
                  {selectedUser.user.membership?.status === 'active' && (
                    <span className="status-badge bg-green-500/10 text-green-400">✓ {selectedUser.user.membership.type}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Change role */}
            <div className="p-3 bg-ems-dark rounded-xl flex items-center justify-between">
              <span className="text-ems-muted text-sm">Change Role</span>
              <select defaultValue={selectedUser.user.role} onChange={e => changeRole(selectedUser.user._id, e.target.value)} className="bg-ems-black border border-ems-border rounded-lg px-3 py-1.5 text-ems-white text-sm">
                {['patient','emt','admin','hospital'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Emergencies', value: selectedUser.user.totalEmergencies || 0 },
                { label: 'Blood Group', value: selectedUser.user.bloodGroup || '—' },
                { label: 'SHA Number', value: selectedUser.user.shaNumber || 'Not linked' }
              ].map(({ label, value }) => (
                <div key={label} className="bg-ems-dark border border-ems-border rounded-xl p-3 text-center">
                  <p className="text-ems-white font-semibold">{value}</p>
                  <p className="text-ems-muted text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent emergencies */}
            {selectedUser.emergencies?.length > 0 && (
              <div>
                <p className="text-ems-muted text-xs uppercase tracking-wider mb-2">Recent Emergencies</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selectedUser.emergencies.map(em => (
                    <div key={em._id} className="flex items-center justify-between p-2 bg-ems-dark rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-ems-white text-xs font-medium capitalize">{em.type}</span>
                        <span className="status-badge text-xs" style={{ background: `${STATUS_COLORS[em.status]}20`, color: STATUS_COLORS[em.status] }}>{em.status}</span>
                      </div>
                      <span className="text-ems-muted text-xs">{timeAgo(em.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Staff Modal */}
      <Modal isOpen={showStaffModal} onClose={() => setShowStaffModal(false)} title="Add Staff Account">
        <form onSubmit={createStaff} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-ems-light text-xs mb-1 block">First Name</label><input required value={staffForm.firstName} onChange={e => setStaffForm(f=>({...f,firstName:e.target.value}))} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Last Name</label><input required value={staffForm.lastName} onChange={e => setStaffForm(f=>({...f,lastName:e.target.value}))} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Email</label><input required type="email" value={staffForm.email} onChange={e => setStaffForm(f=>({...f,email:e.target.value}))} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Phone</label><input required value={staffForm.phone} onChange={e => setStaffForm(f=>({...f,phone:e.target.value}))} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Password</label><input required type="password" minLength={8} value={staffForm.password} onChange={e => setStaffForm(f=>({...f,password:e.target.value}))} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Role</label>
              <select value={staffForm.role} onChange={e => setStaffForm(f=>({...f,role:e.target.value}))} className="ems-input">
                <option value="emt">EMT</option>
                <option value="admin">Admin</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-emergency w-full py-3 flex items-center justify-center gap-2">
            {saving ? <Loader size="sm" /> : 'Create Account'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}

// Missing import fix
// STATUS_COLORS defined above via import
