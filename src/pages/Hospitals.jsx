import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import { KENYAN_COUNTIES } from '../utils/constants';
import { FiPhone, FiMapPin, FiActivity, FiSearch, FiCheckCircle } from 'react-icons/fi';
import Loader from '../components/Loader';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [county, setCounty] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/ambulances/nearby?lng=36.8219&lat=-1.2921&radius=500000')
      .then(() => {})
      .catch(() => {});

    // Mock data for display
    setHospitals([
      { _id: '1', name: 'Kenyatta National Hospital', type: 'public', level: 'level_6', county: 'Nairobi', address: 'Hospital Road, Nairobi', phone: '020 2726300', shaEmpanelled: true, capabilities: { icu: true, emergency: true, surgery: true, maternity: true } },
      { _id: '2', name: 'Nairobi Hospital', type: 'private', level: 'level_5', county: 'Nairobi', address: 'Argwings Kodhek Rd', phone: '020 2845000', shaEmpanelled: true, capabilities: { icu: true, emergency: true, surgery: true } },
      { _id: '3', name: 'Moi Teaching & Referral', type: 'public', level: 'level_6', county: 'Uasin Gishu', address: 'Nandi Rd, Eldoret', phone: '053 2063000', shaEmpanelled: true, capabilities: { icu: true, emergency: true, surgery: true, maternity: true } },
      { _id: '4', name: 'Coast General Hospital', type: 'public', level: 'level_5', county: 'Mombasa', address: 'Hospital Rd, Mombasa', phone: '041 2312191', shaEmpanelled: true, capabilities: { emergency: true, surgery: true, maternity: true } },
      { _id: '5', name: 'Aga Khan Hospital Nairobi', type: 'private', level: 'level_5', county: 'Nairobi', address: '3rd Parklands Ave', phone: '020 3662000', shaEmpanelled: false, capabilities: { icu: true, emergency: true, surgery: true, dialysis: true } },
      { _id: '6', name: 'MP Shah Hospital', type: 'private', level: 'level_4', county: 'Nairobi', address: 'Shivachi Road, Parklands', phone: '020 4291000', shaEmpanelled: true, capabilities: { icu: true, emergency: true, surgery: true } },
    ]);
    setLoading(false);
  }, []);

  const levelLabel = { level_2: 'Dispensary', level_3: 'Health Centre', level_4: 'Sub-County', level_5: 'County', level_6: 'National Referral' };

  const filtered = hospitals.filter(h => {
    const matchCounty = !county || h.county === county;
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.address.toLowerCase().includes(search.toLowerCase());
    return matchCounty && matchSearch;
  });

  return (
    <MainLayout>
      <section className="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Network</span>
          <h1 className="text-4xl font-display text-ems-white mt-2 mb-3">PARTNER HOSPITALS</h1>
          <p className="text-ems-muted">Our integrated hospital network across Kenya. SHA-empanelled facilities prioritised for ECCIF claims.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or address..."
              className="ems-input pl-10"
            />
          </div>
          <select value={county} onChange={e => setCounty(e.target.value)} className="ems-input sm:w-48">
            <option value="">All Counties</option>
            {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(h => (
              <div key={h._id} className="ems-card hover:border-emergency-red/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-ems-white font-semibold">{h.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-ems-dark text-ems-muted px-2 py-0.5 rounded-full capitalize">{h.type}</span>
                      <span className="text-xs bg-ems-dark text-ems-muted px-2 py-0.5 rounded-full">{levelLabel[h.level]}</span>
                    </div>
                  </div>
                  {h.shaEmpanelled && (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full flex-shrink-0">
                      <FiCheckCircle size={10} /> SHA
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-ems-muted">
                    <FiMapPin size={13} className="text-emergency-red" />
                    <span>{h.address} · {h.county}</span>
                  </div>
                  {h.phone && (
                    <div className="flex items-center gap-2 text-ems-muted">
                      <FiPhone size={13} className="text-emergency-red" />
                      <a href={`tel:${h.phone}`} className="hover:text-white transition-colors">{h.phone}</a>
                    </div>
                  )}
                </div>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(h.capabilities || {}).filter(([, v]) => v).map(([cap]) => (
                    <span key={cap} className="text-xs bg-ems-dark border border-ems-border text-ems-muted px-2 py-1 rounded-lg capitalize">{cap.replace(/([A-Z])/g, ' $1')}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <FiActivity size={48} className="text-ems-muted mx-auto mb-4" />
            <p className="text-ems-muted">No hospitals found for your search</p>
          </div>
        )}
      </section>
    </MainLayout>
  );
}
