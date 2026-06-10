import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../hooks/useLocation';
import { KENYAN_COUNTIES } from '../utils/constants';
import toast from 'react-hot-toast';
import { FiMapPin, FiAlertTriangle, FiClock, FiWifi, FiNavigation } from 'react-icons/fi';
import Loader from '../components/Loader';
import AlertBox from '../components/AlertBox';

const EMERGENCY_TYPES = [
  // Critical / Immediately Life-Threatening
  { value: 'cardiac_arrest',   label: 'Cardiac Arrest',       icon: '💔', severity: 'critical', color: '#FF3B30' },
  { value: 'stroke',           label: 'Stroke',                icon: '🧠', severity: 'critical', color: '#FF3B30' },
  { value: 'severe_bleeding',  label: 'Severe Bleeding',       icon: '🩸', severity: 'critical', color: '#FF3B30' },
  { value: 'choking',          label: 'Choking',               icon: '🫁', severity: 'critical', color: '#FF3B30' },
  { value: 'drowning',         label: 'Drowning',              icon: '🌊', severity: 'critical', color: '#FF3B30' },
  { value: 'anaphylaxis',      label: 'Severe Allergy / Anaphylaxis', icon: '⚠️', severity: 'critical', color: '#FF3B30' },
  // High Priority
  { value: 'trauma',           label: 'Trauma / Accident',     icon: '🩹', severity: 'high',     color: '#F59E0B' },
  { value: 'road_accident',    label: 'Road Traffic Accident', icon: '🚗', severity: 'high',     color: '#F59E0B' },
  { value: 'cardiac',          label: 'Chest Pain / Cardiac',  icon: '❤️', severity: 'high',     color: '#F59E0B' },
  { value: 'breathing',        label: 'Breathing Difficulty',  icon: '😮‍💨', severity: 'high',   color: '#F59E0B' },
  { value: 'unconscious',      label: 'Unconscious / Unresponsive', icon: '😶', severity: 'high', color: '#F59E0B' },
  { value: 'seizure',          label: 'Seizure / Convulsions', icon: '⚡', severity: 'high',     color: '#F59E0B' },
  { value: 'obstetric',        label: 'Obstetric / Childbirth',icon: '🤱', severity: 'high',     color: '#F59E0B' },
  { value: 'pediatric',        label: 'Child Emergency',       icon: '👶', severity: 'high',     color: '#F59E0B' },
  { value: 'burns',            label: 'Burns',                 icon: '🔥', severity: 'high',     color: '#F59E0B' },
  { value: 'poisoning',        label: 'Poisoning / Overdose',  icon: '☠️', severity: 'high',     color: '#F59E0B' },
  { value: 'electrocution',    label: 'Electrocution',         icon: '⚡', severity: 'high',     color: '#F59E0B' },
  { value: 'assault',          label: 'Assault / Violence',    icon: '🆘', severity: 'high',     color: '#F59E0B' },
  // Medium Priority
  { value: 'fracture',         label: 'Fracture / Broken Bone',icon: '🦴', severity: 'medium',   color: '#3B82F6' },
  { value: 'fall',             label: 'Fall / Slip',           icon: '🧍', severity: 'medium',   color: '#3B82F6' },
  { value: 'diabetic',         label: 'Diabetic Emergency',    icon: '🩺', severity: 'medium',   color: '#3B82F6' },
  { value: 'mental_health',    label: 'Mental Health Crisis',  icon: '🧘', severity: 'medium',   color: '#3B82F6' },
  { value: 'eye_injury',       label: 'Eye Injury',            icon: '👁️', severity: 'medium',   color: '#3B82F6' },
  { value: 'animal_bite',      label: 'Animal / Snake Bite',   icon: '🐍', severity: 'medium',   color: '#3B82F6' },
  { value: 'heat_stroke',      label: 'Heat Stroke / Dehydration', icon: '🌡️', severity: 'medium', color: '#3B82F6' },
  { value: 'industrial',       label: 'Industrial / Work Accident', icon: '🏭', severity: 'medium', color: '#3B82F6' },
  // Lower Priority
  { value: 'abdominal_pain',   label: 'Severe Abdominal Pain', icon: '🤢', severity: 'low',      color: '#22C55E' },
  { value: 'allergic',         label: 'Allergic Reaction',     icon: '🤧', severity: 'low',      color: '#22C55E' },
  { value: 'headache',         label: 'Severe Headache / Migraine', icon: '🤕', severity: 'low', color: '#22C55E' },
  { value: 'other',            label: 'Other Emergency',       icon: '🚑', severity: 'low',      color: '#22C55E' },
];

const SEVERITY_LABELS = {
  critical: { label: 'CRITICAL', color: '#FF3B30', bg: 'bg-red-500/10 border-red-500/30' },
  high:     { label: 'HIGH',     color: '#F59E0B', bg: 'bg-amber-500/10 border-amber-500/30' },
  medium:   { label: 'MEDIUM',   color: '#3B82F6', bg: 'bg-blue-500/10 border-blue-500/30' },
  low:      { label: 'LOW',      color: '#22C55E', bg: 'bg-green-500/10 border-green-500/30' },
};

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low'];

export default function EmergencyRequest() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [what3words, setWhat3words] = useState('');
  const [county, setCounty] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [useGPS, setUseGPS] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [typeSearch, setTypeSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const { createEmergency } = useEmergency();
  const { location, loading: locLoading, error: locError, getLocation } = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedType) { toast.error('Please select emergency type'); return; }

    const coords = useGPS && location
      ? [location.lng, location.lat]
      : [36.8219, -1.2921];

    setSubmitting(true);
    try {
      const result = await createEmergency({
        type: selectedType,
        description,
        coordinates: coords,
        address: manualAddress || 'Location detected via GPS',
        what3words,
        county,
      });

      toast.success(`Responder dispatched! ETA: ~${result.eta} minutes`);
      navigate(`/tracking/${result.emergency._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch. Please call 0700 395 395');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTypes = EMERGENCY_TYPES.filter(t => {
    const matchSearch = !typeSearch || t.label.toLowerCase().includes(typeSearch.toLowerCase());
    const matchSeverity = !severityFilter || t.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const groupedTypes = SEVERITY_ORDER.reduce((acc, sev) => {
    const items = filteredTypes.filter(t => t.severity === sev);
    if (items.length) acc[sev] = items;
    return acc;
  }, {});

  const selectedTypeInfo = EMERGENCY_TYPES.find(t => t.value === selectedType);

  return (
    <DashboardLayout title="Emergency Request">
      {/* Critical warning */}
      <div className="bg-emergency-red text-white rounded-2xl p-4 mb-6 flex items-center gap-4">
        <FiAlertTriangle size={24} className="flex-shrink-0" />
        <div>
          <p className="font-semibold">Life-threatening emergency?</p>
          <p className="text-sm opacity-90">Call <strong>1514</strong> (Toll Free) or <strong>0700 395 395</strong> immediately for fastest response</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s <= step ? 'bg-emergency-red text-white' : 'bg-ems-card border border-ems-border text-ems-muted'}`}>
                {s}
              </div>
              <span className={`text-sm flex-1 ${s === step ? 'text-ems-white font-medium' : 'text-ems-muted'}`}>
                {s === 1 ? 'Emergency Type' : s === 2 ? 'Your Location' : 'Confirm & Dispatch'}
              </span>
              {s < 3 && <div className={`h-px flex-1 ${s < step ? 'bg-emergency-red' : 'bg-ems-border'}`} />}
            </div>
          ))}
        </div>

        {/* ── Step 1 — Type ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-display text-ems-white mb-1">WHAT IS YOUR EMERGENCY?</h2>
              <p className="text-ems-muted text-sm">Select the closest match. Our dispatch team will assess severity.</p>
            </div>

            {/* Search + severity filter */}
            <div className="flex gap-2">
              <input
                value={typeSearch}
                onChange={e => setTypeSearch(e.target.value)}
                placeholder="Search emergency type..."
                className="ems-input flex-1 text-sm"
              />
              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="ems-input text-sm w-36">
                <option value="">All Severity</option>
                {SEVERITY_ORDER.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Selected indicator */}
            {selectedTypeInfo && (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-emergency-red/40 bg-emergency-red/10">
                <span className="text-xl">{selectedTypeInfo.icon}</span>
                <span className="text-ems-white text-sm font-medium">{selectedTypeInfo.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                  style={{ color: selectedTypeInfo.color, background: `${selectedTypeInfo.color}20` }}>
                  {selectedTypeInfo.severity.toUpperCase()}
                </span>
              </div>
            )}

            {/* Grouped type grid */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {Object.entries(groupedTypes).map(([sev, types]) => {
                const sevInfo = SEVERITY_LABELS[sev];
                return (
                  <div key={sev}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-2 ${sevInfo.bg}`}>
                      <span className="text-xs font-bold" style={{ color: sevInfo.color }}>{sevInfo.label}</span>
                      <span className="text-ems-muted text-xs">— {types.length} types</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {types.map(type => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(type.value)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            selectedType === type.value
                              ? 'border-emergency-red bg-emergency-red/10'
                              : 'border-ems-border bg-ems-card hover:border-emergency-red/40'
                          }`}
                        >
                          <div className="text-2xl mb-1.5">{type.icon}</div>
                          <div className="text-ems-white font-medium text-xs leading-tight">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {Object.keys(groupedTypes).length === 0 && (
                <p className="text-center text-ems-muted py-8">No emergency types match "{typeSearch}"</p>
              )}
            </div>

            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">Additional Details (optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the emergency... age of patient, visible injuries, consciousness level"
                className="ems-input resize-none"
              />
            </div>

            <button
              disabled={!selectedType}
              onClick={() => setStep(2)}
              className="btn-emergency w-full py-4 disabled:opacity-40"
            >
              Continue to Location →
            </button>
          </div>
        )}

        {/* ── Step 2 — Location ──────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-display text-ems-white mb-1">WHERE ARE YOU?</h2>
              <p className="text-ems-muted text-sm">Accurate location = faster dispatch. Use GPS or describe your location.</p>
            </div>

            {/* GPS */}
            <div className="ems-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${useGPS ? 'bg-emergency-red/10' : 'bg-ems-dark'}`}>
                    <FiNavigation size={16} className={useGPS ? 'text-emergency-red' : 'text-ems-muted'} />
                  </div>
                  <div>
                    <p className="text-ems-white text-sm font-medium">Use GPS Location</p>
                    <p className="text-ems-muted text-xs">Most accurate — recommended</p>
                  </div>
                </div>
                <button
                  onClick={() => setUseGPS(!useGPS)}
                  className={`w-12 h-6 rounded-full transition-all ${useGPS ? 'bg-emergency-red' : 'bg-ems-border'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white mx-0.5 transition-transform ${useGPS ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {useGPS && (
                <div>
                  {locLoading && <div className="flex items-center gap-2 text-ems-muted text-sm"><Loader size="sm" /><span>Getting location...</span></div>}
                  {locError && <AlertBox type="warning" message="GPS unavailable. Please enter location manually below." />}
                  {location && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <FiMapPin size={14} /> Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      <span className="text-ems-muted text-xs">(±{Math.round(location.accuracy)}m)</span>
                    </div>
                  )}
                  {!locLoading && !location && !locError && (
                    <button onClick={getLocation} className="text-emergency-red text-sm hover:underline">
                      Tap to detect GPS →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* what3words */}
            <div>
              <label className="text-ems-light text-sm font-medium mb-2 flex items-center gap-2">
                <FiWifi size={14} className="text-emergency-red" />
                what3words Address (Rural areas)
              </label>
              <input
                value={what3words}
                onChange={e => setWhat3words(e.target.value)}
                placeholder="e.g. table.chair.lamp"
                className="ems-input"
              />
              <p className="text-ems-muted text-xs mt-1">Open what3words app to find your 3-word address</p>
            </div>

            {/* County + Street */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-ems-light text-sm font-medium mb-2 block">County</label>
                <select value={county} onChange={e => setCounty(e.target.value)} className="ems-input">
                  <option value="">Select county</option>
                  {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-ems-light text-sm font-medium mb-2 block">Street / Area</label>
                <input value={manualAddress} onChange={e => setManualAddress(e.target.value)} placeholder="e.g. Ngong Road, near Total" className="ems-input" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1 py-3.5">← Back</button>
              <button onClick={() => setStep(3)} className="btn-emergency flex-1 py-3.5">
                Review & Dispatch →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 — Confirm ───────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-display text-ems-white mb-1">CONFIRM DISPATCH</h2>
              <p className="text-ems-muted text-sm">Review your emergency details before dispatching a responder.</p>
            </div>

            <div className="ems-card space-y-4">
              {[
                { label: 'Emergency Type', value: selectedTypeInfo ? `${selectedTypeInfo.icon} ${selectedTypeInfo.label}` : '—' },
                { label: 'Severity',       value: selectedTypeInfo?.severity?.toUpperCase() || '—' },
                { label: 'Description',    value: description || 'Not provided' },
                { label: 'Location Method', value: useGPS && location ? `GPS (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : 'Manual' },
                { label: 'what3words',     value: what3words || 'Not provided' },
                { label: 'County',         value: county || 'Not selected' },
                { label: 'Address',        value: manualAddress || 'Not provided' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4 py-2 border-b border-ems-border last:border-0">
                  <span className="text-ems-muted text-sm flex-shrink-0">{label}</span>
                  <span className="text-ems-white text-sm text-right">{value}</span>
                </div>
              ))}
            </div>

            <AlertBox type="info" message="By dispatching, you confirm this is a genuine emergency. False calls are a criminal offence under Kenyan law." />

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost flex-1 py-3.5">← Back</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-emergency flex-1 py-4 flex items-center justify-center gap-2 text-lg font-bold disabled:opacity-60"
              >
                {submitting ? <><Loader size="sm" /><span>Dispatching...</span></> : <><FiAlertTriangle size={18} /> DISPATCH NOW</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
