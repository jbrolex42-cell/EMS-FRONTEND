import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { timeAgo } from '../../utils/formatTime';
import { FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import Loader from '../../components/Loader';

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', type: '' });

  useEffect(() => { fetchMemberships(); }, [page, filters]);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) });
      const res = await api.get(`/admin/memberships?${params}`);
      setMemberships(res.data.memberships || []);
      setTotal(res.data.total || 0);
      setTotalRevenue(res.data.totalRevenue || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const statusBadge = s => s === 'active' ? 'bg-green-500/20 text-green-400' : s === 'expired' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400';

  return (
    <AdminLayout title="Memberships">
      {/* Revenue card */}
      <div className="ems-card mb-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
          <FiDollarSign className="text-green-400" size={20} />
        </div>
        <div>
          <p className="text-ems-muted text-xs">Total Active Revenue</p>
          <p className="text-ems-white text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="ems-card mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }} className="ems-input text-sm">
            <option value="">All Statuses</option>
            {['active','expired','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.type} onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(1); }} className="ems-input text-sm">
            <option value="">All Types</option>
            {['individual','family','mum_dad','school','corporate','residential','sacco'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={fetchMemberships} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="ems-card">
        <h3 className="text-ems-white font-semibold mb-4">Memberships ({total})</h3>
        {loading ? <div className="py-16 flex justify-center"><Loader /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                  {['Member','Email','Type','Status','Fee (KES)','Expires','Since'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ems-border">
                {memberships.map(m => (
                  <tr key={m._id} className="hover:bg-ems-dark transition-colors">
                    <td className="py-3 pr-4 text-ems-white">{m.user?.firstName} {m.user?.lastName}</td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{m.user?.email}</td>
                    <td className="py-3 pr-4 text-ems-muted capitalize">{m.type?.replace(/_/g, ' ')}</td>
                    <td className="py-3 pr-4"><span className={`status-badge ${statusBadge(m.status)}`}>{m.status}</span></td>
                    <td className="py-3 pr-4 text-ems-muted">{m.annualFee?.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-KE') : '—'}</td>
                    <td className="py-3 text-ems-muted text-xs">{timeAgo(m.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {memberships.length === 0 && <p className="text-center text-ems-muted py-10">No memberships found</p>}
          </div>
        )}
        {total > 20 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Page {page} of {Math.ceil(total/20)}</p>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40">Prev</button>
              <button disabled={page*20>=total} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
