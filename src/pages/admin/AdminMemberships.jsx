import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { formatDate, timeAgo } from '../../utils/formatTime';
import { FiRefreshCw, FiDownload } from 'react-icons/fi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const planColors = { individual:'bg-blue-500/10 text-blue-400', family:'bg-green-500/10 text-green-400', mum_dad:'bg-purple-500/10 text-purple-400', corporate:'bg-orange-500/10 text-orange-400', school:'bg-yellow-500/10 text-yellow-400', residential:'bg-cyan-500/10 text-cyan-400', sacco:'bg-pink-500/10 text-pink-400' };

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('active');
  const [type, setType] = useState('');
  const limit = 15;

  useEffect(() => { fetchData(); }, [page, status, type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (type) params.type = type;
      const { data } = await api.get('/admin/memberships', { params });
      setMemberships(data.memberships);
      setTotal(data.total);
      setStats(data.stats);
      setTotalRevenue(data.totalRevenue);
    } catch { toast.error('Failed to load memberships'); }
    finally { setLoading(false); }
  };

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Memberships">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display text-ems-white">MEMBERSHIPS</h2>
          <p className="text-ems-muted text-sm">{total.toLocaleString()} records · KES {totalRevenue.toLocaleString()} active revenue</p>
        </div>
        <button onClick={fetchData} className="btn-ghost p-2.5"><FiRefreshCw size={15} /></button>
      </div>

      {/* Revenue by plan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.slice(0, 4).map(s => (
          <div key={s._id} className="ems-card text-center">
            <div className={`status-badge inline-block mb-2 ${planColors[s._id] || 'bg-ems-dark text-ems-muted'}`}>{s._id}</div>
            <div className="text-ems-white font-display text-2xl">{s.count}</div>
            <div className="text-ems-muted text-xs">KES {s.revenue.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="ems-input w-36 text-sm py-2">
          <option value="">All Statuses</option>
          {['active','expired','suspended','pending'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} className="ems-input w-36 text-sm py-2">
          <option value="">All Plans</option>
          {['individual','family','mum_dad','corporate','school','residential','sacco'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="ems-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ems-border">
                {['Member #','Member','Plan','Fee','Status','Start','Expiry','Beneficiaries'].map(h => (
                  <th key={h} className="text-left text-ems-muted text-xs uppercase tracking-wider px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ems-border">
              {loading ? (
                <tr><td colSpan={8} className="py-16 text-center"><Loader /></td></tr>
              ) : memberships.map(m => (
                <tr key={m._id} className="hover:bg-ems-dark/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-ems-muted">{m.memberNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-ems-white font-medium text-sm">{m.user?.firstName} {m.user?.lastName}</p>
                    <p className="text-ems-muted text-xs">{m.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3"><span className={`status-badge text-xs ${planColors[m.type] || ''}`}>{m.type}</span></td>
                  <td className="px-4 py-3 text-ems-white text-sm">KES {m.annualFee?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`status-badge text-xs ${m.status==='active'?'bg-green-500/10 text-green-400':m.status==='expired'?'bg-red-500/10 text-red-400':'bg-yellow-500/10 text-yellow-400'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ems-muted text-xs">{formatDate(m.startDate)}</td>
                  <td className="px-4 py-3 text-ems-muted text-xs">{formatDate(m.expiryDate)}</td>
                  <td className="px-4 py-3 text-center text-ems-muted text-sm">{m.beneficiaries?.length || 0} / {m.maxBeneficiaries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white disabled:opacity-30 text-xs transition-all">← Prev</button>
              <button disabled={page===pages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white disabled:opacity-30 text-xs transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
