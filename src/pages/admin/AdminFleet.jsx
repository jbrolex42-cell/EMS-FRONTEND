import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { FiTruck, FiRefreshCw } from 'react-icons/fi';
import Loader from '../../components/Loader';

const STATUS_COLORS = { available: '#22C55E', dispatched: '#FF3B30', enroute: '#F59E0B', on_scene: '#EF4444', transporting: '#3B82F6', maintenance: '#6B7280', offline: '#374151' };

export default function AdminFleet() {
  const [ambulances, setAmbulances] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', county: '' });

  useEffect(() => { fetchFleet(); }, [filters]);

  const fetchFleet = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v]) => v)));
      const res = await api.get(`/admin/fleet?${params}`);
      setAmbulances(res.data.ambulances || []);
      setStats(res.data.stats || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <AdminLayout title="Fleet">
      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {stats.map(s => (
          <div key={s._id} className="ems-card text-center py-3">
            <div className="text-xl font-bold" style={{ color: STATUS_COLORS[s._id] || '#fff' }}>{s.count}</div>
            <div className="text-ems-muted text-xs capitalize mt-1">{s._id}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="ems-card mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="ems-input text-sm">
            <option value="">All Statuses</option>
            {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Filter by county..." value={filters.county}
            onChange={e => setFilters(f => ({ ...f, county: e.target.value }))}
            className="ems-input text-sm" />
          <button onClick={fetchFleet} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="ems-card">
        <h3 className="text-ems-white font-semibold mb-4">Ambulances ({ambulances.length})</h3>
        {loading ? <div className="py-16 flex justify-center"><Loader /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                  {['Registration','Type','County','Status','EMT','Driver','Last Ping'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ems-border">
                {ambulances.map(a => (
                  <tr key={a._id} className="hover:bg-ems-dark transition-colors">
                    <td className="py-3 pr-4 text-ems-white font-mono text-xs">{a.registrationNumber}</td>
                    <td className="py-3 pr-4 text-ems-muted capitalize">{a.type}</td>
                    <td className="py-3 pr-4 text-ems-muted">{a.county}</td>
                    <td className="py-3 pr-4">
                      <span className="status-badge" style={{ background: `${STATUS_COLORS[a.status]}20`, color: STATUS_COLORS[a.status] }}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{a.emt ? `${a.emt.firstName} ${a.emt.lastName}` : '—'}</td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{a.driver ? `${a.driver.firstName} ${a.driver.lastName}` : '—'}</td>
                    <td className="py-3 text-ems-muted text-xs">{a.lastPing ? new Date(a.lastPing).toLocaleTimeString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ambulances.length === 0 && <p className="text-center text-ems-muted py-10">No ambulances found</p>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
