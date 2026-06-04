import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { KENYAN_COUNTIES } from '../../utils/constants';
import { FiPlus, FiEdit2, FiRefreshCw, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const emptyForm = { name:'', type:'public', level:'level_4', county:'', subCounty:'', address:'', phone:'', email:'', shaEmpanelled:false, shaFacilityCode:'', location:{ type:'Point', coordinates:['',''] }, capabilities:{ icu:false, emergency:true, surgery:false, maternity:false, bloodBank:false, dialysis:false }, beds:{ total:'', emergency:'', icu:'' } };

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [county, setCounty] = useState('');
  const [shaFilter, setShaFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const limit = 12;

  useEffect(() => { fetchHospitals(); }, [page, county, shaFilter]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (county) params.county = county;
      if (shaFilter !== '') params.shaEmpanelled = shaFilter;
      const { data } = await api.get('/admin/hospitals', { params });
      setHospitals(data.hospitals);
      setTotal(data.total);
    } catch { toast.error('Failed to load hospitals'); }
    finally { setLoading(false); }
  };

  const openEdit = (h) => {
    setEditing(h._id);
    setForm({ ...emptyForm, ...h, location: h.location || emptyForm.location, capabilities: h.capabilities || emptyForm.capabilities, beds: h.beds || emptyForm.beds });
    setShowModal(true);
  };

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.location.coordinates[0] || !form.location.coordinates[1]) {
      toast.error('Please enter valid coordinates (longitude, latitude)');
      return;
    }
    setSaving(true);
    const payload = { ...form, location: { type: 'Point', coordinates: [parseFloat(form.location.coordinates[0]), parseFloat(form.location.coordinates[1])] } };
    try {
      if (editing) { await api.put(`/admin/hospitals/${editing}`, payload); toast.success('Hospital updated'); }
      else { await api.post('/admin/hospitals', payload); toast.success('Hospital added'); }
      setShowModal(false);
      fetchHospitals();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setCap = (key, val) => setForm(f => ({ ...f, capabilities: { ...f.capabilities, [key]: val } }));
  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Hospital Network">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display text-ems-white">HOSPITAL NETWORK</h2>
          <p className="text-ems-muted text-sm">{total} facilities</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchHospitals} className="btn-ghost p-2.5"><FiRefreshCw size={15} /></button>
          <button onClick={openNew} className="btn-emergency py-2 px-5 flex items-center gap-2 text-sm"><FiPlus size={15} /> Add Hospital</button>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <select value={county} onChange={e => { setCounty(e.target.value); setPage(1); }} className="ems-input w-40 text-sm py-2">
          <option value="">All Counties</option>
          {KENYAN_COUNTIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={shaFilter} onChange={e => { setShaFilter(e.target.value); setPage(1); }} className="ems-input w-44 text-sm py-2">
          <option value="">SHA Status: All</option>
          <option value="true">SHA Empanelled ✓</option>
          <option value="false">Not SHA Empanelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size="lg" /></div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {hospitals.map(h => (
            <div key={h._id} className="ems-card hover:border-emergency-red/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-ems-white font-semibold text-sm leading-tight">{h.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-ems-dark text-ems-muted px-2 py-0.5 rounded-full capitalize">{h.type}</span>
                    <span className="text-xs bg-ems-dark text-ems-muted px-2 py-0.5 rounded-full">{h.level?.replace('_',' ')}</span>
                  </div>
                </div>
                {h.shaEmpanelled && <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full flex-shrink-0"><FiCheckCircle size={10} /> SHA</span>}
              </div>
              <div className="space-y-1 text-xs mb-3">
                <div className="flex items-center gap-2 text-ems-muted"><FiMapPin size={11} className="text-emergency-red flex-shrink-0" />{h.address}, {h.county}</div>
                {h.phone && <div className="flex items-center gap-2 text-ems-muted"><FiPhone size={11} className="text-emergency-red" />{h.phone}</div>}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {Object.entries(h.capabilities || {}).filter(([,v])=>v).map(([cap]) => (
                  <span key={cap} className="text-xs bg-ems-dark border border-ems-border text-ems-muted px-2 py-0.5 rounded-lg capitalize">{cap}</span>
                ))}
              </div>
              {h.beds?.total && <p className="text-ems-muted text-xs mb-3">🛏 {h.beds.total} beds · {h.beds.emergency || 0} emergency · {h.beds.icu || 0} ICU</p>}
              <button onClick={() => openEdit(h)} className="w-full py-1.5 rounded-lg border border-ems-border text-ems-muted hover:text-white hover:border-emergency-red text-xs transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <FiEdit2 size={12} /> Edit Details
              </button>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white disabled:opacity-30 text-sm transition-all">← Prev</button>
          <span className="text-ems-muted text-sm">{page} / {pages}</span>
          <button disabled={page===pages} onClick={()=>setPage(p=>p+1)} className="px-4 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white disabled:opacity-30 text-sm transition-all">Next →</button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Hospital' : 'Add Hospital'} size="xl">
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="text-ems-light text-xs mb-1 block">Hospital Name *</label><input required value={form.name} onChange={e=>setF('name',e.target.value)} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Type</label>
              <select value={form.type} onChange={e=>setF('type',e.target.value)} className="ems-input">
                {['public','private','faith_based','NGO'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="text-ems-light text-xs mb-1 block">Level</label>
              <select value={form.level} onChange={e=>setF('level',e.target.value)} className="ems-input">
                {['level_2','level_3','level_4','level_5','level_6'].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div><label className="text-ems-light text-xs mb-1 block">County *</label>
              <select required value={form.county} onChange={e=>setF('county',e.target.value)} className="ems-input">
                <option value="">Select</option>
                {KENYAN_COUNTIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-ems-light text-xs mb-1 block">Phone</label><input value={form.phone} onChange={e=>setF('phone',e.target.value)} className="ems-input" /></div>
            <div className="col-span-2"><label className="text-ems-light text-xs mb-1 block">Address</label><input value={form.address} onChange={e=>setF('address',e.target.value)} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Longitude *</label><input required type="number" step="any" value={form.location.coordinates[0]} onChange={e=>setForm(f=>({...f,location:{...f.location,coordinates:[e.target.value,f.location.coordinates[1]]}}))} placeholder="36.8219" className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Latitude *</label><input required type="number" step="any" value={form.location.coordinates[1]} onChange={e=>setForm(f=>({...f,location:{...f.location,coordinates:[f.location.coordinates[0],e.target.value]}}))} placeholder="-1.2921" className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">SHA Facility Code</label><input value={form.shaFacilityCode} onChange={e=>setF('shaFacilityCode',e.target.value)} className="ems-input" /></div>
            <div><label className="text-ems-light text-xs mb-1 block">Total Beds</label><input type="number" value={form.beds.total} onChange={e=>setForm(f=>({...f,beds:{...f.beds,total:e.target.value}}))} className="ems-input" /></div>
          </div>

          <div>
            <label className="text-ems-light text-xs mb-2 block">Capabilities</label>
            <div className="grid grid-cols-3 gap-2">
              {['icu','emergency','surgery','maternity','bloodBank','dialysis'].map(cap => (
                <label key={cap} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.capabilities[cap]||false} onChange={e=>setCap(cap,e.target.checked)} className="accent-emergency-red" />
                  <span className="text-ems-muted text-sm capitalize">{cap}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.shaEmpanelled} onChange={e=>setF('shaEmpanelled',e.target.checked)} className="accent-emergency-red" />
            <span className="text-ems-muted text-sm">SHA Empanelled (ECCIF eligible)</span>
          </label>

          <button type="submit" disabled={saving} className="btn-emergency w-full py-3 flex items-center justify-center gap-2">
            {saving ? <Loader size="sm" /> : editing ? 'Save Changes' : 'Add Hospital'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
