import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { FiRefreshCw, FiPlus } from 'react-icons/fi';
import Loader from '../../components/Loader';

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [county, setCounty] = useState('');

  useEffect(() => { fetchHospitals(); }, [page, county]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...(county && { county }) });
      const res = await api.get(`/admin/hospitals?${params}`);
      setHospitals(res.data.hospitals || []);
      setTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <AdminLayout title="Hospitals">
      <div className="ems-card mb-5">
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Filter by county..." value={county}
            onChange={e => { setCounty(e.target.value); setPage(1); }}
            className="ems-input text-sm" />
          <button onClick={fetchHospitals} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="ems-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ems-white font-semibold">Hospitals ({total})</h3>
        </div>
        {loading ? <div className="py-16 flex justify-center"><Loader /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                  {['Name','County','Type','Phone','SHA Empanelled','ICU','Emergency'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ems-border">
                {hospitals.map(h => (
                  <tr key={h._id} className="hover:bg-ems-dark transition-colors">
                    <td className="py-3 pr-4 text-ems-white">{h.name}</td>
                    <td className="py-3 pr-4 text-ems-muted">{h.county}</td>
                    <td className="py-3 pr-4 text-ems-muted capitalize">{h.type}</td>
                    <td className="py-3 pr-4 text-ems-muted text-xs">{h.phone || '—'}</td>
                    <td className="py-3 pr-4">
                      <span className={`status-badge ${h.shaEmpanelled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {h.shaEmpanelled ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`status-badge ${h.capabilities?.icu ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {h.capabilities?.icu ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`status-badge ${h.capabilities?.emergency ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {h.capabilities?.emergency ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hospitals.length === 0 && <p className="text-center text-ems-muted py-10">No hospitals found</p>}
          </div>
        )}
        {total > 20 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Page {page} of {Math.ceil(total/20)}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40">Prev</button>
              <button disabled={page*20 >= total} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
