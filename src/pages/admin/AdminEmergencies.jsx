import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { timeAgo } from '../../utils/formatTime';
import { STATUS_COLORS } from '../../utils/constants';
import { FiSearch, FiFilter, FiEye, FiRefreshCw } from 'react-icons/fi';
import Loader from '../../components/Loader';

export default function AdminEmergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', severity: '', county: '', search: '' });

  useEffect(() => { fetchEmergencies(); }, [page, filters]);

  const fetchEmergencies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) });
      const res = await api.get(`/admin/emergencies?${params}`);
      setEmergencies(res.data.emergencies || []);
      setTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const severityBadge = (s) =>
    s === 'critical' ? 'bg-red-500/20 text-red-400' :
    s === 'high'     ? 'bg-orange-500/20 text-orange-400' :
                       'bg-yellow-500/20 text-yellow-400';

  return (
    <AdminLayout title="Emergencies">
      {/* Filters */}
      <div className="ems-card mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'status',   placeholder: 'All Statuses',  options: ['pending','dispatched','enroute','on_scene','transporting','completed','cancelled'] },
            { key: 'severity', placeholder: 'All Severities', options: ['low','medium','high','critical'] },
          ].map(({ key, placeholder, options }) => (
            <select key={key} value={filters[key]}
              onChange={e => { setFilters(f => ({ ...f, [key]: e.target.value })); setPage(1); }}
              className="ems-input text-sm">
              <option value="">{placeholder}</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          <input placeholder="Search county..."
            value={filters.county}
            onChange={e => { setFilters(f => ({ ...f, county: e.target.value })); setPage(1); }}
            className="ems-input text-sm" />
          <button onClick={fetchEmergencies} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white transition-colors">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ems-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ems-white font-semibold">All Emergencies ({total})</h3>
        </div>
        {loading ? <div className="py-16 flex justify-center"><Loader /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                  {['ID','Patient','Type','County','Severity','Status','EMT','Time'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ems-border">
                {emergencies.map(em => (
                  <tr key={em._id} className="hover:bg-ems-dark transition-colors">
                    <td className="py-3 pr-4 text-ems-muted font-mono text-xs">{em.emergencyId?.slice(-8)}</td>
                    <td className="py-3 pr-4 text-ems-white">{em.patient?.firstName} {em.patient?.lastName}</td>
                    <td className="py-3 pr-4 text-ems-muted capitalize">{em.type}</td>
                    <td className="py-3 pr-4 text-ems-muted">{em.patientLocation?.county}</td>
                    <td className="py-3 pr-4"><span className={`status-badge ${severityBadge(em.severity)}`}>{em.severity}</span></td>
                    <td className="py-3 pr-4">
                      <span className="status-badge" style={{ background: `${STATUS_COLORS[em.status]}20`, color: STATUS_COLORS[em.status] }}>
                        {em.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{em.emt ? `${em.emt.firstName} ${em.emt.lastName}` : '—'}</td>
                    <td className="py-3 text-ems-muted text-xs">{timeAgo(em.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {emergencies.length === 0 && <p className="text-center text-ems-muted py-10">No emergencies found</p>}
          </div>
        )}
        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Showing {(page-1)*20+1}–{Math.min(page*20, total)} of {total}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p-1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs hover:text-white disabled:opacity-40">Prev</button>
              <button disabled={page * 20 >= total} onClick={() => setPage(p => p+1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs hover:text-white disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
