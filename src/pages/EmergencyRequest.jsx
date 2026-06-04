import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../hooks/useLocation';
import { EMERGENCY_TYPES, KENYAN_COUNTIES } from '../utils/constants';
import toast from 'react-hot-toast';
import { FiMapPin, FiAlertTriangle, FiClock, FiWifi, FiNavigation } from 'react-icons/fi';
import Loader from '../components/Loader';
import AlertBox from '../components/AlertBox';

export default function EmergencyRequest() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [what3words, setWhat3words] = useState('');
  const [county, setCounty] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [useGPS, setUseGPS] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { createEmergency } = useEmergency();
  const { location, loading: locLoading, error: locError, getLocation } = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedType) { toast.error('Please select emergency type'); return; }

    const coords = useGPS && location
      ? [location.lng, location.lat]
      : [36.8219, -1.2921]; // fallback Nairobi

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

        {/* Step 1 — Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-display text-ems-white mb-1">WHAT IS YOUR EMERGENCY?</h2>
              <p className="text-ems-muted text-sm">Select the closest match. Our AI triage will assess severity.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EMERGENCY_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedType === type.value ? 'border-emergency-red bg-emergency-red/10' : 'border-ems-border bg-ems-card hover:border-emergency-red/40'}`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-ems-white font-medium text-sm">{type.label}</div>
                  <div className="mt-1 text-xs" style={{ color: type.color }}>
                    ● {type.severity.toUpperCase()}
                  </div>
                </button>
              ))}
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

        {/* Step 2 — Location */}
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

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-display text-ems-white mb-1">CONFIRM DISPATCH</h2>
              <p className="text-ems-muted text-sm">Review your emergency details before dispatching a responder.</p>
            </div>

            <div className="ems-card space-y-4">
              {[
                { label: 'Emergency Type', value: EMERGENCY_TYPES.find(t => t.value === selectedType)?.label },
                { label: 'Description', value: description || 'Not provided' },
                { label: 'Location Method', value: useGPS && location ? `GPS (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : 'Manual' },
                { label: 'what3words', value: what3words || 'Not provided' },
                { label: 'County', value: county || 'Not selected' },
                { label: 'Address', value: manualAddress || 'Not provided' }
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
