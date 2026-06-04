import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { timeAgo, formatDateTime } from '../../utils/formatTime';
import { STATUS_COLORS, KENYAN_COUNTIES } from '../../utils/constants';
import { FiSearch, FiFilter, FiEye, FiMapPin, FiRefreshCw, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useSocket } from '../../hooks/useSocket';
import { joinAdminRoom } from '../../services/socketService';
import toast from 'react-hot-toast';

const STATUSES = ['','pending','dispatched','enroute','on_scene','transporting','at_hospital','completed','cancelled'];
const SEVERITIES = ['','critical','high','medium','low'];
const TYPES = ['','cardiac','trauma','respiratory','stroke','obstetric','poisoning','accident','general'];

export default function AdminEmergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', severity: '', type: '', county: '', startDate: '', endDate: '' });
  const [reassigning, setReassigning] = useState(false);
  const limit = 15;

  useEffect(() => { fetchEmergencies(); joinAdminRoom(); }, [page, filters]);

  useSocket('new_emergency', () => { if (page === 1) fetchEmergencies(); }, []);
  useSocket('emergency_status_changed', () => fetchEmergencies(), []);

  const fetchEmergencies = async () => {
    setLoading(true);
    try {
      const params = { page, limit, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await api.get('/admin/emergencies', { params });
      setEmergencies(data.emergencies);
      setTotal(data.total);
    } catch { toast.error('Failed to load emergencies'); }
    finally { setLoading(false); }
  };

  const openDetail = async (id) => {
    try {
      const { data } = await api.get(`/admin/emergencies/${id}`);
      setSelected(data.emergency);
      setShowModal(true);
    } catch { toast.error('Failed to load details'); }
  };

  const handleExport = async () => {
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/admin/export/emergencies', { params });
      const csv = [
        Object.keys(data.data[0]).join(','),
        ...data.data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `ems-emergencies-${Date.now()}.csv`; a.click();
      toast.success(`Exported ${data.count} records`);
    } catch { toast.error('Export failed'); }
  };

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Emergency Management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display text-ems-white">ALL EMERGENCIES</h2>
          <p className="text-ems-muted text-sm">{total.toLocaleString()} total records</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchEmergencies} className="btn-ghost py-2 px-4 flex items-center gap-2 text-sm">
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleExport} className="btn-ghost py-2 px-4 flex items-center gap-2 text-sm">
            <FiDownload size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="ems-card mb-6">
        <div className="flex items-center gap-2 mb-4 text-ems-muted text-sm">
          <FiFilter size={14} /> <span>Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: 'status', options: STATUSES, label: 'Status' },
            { key: 'severity', options: SEVERITIES, label: 'Severity' },
            { key: 'type', options: TYPES, label: 'Type' },
          ].map(({ key, options, label }) => (
            <select key={key} value={filters[key]}
              onChange={e => { setFilters(f => ({ ...f, [key]: e.target.value })); setPage(1); }}
              className="ems-input text-sm py-2">
              <option value="">All {label}s</option>
              {options.filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          <select value={filters.county} onChange={e => { setFilters(f => ({ ...f, county: e.target.value })); setPage(1); }} className="ems-input text-sm py-2">
            <option value="">All Counties</option>
            {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={filters.startDate} onChange={e => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(1); }} className="ems-input text-sm py-2" />
          <input type="date" value={filters.endDate} onChange={e => { setFilters(f => ({ ...f, endDate: e.target.value })); setPage(1); }} className="ems-input text-sm py-2" />
        </div>
        {Object.values(filters).some(Boolean) && (
          <button onClick={() => { setFilters({ status:'',severity:'',type:'',county:'',startDate:'',endDate:'' }); setPage(1); }}
            className="mt-3 text-emergency-red text-xs hover:underline">Clear all filters ×</button>
        )}
      </div>

      {/* Table */}
      <div className="ems-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ems-border">
                {['ID','Patient','Type','Severity','County','Responder','Status','Time',''].map(h => (
                  <th key={h} className="text-left text-ems-muted text-xs uppercase tracking-wider px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ems-border">
              {loading ? (
                <tr><td colSpan={9} className="py-16 text-center"><Loader /></td></tr>
              ) : emergencies.length === 0 ? (
                <tr><td colSpan={9} className="py-16 text-center text-ems-muted">No emergencies found</td></tr>
              ) : emergencies.map(em => (
                <tr key={em._id} className="hover:bg-ems-dark/50 transition-colors group">
                  <td className="px-4 py-3 font-mono text-xs text-ems-muted">{em.emergencyId?.slice(-10)}</td>
                  <td className="px-4 py-3">
                    <div className="text-ems-white text-sm font-medium">{em.patient?.firstName} {em.patient?.lastName}</div>
                    <div className="text-ems-muted text-xs">{em.patient?.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-ems-muted capitalize">{em.type}</td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${
                      em.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      em.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'}`}>
                      {em.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ems-muted text-xs">{em.patientLocation?.county || '—'}</td>
                  <td className="px-4 py-3 text-ems-muted text-xs">{em.emt ? `${em.emt.firstName} ${em.emt.lastName}` : <span className="text-yellow-400">Unassigned</span>}</td>
                  <td className="px-4 py-3">
                    <span className="status-badge text-xs" style={{ background: `${STATUS_COLORS[em.status]}20`, color: STATUS_COLORS[em.status] }}>
                      {em.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ems-muted text-xs whitespace-nowrap">{timeAgo(em.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openDetail(em._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-emergency-red/10 text-ems-muted hover:text-emergency-red transition-all">
                      <FiEye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Page {page} of {pages} · {total} records</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white hover:border-emergency-red disabled:opacity-30 text-xs transition-all">← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white hover:border-emergency-red disabled:opacity-30 text-xs transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Emergency — ${selected?.emergencyId}`} size="lg">
        {selected && (
          <div className="space-y-5">
            {/* Status banner */}
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${STATUS_COLORS[selected.status]}15`, border: `1px solid ${STATUS_COLORS[selected.status]}30` }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[selected.status] }} />
              <span className="font-semibold text-sm capitalize" style={{ color: STATUS_COLORS[selected.status] }}>{selected.status?.replace(/_/g,' ')}</span>
              <span className="text-ems-muted text-xs ml-auto">{formatDateTime(selected.createdAt)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Patient */}
              <div className="ems-card p-4">
                <p className="text-ems-muted text-xs mb-3 uppercase tracking-wider">Patient</p>
                <p className="text-ems-white font-semibold">{selected.patient?.firstName} {selected.patient?.lastName}</p>
                <p className="text-ems-muted text-sm">{selected.patient?.phone}</p>
                <p className="text-ems-muted text-sm">Blood: <span className="text-emergency-red font-medium">{selected.patient?.bloodGroup}</span></p>
                {selected.patient?.allergies?.length > 0 && (
                  <p className="text-yellow-400 text-xs mt-1">⚠ {selected.patient.allergies.join(', ')}</p>
                )}
                {selected.patient?.shaNumber && (
                  <p className="text-green-400 text-xs mt-1">✓ SHA: {selected.patient.shaNumber}</p>
                )}
              </div>

              {/* Emergency info */}
              <div className="ems-card p-4">
                <p className="text-ems-muted text-xs mb-3 uppercase tracking-wider">Emergency</p>
                <p className="text-ems-white font-semibold capitalize">{selected.type}</p>
                <p className="text-ems-muted text-sm capitalize">Severity: <span className={selected.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}>{selected.severity}</span></p>
                <p className="text-ems-muted text-sm">AI Score: {selected.aiTriageScore}/10</p>
                {selected.description && <p className="text-ems-light text-xs mt-2 italic">"{selected.description}"</p>}
              </div>

              {/* Location */}
              <div className="ems-card p-4">
                <p className="text-ems-muted text-xs mb-3 uppercase tracking-wider flex items-center gap-1"><FiMapPin size={11} /> Location</p>
                <p className="text-ems-white text-sm">{selected.patientLocation?.address || 'No address'}</p>
                <p className="text-ems-muted text-xs">{selected.patientLocation?.county}</p>
                {selected.patientLocation?.what3words && <p className="text-ems-white text-xs mt-1">📍 {selected.patientLocation.what3words}</p>}
                <p className="text-ems-muted text-xs font-mono mt-1">{selected.patientLocation?.coordinates?.join(', ')}</p>
              </div>

              {/* Responder */}
              <div className="ems-card p-4">
                <p className="text-ems-muted text-xs mb-3 uppercase tracking-wider">Responder</p>
                {selected.emt ? (
                  <>
                    <p className="text-ems-white font-semibold">{selected.emt.firstName} {selected.emt.lastName}</p>
                    <p className="text-ems-muted text-sm">{selected.emt.phone}</p>
                  </>
                ) : <p className="text-yellow-400 text-sm">⚠ No responder assigned</p>}
                {selected.ambulance && (
                  <p className="text-ems-muted text-xs mt-2">{selected.ambulance.registrationNumber} · {selected.ambulance.type}</p>
                )}
                {selected.hospital && (
                  <p className="text-ems-muted text-xs mt-1">🏥 {selected.hospital.name}</p>
                )}
              </div>
            </div>

            {/* Timeline */}
            {selected.timeline?.length > 0 && (
              <div>
                <p className="text-ems-muted text-xs uppercase tracking-wider mb-3">Timeline</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[...selected.timeline].reverse().map((t, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 bg-ems-dark rounded-lg">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: STATUS_COLORS[t.status] || '#666' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-ems-white text-xs font-medium capitalize">{t.status?.replace(/_/g,' ')}</p>
                        <p className="text-ems-muted text-xs">{t.note}</p>
                      </div>
                      <p className="text-ems-muted text-xs flex-shrink-0">{timeAgo(t.timestamp)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response metrics */}
            {(selected.responseTime || selected.totalTime) && (
              <div className="grid grid-cols-2 gap-3">
                {selected.responseTime && (
                  <div className="bg-ems-dark border border-ems-border rounded-xl p-3 text-center">
                    <p className="text-2xl font-display text-emergency-red">{selected.responseTime} min</p>
                    <p className="text-ems-muted text-xs">Response time</p>
                  </div>
                )}
                {selected.totalTime && (
                  <div className="bg-ems-dark border border-ems-border rounded-xl p-3 text-center">
                    <p className="text-2xl font-display text-blue-400">{selected.totalTime} min</p>
                    <p className="text-ems-muted text-xs">Total incident time</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
