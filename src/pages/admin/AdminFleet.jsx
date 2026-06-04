import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { timeAgo } from '../../utils/formatTime';
import { KENYAN_COUNTIES, AMBULANCE_TYPES } from '../../utils/constants';
import { FiPlus, FiEdit2, FiMapPin, FiRefreshCw, FiTruck, FiWifi } from 'react-icons/fi';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatsCard from '../../components/StatsCard';
import toast from 'react-hot-toast';
import { useSocket } from '../../hooks/useSocket';
import { joinAdminRoom } from '../../services/socketService';

const statusColors = { available:'text-green-400 bg-green-500/10', dispatched:'text-blue-400 bg-blue-500/10', enroute:'text-orange-400 bg-orange-500/10', on_scene:'text-purple-400 bg-purple-500/10', transporting:'text-cyan-400 bg-cyan-500/10', maintenance:'text-yellow-400 bg-yellow-500/10', offline:'text-gray-400 bg-gray-500/10' };

const emptyForm = { registrationNumber:'', type:'BLS', county:'', provider:{ name:'', contact:'' }, equipment:{ defibrillator:false, ventilator:false, oxygenLevel:80, traumaKit:true, pulseOximeter:true, stretcher:true }, kmpldc:{ licenseNumber:'', isValid:false }, roadworthiness:{ isRoadworthy:false } };

export default function AdminFleet() {
  const [ambulances, setAmbulances] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ county:'', status:'', type:'' });
  const [liveLocations, setLiveLocations] = useState({});

  useEffect(() => { fetchFleet(); joinAdminRoom(); }, [filters]);

  useSocket('ambulance_location', (data) => {
    setLiveLocations(prev => ({ ...prev, [data.id]: { coordinates: data.coordinates, ts: new Date() } }));
  }, []);

  useSocket('ambulance_status_change', () => fetchFleet(), []);

  const fetchFleet = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v));
      const { data } = await api.get('/admin/fleet', { params });
      setAmbulances(data.ambulances);
      setStats(data.stats);
    } catch { toast.error('Failed to load fleet'); }
    finally { setLoading(false); }
  };

  const openEdit = (amb) => {
    setEditing(amb._id);
    setForm({
      registrationNumber: amb.registrationNumber,
      type: amb.type,
      county: amb.county,
      provider: amb.provider || { name:'', contact:'' },
      equipment: amb.equipment || emptyForm.equipment,
      kmpldc: amb.kmpldc || emptyForm.kmpldc,
      roadworthiness: amb.roadworthiness || emptyForm.roadworthiness
    });
    setShowModal(true);
  };

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/ambulances/${editing}`, form);
        toast.success('Ambulance updated');
      } else {
        await api.post('/ambulances', form);
        toast.success('Ambulance added to fleet');
      }
      setShowModal(false);
      fetchFleet();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const setStatus = async (id, status) => {
    try {
      await api.put(`/ambulances/${id}/status`, { status });
      toast.success(`Status set to ${status}`);
      fetchFleet();
    } catch { toast.error('Failed to update status'); }
  };

  const statsMap = Object.fromEntries(stats.map(s => [s._id, s.count]));

  return (
    <AdminLayout title="Fleet Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display text-ems-white">FLEET MANAGEMENT</h2>
          <p className="text-ems-muted text-sm">{ambulances.length} active units</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchFleet} className="btn-ghost p-2.5"><FiRefreshCw size={15} /></button>
          <button onClick={openNew} className="btn-emergency py-2 px-5 flex items-center gap-2 text-sm"><FiPlus size={15} /> Add Unit</button>
        </div>
      </div>

      {/* Status stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { key:'available', label:'Available', color:'#22C55E' },
          { key:'dispatched', label:'Dispatched', color:'#3B82F6' },
          { key:'maintenance', label:'Maintenance', color:'#F59E0B' },
          { key:'offline', label:'Offline', color:'#6B7280' }
        ].map(({ key, label, color }) => (
          <div key={key} className="ems-card text-center">
            <div className="text-3xl font-display" style={{ color }}>{statsMap[key] || 0}</div>
            <div className="text-ems-muted text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { key:'status', options:['available','dispatched','enroute','maintenance','offline'], label:'All Statuses' },
          { key:'type', options:['ALS','BLS','motorcycle','air','medical_taxi'], label:'All Types' },
        ].map(({ key, options, label }) => (
          <select key={key} value={filters[key]} onChange={e => setFilters(f => ({...f,[key]:e.target.value}))} className="ems-input w-40 text-sm py-2">
            <option value="">{label}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <select value={filters.county} onChange={e => setFilters(f => ({...f,county:e.target.value}))} className="ems-input w-40 text-sm py-2">
          <option value="">All Counties</option>
          {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Fleet grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader size="lg" /></div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ambulances.map(amb => {
            const live = liveLocations[amb._id];
            return (
              <div key={amb._id} className="ems-card hover:border-emergency-red/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-ems-white font-bold">{amb.registrationNumber}</span>
                      {live && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" title="Live GPS" />}
                    </div>
                    <span className="text-xs text-ems-muted">{amb.type} · {amb.county}</span>
                  </div>
                  <span className={`status-badge text-xs ${statusColors[amb.status] || 'bg-ems-dark text-ems-muted'}`}>
                    {amb.status}
                  </span>
                </div>

                {/* EMT */}
                {amb.emt && (
                  <div className="text-sm text-ems-muted mb-3">
                    👤 {amb.emt.firstName} {amb.emt.lastName} · {amb.emt.phone}
                  </div>
                )}

                {/* Equipment badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {amb.equipment?.defibrillator && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">AED</span>}
                  {amb.equipment?.ventilator && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Vent</span>}
                  {amb.equipment?.oxygenLevel > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${amb.equipment.oxygenLevel > 50 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>O₂ {amb.equipment.oxygenLevel}%</span>}
                  {amb.equipment?.traumaKit && <span className="text-xs bg-ems-dark text-ems-muted px-2 py-0.5 rounded-full">Trauma</span>}
                </div>

                {/* Compliance */}
                <div className="flex gap-2 text-xs mb-3">
                  <span className={amb.kmpldc?.isValid ? 'text-green-400' : 'text-red-400'}>
                    {amb.kmpldc?.isValid ? '✓' : '✗'} KMPDC
                  </span>
                  <span className={amb.roadworthiness?.isRoadworthy ? 'text-green-400' : 'text-red-400'}>
                    {amb.roadworthiness?.isRoadworthy ? '✓' : '✗'} Roadworthy
                  </span>
                </div>

                {/* Last ping */}
                {amb.lastPing && (
                  <div className="flex items-center gap-1 text-ems-muted text-xs mb-3">
                    <FiWifi size={11} /> Last ping: {timeAgo(amb.lastPing)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-ems-border">
                  <button onClick={() => openEdit(amb)} className="flex-1 py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white hover:border-emergency-red text-xs transition-all flex items-center justify-center gap-1">
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <select value={amb.status} onChange={e => setStatus(amb._id, e.target.value)} className="flex-1 bg-ems-dark border border-ems-border rounded-lg px-2 py-1.5 text-ems-muted text-xs">
                    {['available','dispatched','maintenance','offline'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
          {ambulances.length === 0 && (
            <div className="col-span-3 text-center py-16 text-ems-muted">
              <FiTruck size={40} className="mx-auto mb-3 opacity-30" />
              <p>No ambulances found</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Ambulance' : 'Add Ambulance'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-ems-light text-xs mb-1 block">Registration Number *</label>
              <input required value={form.registrationNumber} onChange={e => setForm(f=>({...f,registrationNumber:e.target.value}))} placeholder="KDA 001A" className="ems-input" />
            </div>
            <div>
              <label className="text-ems-light text-xs mb-1 block">Type *</label>
              <select required value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} className="ems-input">
                {['ALS','BLS','motorcycle','air','medical_taxi'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-ems-light text-xs mb-1 block">County *</label>
              <select required value={form.county} onChange={e => setForm(f=>({...f,county:e.target.value}))} className="ems-input">
                <option value="">Select county</option>
                {KENYAN_COUNTIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-ems-light text-xs mb-1 block">Provider Name</label>
              <input value={form.provider.name} onChange={e => setForm(f=>({...f,provider:{...f.provider,name:e.target.value}}))} placeholder="EMS Kenya Fleet" className="ems-input" />
            </div>
            <div>
              <label className="text-ems-light text-xs mb-1 block">KMPDC License</label>
              <input value={form.kmpldc.licenseNumber} onChange={e => setForm(f=>({...f,kmpldc:{...f.kmpldc,licenseNumber:e.target.value}}))} className="ems-input" />
            </div>
            <div>
              <label className="text-ems-light text-xs mb-1 block">Oxygen Level (%)</label>
              <input type="number" min="0" max="100" value={form.equipment.oxygenLevel} onChange={e => setForm(f=>({...f,equipment:{...f.equipment,oxygenLevel:+e.target.value}}))} className="ems-input" />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key:'defibrillator', label:'AED/Defibrillator' },
              { key:'ventilator', label:'Ventilator' },
              { key:'traumaKit', label:'Trauma Kit' },
              { key:'pulseOximeter', label:'Pulse Oximeter' },
              { key:'stretcher', label:'Stretcher' },
              { key:'bloodProducts', label:'Blood Products' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.equipment[key] || false}
                  onChange={e => setForm(f=>({...f,equipment:{...f.equipment,[key]:e.target.checked}}))}
                  className="accent-emergency-red" />
                <span className="text-ems-muted text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.kmpldc.isValid} onChange={e => setForm(f=>({...f,kmpldc:{...f.kmpldc,isValid:e.target.checked}}))} className="accent-emergency-red" />
              <span className="text-ems-muted text-sm">KMPDC Valid</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.roadworthiness.isRoadworthy} onChange={e => setForm(f=>({...f,roadworthiness:{...f.roadworthiness,isRoadworthy:e.target.checked}}))} className="accent-emergency-red" />
              <span className="text-ems-muted text-sm">Roadworthy</span>
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-emergency w-full py-3 flex items-center justify-center gap-2">
            {saving ? <Loader size="sm" /> : editing ? 'Save Changes' : 'Add to Fleet'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
