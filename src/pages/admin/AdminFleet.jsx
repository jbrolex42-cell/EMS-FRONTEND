import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { joinUserRoom, getSocket } from '../../services/socketService';
import { useAuth } from '../../context/AuthContext';
import { FiTruck, FiRefreshCw, FiPlus, FiX, FiMapPin } from 'react-icons/fi';
import Loader from '../../components/Loader';

const STATUS_COLORS = {
  available:    '#22C55E',
  dispatched:   '#FF3B30',
  enroute:      '#F59E0B',
  on_scene:     '#EF4444',
  transporting: '#3B82F6',
  maintenance:  '#6B7280',
  offline:      '#374151',
};

const AMBULANCE_TYPES = ['basic', 'advanced', 'neonatal', 'bariatric', 'air'];
const EQUIPMENT_OPTIONS = [
  // Airway & Breathing
  'Defibrillator', 'AED', 'Oxygen Cylinder', 'Bag-Valve Mask (BVM)',
  'Suction Unit', 'Pulse Oximeter', 'Capnography Monitor',
  'Nebulizer', 'Laryngoscope', 'Endotracheal Tubes', 'Supraglottic Airway',
  // Circulation & Monitoring
  'IV Kit', 'IV Fluids', 'Blood Pressure Cuff', 'ECG Monitor',
  'Cardiac Monitor', 'Glucometer', 'Thermometer', 'Tourniquet',
  // Trauma & Immobilization
  'Stretcher', 'Scoop Stretcher', 'Spinal Board', 'Cervical Collar',
  'Splints', 'Traction Splint', 'Pelvic Binder', 'Burn Kit',
  'Wound Dressing Kit', 'Hemostatic Gauze', 'Chest Seal',
  // Medication
  'Epinephrine (EpiPen)', 'Aspirin', 'Nitroglycerin', 'Naloxone (Narcan)',
  'Glucose Gel', 'Normal Saline', 'Morphine', 'Diazepam',
  // Obstetric & Neonatal
  'Delivery Kit', 'Neonatal Resuscitator', 'Cord Clamp',
  // General
  'First Aid Kit', 'PPE Kit', 'Blankets', 'Communication Radio',
  'Torch / Flashlight', 'Safety Vest',
];
const KENYA_COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi','Kitale',
  'Garissa','Kakamega','Nyeri','Meru','Machakos','Kisii','Kilifi','Lamu',
  'Kajiado','Kiambu','Murang\'a','Kirinyaga','Embu','Tharaka-Nithi','Isiolo',
  'Marsabit','Moyale','Mandera','Wajir','Turkana','West Pokot','Samburu',
  'Trans-Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Laikipia',
  'Nyahururu','Narok','Kericho','Bomet','Migori','Homa Bay','Siaya','Busia',
  'Bungoma','Vihiga','Kakamega','Nyandarua','Tana River','Taita-Taveta',
  'Kwale','Makueni','Kitui'
];

// ── Leaflet CSS (injected once) ───────────────────────────────────────────────
function ensureLeafletCSS() {
  if (document.getElementById('leaflet-css')) return;
  const link = document.createElement('link');
  link.id   = 'leaflet-css';
  link.rel  = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

// ── Leaflet loader ────────────────────────────────────────────────────────────
function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L);
    if (document.getElementById('leaflet-js')) {
      const check = setInterval(() => {
        if (window.L) { clearInterval(check); resolve(window.L); }
      }, 100);
      return;
    }
    ensureLeafletCSS();
    const script = document.createElement('script');
    script.id  = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
}

// ── SVG pin icon for each ambulance ──────────────────────────────────────────
function makeDivIcon(L, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="14" fill="${color}" opacity="0.25"/>
    <circle cx="18" cy="18" r="9"  fill="${color}"/>
    <text x="18" y="23" text-anchor="middle" font-size="13">🚑</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

// ── Live Map component (OpenStreetMap + Leaflet — no API key needed) ──────────
function FleetMap({ ambulances }) {
  const mapRef      = useRef(null);
  const leafletMap  = useRef(null);
  const markersRef  = useRef({});
  const [mapReady, setMapReady] = useState(false);

  // Init map once
  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !mapRef.current || leafletMap.current) return;
      leafletMap.current = L.map(mapRef.current, {
        center: [-1.2921, 36.8219], // Kenya center (lat, lng)
        zoom: 6,
        zoomControl: true,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMap.current);
      if (!cancelled) setMapReady(true);
    });
    return () => {
      cancelled = true;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersRef.current = {};
        setMapReady(false);
      }
    };
  }, []);

  // Update / add / remove markers — only runs after map is confirmed ready
  useEffect(() => {
    if (!mapReady || !leafletMap.current || !window.L) return;
    const L = window.L;

    ambulances.forEach(a => {
      const coords = a.location?.coordinates;
      if (!coords || (coords[0] === 0 && coords[1] === 0)) return;
      // GeoJSON stores [lng, lat] — Leaflet needs [lat, lng]
      const latlng = [coords[1], coords[0]];
      const color  = STATUS_COLORS[a.status] || '#fff';
      const icon   = makeDivIcon(L, color);
      const popup  = `
        <div style="font-family:sans-serif;min-width:175px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">🚑 ${a.registrationNumber}</div>
          <div style="color:${color};font-size:12px;text-transform:capitalize;margin-bottom:2px">${a.status}</div>
          <div style="color:#6b7280;font-size:11px">${a.type} · ${a.county}</div>
          ${a.emt ? `<div style="color:#6b7280;font-size:11px;margin-top:4px">EMT: ${a.emt.firstName} ${a.emt.lastName}</div>` : ''}
          ${a.lastPing ? `<div style="color:#9ca3af;font-size:10px;margin-top:4px">Last ping: ${new Date(a.lastPing).toLocaleTimeString()}</div>` : ''}
        </div>`;

      if (markersRef.current[a._id]) {
        markersRef.current[a._id].setLatLng(latlng).setIcon(icon).setPopupContent(popup);
      } else {
        markersRef.current[a._id] = L.marker(latlng, { icon })
          .bindPopup(popup)
          .addTo(leafletMap.current);
      }
    });

    // Remove stale markers
    Object.keys(markersRef.current).forEach(id => {
      if (!ambulances.find(a => a._id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [ambulances, mapReady]);

  return (
    <div className="ems-card mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-ems-white font-semibold flex items-center gap-2">
          <FiMapPin size={15} className="text-emergency-red" /> Live Fleet Map
        </h3>
      </div>
      <div className="flex gap-3 flex-wrap">
          {Object.entries(STATUS_COLORS).map(([s, c]) => (
            <span key={s} className="flex items-center gap-1 text-xs text-ems-muted capitalize">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: c }} />{s}
            </span>
          ))}
        </div>
      {!mapReady && (
        <div className="flex items-center justify-center h-96 bg-ems-dark rounded-xl">
          <Loader />
        </div>
      )}
      <div ref={mapRef} className="w-full rounded-xl overflow-hidden" style={{ height: mapReady ? '420px' : '0px' }} />
    </div>
  );
}

// ── Add Ambulance Modal ───────────────────────────────────────────────────────
function AddAmbulanceModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    registrationNumber: '',
    type: 'basic',
    county: '',
    status: 'available',
    emt: '',
    driver: '',
    capacity: 2,
    equipment: [],
    notes: '',
  });
  const [emtSearch, setEmtSearch]       = useState('');
  const [driverSearch, setDriverSearch] = useState('');
  const [emtResults, setEmtResults]     = useState([]);
  const [driverResults, setDriverResults] = useState([]);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  const searchUsers = async (query, role, setter) => {
    if (!query || query.length < 2) return setter([]);
    try {
      const res = await api.get(`/admin/users?role=${role}&search=${query}&limit=5`);
      setter(res.data.users || []);
    } catch { setter([]); }
  };

  useEffect(() => { searchUsers(emtSearch, 'emt', setEmtResults); }, [emtSearch]);
  useEffect(() => { searchUsers(driverSearch, 'emt', setDriverResults); }, [driverSearch]);

  const toggleEquipment = (item) => {
    setForm(f => ({
      ...f,
      equipment: f.equipment.includes(item)
        ? f.equipment.filter(e => e !== item)
        : [...f.equipment, item]
    }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.registrationNumber || !form.type || !form.county) {
      return setError('Registration number, type and county are required.');
    }
    setSaving(true);
    try {
      const res = await api.post('/admin/fleet', form);
      onCreated(res.data.ambulance);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create ambulance');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-ems-surface border border-ems-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ems-border sticky top-0 bg-ems-surface">
          <h2 className="text-ems-white font-display text-lg flex items-center gap-2">
            <FiTruck className="text-emergency-red" /> Add Ambulance
          </h2>
          <button onClick={onClose} className="text-ems-muted hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-emergency-red/10 border border-emergency-red/30 text-emergency-red text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Basic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ems-muted text-xs mb-1">Registration Number *</label>
              <input
                className="ems-input w-full uppercase"
                placeholder="e.g. KCA 123A"
                value={form.registrationNumber}
                onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-ems-muted text-xs mb-1">Type *</label>
              <select className="ems-input w-full capitalize"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {AMBULANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-ems-muted text-xs mb-1">County *</label>
              <select className="ems-input w-full"
                value={form.county}
                onChange={e => setForm(f => ({ ...f, county: e.target.value }))}>
                <option value="">Select county...</option>
                {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-ems-muted text-xs mb-1">Initial Status</label>
              <select className="ems-input w-full capitalize"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-ems-muted text-xs mb-1">Patient Capacity</label>
            <input type="number" min={1} max={10} className="ems-input w-32"
              value={form.capacity}
              onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || 1 }))} />
          </div>

          {/* EMT assignment */}
          <div>
            <label className="block text-ems-muted text-xs mb-1">Assign EMT</label>
            <input className="ems-input w-full" placeholder="Search by name..."
              value={emtSearch}
              onChange={e => { setEmtSearch(e.target.value); setForm(f => ({ ...f, emt: '' })); }} />
            {emtResults.length > 0 && (
              <div className="mt-1 border border-ems-border rounded-xl bg-ems-dark overflow-hidden">
                {emtResults.map(u => (
                  <button key={u._id}
                    className="w-full text-left px-4 py-2 text-sm text-ems-white hover:bg-ems-surface flex items-center justify-between"
                    onClick={() => { setForm(f => ({ ...f, emt: u._id })); setEmtSearch(`${u.firstName} ${u.lastName}`); setEmtResults([]); }}>
                    <span>{u.firstName} {u.lastName}</span>
                    <span className="text-ems-muted text-xs">{u.phone}</span>
                  </button>
                ))}
              </div>
            )}
            {form.emt && <p className="text-green-400 text-xs mt-1">✓ EMT selected</p>}
          </div>

          {/* Driver assignment */}
          <div>
            <label className="block text-ems-muted text-xs mb-1">Assign Driver</label>
            <input className="ems-input w-full" placeholder="Search by name..."
              value={driverSearch}
              onChange={e => { setDriverSearch(e.target.value); setForm(f => ({ ...f, driver: '' })); }} />
            {driverResults.length > 0 && (
              <div className="mt-1 border border-ems-border rounded-xl bg-ems-dark overflow-hidden">
                {driverResults.map(u => (
                  <button key={u._id}
                    className="w-full text-left px-4 py-2 text-sm text-ems-white hover:bg-ems-surface flex items-center justify-between"
                    onClick={() => { setForm(f => ({ ...f, driver: u._id })); setDriverSearch(`${u.firstName} ${u.lastName}`); setDriverResults([]); }}>
                    <span>{u.firstName} {u.lastName}</span>
                    <span className="text-ems-muted text-xs">{u.phone}</span>
                  </button>
                ))}
              </div>
            )}
            {form.driver && <p className="text-green-400 text-xs mt-1">✓ Driver selected</p>}
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-ems-muted text-xs mb-2">Equipment</label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map(item => (
                <button key={item}
                  onClick={() => toggleEquipment(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                    form.equipment.includes(item)
                      ? 'bg-emergency-red/20 border-emergency-red text-emergency-red'
                      : 'border-ems-border text-ems-muted hover:text-white'
                  }`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-ems-muted text-xs mb-1">Notes</label>
            <textarea rows={2} className="ems-input w-full resize-none" placeholder="Optional notes..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-ghost px-6 py-2.5 text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-emergency px-6 py-2.5 text-sm flex items-center gap-2">
            {saving ? <Loader size="sm" /> : <FiPlus size={14} />}
            {saving ? 'Creating...' : 'Add Ambulance'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminFleet page ──────────────────────────────────────────────────────
export default function AdminFleet() {
  const { user } = useAuth();
  const [ambulances, setAmbulances] = useState([]);
  const [stats, setStats]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState({ status: '', county: '' });
  const [showModal, setShowModal]   = useState(false);
  const [activeTab, setActiveTab]   = useState('table'); // 'table' | 'map'

  useEffect(() => { fetchFleet(); }, [filters]);

  // Join admin socket room so server can push ambulance_location_update events
  useEffect(() => {
    if (user?._id) joinUserRoom(user._id);
    const socket = getSocket();
    if (socket) {
      const onReconnect = () => { if (user?._id) joinUserRoom(user._id); fetchFleet(); };
      socket.on('connect', onReconnect);
      return () => socket.off('connect', onReconnect);
    }
  }, [user?._id]);

  // Poll every 15s as fallback so map stays fresh even if socket misses an event
  useEffect(() => {
    const interval = setInterval(fetchFleet, 15000);
    return () => clearInterval(interval);
  }, [filters]);

  const fetchFleet = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      );
      const res = await api.get(`/admin/fleet?${params}`);
      setAmbulances(res.data.ambulances || []);
      setStats(res.data.stats || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Live location updates via socket
  useSocket('ambulance_location_update', (data) => {
    const ambulanceId = data.ambulanceId || data.id;
    setAmbulances(prev => prev.map(a =>
      a._id === ambulanceId
        ? { ...a, location: { type: 'Point', coordinates: data.coordinates }, status: data.status || a.status, lastPing: data.lastPing || new Date().toISOString() }
        : a
    ));
  }, []);

  const handleCreated = (ambulance) => {
    setAmbulances(prev => [ambulance, ...prev]);
    fetchFleet(); // refresh stats
  };

  return (
    <AdminLayout title="Fleet">
      {showModal && (
        <AddAmbulanceModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {stats.map(s => (
          <div key={s._id} className="ems-card text-center py-3">
            <div className="text-xl font-bold" style={{ color: STATUS_COLORS[s._id] || '#fff' }}>{s.count}</div>
            <div className="text-ems-muted text-xs capitalize mt-1">{s._id}</div>
          </div>
        ))}
      </div>

      {/* Filters + Actions */}
      <div className="ems-card mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="ems-input text-sm">
            <option value="">All Statuses</option>
            {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Filter by county..."
            value={filters.county}
            onChange={e => setFilters(f => ({ ...f, county: e.target.value }))}
            className="ems-input text-sm" />
          <button onClick={fetchFleet}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white text-sm">
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowModal(true)}
            className="btn-emergency flex items-center justify-center gap-2 text-sm">
            <FiPlus size={14} /> Add Ambulance
          </button>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-4">
        {['table', 'map'].map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm capitalize transition-colors ${
              activeTab === tab
                ? 'bg-emergency-red text-white'
                : 'border border-ems-border text-ems-muted hover:text-white'
            }`}>
            {tab === 'map' ? '🗺 Live Map' : '📋 Table'}
          </button>
        ))}
      </div>

      {/* Map view */}
      {activeTab === 'map' && <FleetMap ambulances={ambulances} />}

      {/* Table view */}
      {activeTab === 'table' && (
        <div className="ems-card">
          <h3 className="text-ems-white font-semibold mb-4">Ambulances ({ambulances.length})</h3>
          {loading ? (
            <div className="py-16 flex justify-center"><Loader /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                    {['Registration', 'Type', 'County', 'Status', 'EMT', 'Driver', 'Equipment', 'Last Ping'].map(h => (
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
                        <span className="status-badge"
                          style={{ background: `${STATUS_COLORS[a.status]}20`, color: STATUS_COLORS[a.status] }}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-ems-muted text-xs">
                        {a.emt ? `${a.emt.firstName} ${a.emt.lastName}` : '—'}
                      </td>
                      <td className="py-3 pr-4 text-ems-muted text-xs">
                        {a.driver ? `${a.driver.firstName} ${a.driver.lastName}` : '—'}
                      </td>
                      <td className="py-3 pr-4 text-ems-muted text-xs">
                        {a.equipment?.length ? a.equipment.slice(0, 2).join(', ') + (a.equipment.length > 2 ? ` +${a.equipment.length - 2}` : '') : '—'}
                      </td>
                      <td className="py-3 text-ems-muted text-xs">
                        {a.lastPing ? new Date(a.lastPing).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ambulances.length === 0 && (
                <p className="text-center text-ems-muted py-10">No ambulances found</p>
              )}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
