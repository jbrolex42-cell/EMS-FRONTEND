import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import { HOSPITALS_DATA, LEVEL_LABEL } from '../../data/hospitalsData';
import { KENYAN_COUNTIES } from '../../utils/constants';

const PAGE_SIZE = 20;

export default function AdminHospitals() {
  const [county, setCounty]   = useState('');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [key, setKey]         = useState(0); // forces re-filter on refresh

  const filtered = HOSPITALS_DATA.filter(h => {
    const matchCounty = !county || h.county === county;
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase());
    return matchCounty && matchSearch;
  });

  const total     = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged     = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCountyChange = v => { setCounty(v); setPage(1); };
  const handleSearchChange = v => { setSearch(v); setPage(1); };

  return (
    <AdminLayout title="Hospitals">
      {/* Filters */}
      <div className="ems-card mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ems-muted" />
            <input
              placeholder="Search by name..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="ems-input text-sm pl-9"
            />
          </div>
          <select
            value={county}
            onChange={e => handleCountyChange(e.target.value)}
            className="ems-input text-sm"
          >
            <option value="">All Counties</option>
            {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="ems-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ems-white font-semibold">
            Hospitals <span className="text-ems-muted font-normal text-sm">({total})</span>
          </h3>
          <button
            onClick={() => setKey(k => k + 1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-ems-border text-ems-muted hover:text-white text-xs"
          >
            <FiRefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                {['Name', 'County', 'Level', 'Type', 'Phone', 'SHA', 'ICU', 'Emergency'].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ems-border">
              {paged.map(h => (
                <tr key={h._id} className="hover:bg-ems-dark transition-colors">
                  <td className="py-3 pr-4 text-ems-white font-medium whitespace-nowrap">{h.name}</td>
                  <td className="py-3 pr-4 text-ems-muted">{h.county}</td>
                  <td className="py-3 pr-4 text-ems-muted text-xs whitespace-nowrap">{LEVEL_LABEL[h.level] ?? h.level}</td>
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
          {paged.length === 0 && (
            <p className="text-center text-ems-muted py-10">No hospitals found</p>
          )}
        </div>

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Page {page} of {totalPages} · {total} hospitals</p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40"
              >Prev</button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
