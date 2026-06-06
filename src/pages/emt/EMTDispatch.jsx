import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { timeAgo } from '../../utils/formatTime';
import { STATUS_COLORS } from '../../utils/constants';
import {
  FiMapPin, FiPhone, FiHeart, FiAlertTriangle,
  FiCheckCircle, FiNavigation, FiUser, FiClock
} from 'react-icons/fi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['dispatched', 'enroute', 'on_scene', 'transporting', 'at_hospital', 'completed'];

export default function EMTDispatch() {
  const [cases, setCases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchCases(); }, []);

  useSocket('dispatch_assigned', () => { fetchCases(); }, []);

  const fetchCases = async () => {
    try {
      const res = await api.get('/emt/cases?limit=20');
      const active = (res.data.cases || []).filter(c => c.status !== 'completed' && c.status !== 'cancelled');
      setCases(active);
      if (active.length > 0 && !selected) setSelected(active[0]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const advanceStatus = async () => {
    if (!selected) return;
    const currentIdx = STATUS_STEPS.indexOf(selected.status);
    const nextStatus = STATUS_STEPS[currentIdx + 1];
    if (!nextStatus) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/emt/cases/${selected._id}/status`, { status: nextStatus });
      setSelected(res.data.emergency);
      toast.success(`Status updated: ${nextStatus.replace(/_/g, ' ')}`);
      fetchCases();
    } catch (e) {
      toast.error('Failed to update status');
    } finally { setUpdating(false); }
  };

  const nextStatus = selected ? STATUS_STEPS[STATUS_STEPS.indexOf(selected.status) + 1] : null;

  const severityColor = (s) => s === 'critical' ? 'text-red-400' : s === 'high' ? 'text-orange-400' : 'text-yellow-400';

  return (
    <DashboardLayout title="Dispatch">
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Case list */}
        <div className="ems-card">
          <h3 className="text-ems-white font-semibold mb-4">Active Cases ({cases.length})</h3>
          {loading ? <div className="py-10 flex justify-center"><Loader /></div> :
           cases.length === 0 ? (
            <div className="text-center py-12">
              <FiCheckCircle size={36} className="text-ems-muted mx-auto mb-2" />
              <p className="text-ems-muted text-sm">No active cases</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cases.map(c => (
                <button key={c._id} onClick={() => setSelected(c)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    selected?._id === c._id ? 'bg-emergency-red/10 border border-emergency-red/30' : 'bg-ems-dark hover:bg-ems-black'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-ems-white text-sm font-medium capitalize">{c.type}</span>
                    <span className={`text-xs font-semibold ${severityColor(c.severity)}`}>{c.severity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ems-muted">
                    <FiMapPin size={10} /> {c.patientLocation?.county || 'Unknown'}
                    <span>·</span>
                    <FiClock size={10} /> {timeAgo(c.createdAt)}
                  </div>
                  <div className="mt-1.5">
                    <span className="status-badge text-xs"
                      style={{ background: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status] }}>
                      {c.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Case detail */}
        <div className="lg:col-span-2 space-y-4">
          {!selected ? (
            <div className="ems-card text-center py-16">
              <FiAlertTriangle size={40} className="text-ems-muted mx-auto mb-3" />
              <p className="text-ems-muted">Select a case to view details</p>
            </div>
          ) : (
            <>
              {/* Status progress */}
              <div className="ems-card">
                <h3 className="text-ems-white font-semibold mb-4">Case Progress</h3>
                <div className="flex items-center gap-1 flex-wrap">
                  {STATUS_STEPS.map((step, i) => {
                    const currentIdx = STATUS_STEPS.indexOf(selected.status);
                    const done = i <= currentIdx;
                    return (
                      <div key={step} className="flex items-center gap-1">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          done ? 'bg-emergency-red/20 text-emergency-red' : 'bg-ems-dark text-ems-muted'
                        }`}>
                          {step.replace(/_/g, ' ')}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`w-3 h-0.5 ${done && i < currentIdx ? 'bg-emergency-red' : 'bg-ems-border'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {nextStatus && (
                  <button onClick={advanceStatus} disabled={updating}
                    className="btn-emergency mt-4 px-6 py-2.5 flex items-center gap-2 disabled:opacity-60">
                    {updating ? <Loader size="sm" /> : (
                      <><FiNavigation size={15} /> Mark as {nextStatus.replace(/_/g, ' ')}</>
                    )}
                  </button>
                )}
                {!nextStatus && selected.status === 'completed' && (
                  <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                    <FiCheckCircle size={16} /> Case completed
                  </div>
                )}
              </div>

              {/* Patient info */}
              <div className="ems-card">
                <h3 className="text-ems-white font-semibold mb-4">Patient</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Name',        value: `${selected.patient?.firstName || ''} ${selected.patient?.lastName || ''}` },
                    { label: 'Phone',        value: selected.patient?.phone || 'N/A' },
                    { label: 'Blood Group',  value: selected.patient?.bloodGroup || 'Unknown' },
                    { label: 'County',       value: selected.patientLocation?.county || 'Unknown' },
                    { label: 'Emergency Type', value: selected.type },
                    { label: 'Severity',     value: selected.severity },
                    { label: 'SHA Verified', value: selected.shaVerified ? 'Yes' : 'No' },
                    { label: 'Reported',     value: timeAgo(selected.createdAt) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-2 py-2 border-b border-ems-border last:border-0">
                      <span className="text-ems-muted text-xs">{label}</span>
                      <span className="text-ems-white text-xs font-medium text-right capitalize">{value}</span>
                    </div>
                  ))}
                </div>
                {selected.patient?.phone && (
                  <a href={`tel:${selected.patient.phone}`}
                    className="mt-4 flex items-center gap-2 text-emergency-red text-sm font-semibold hover:underline">
                    <FiPhone size={14} /> Call Patient
                  </a>
                )}
              </div>

              {/* Allergies / conditions */}
              {(selected.patient?.allergies?.length > 0 || selected.patient?.medicalConditions?.length > 0) && (
                <div className="ems-card border-orange-500/20 bg-orange-500/5">
                  <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                    <FiHeart size={15} /> Medical Alerts
                  </h3>
                  {selected.patient?.allergies?.length > 0 && (
                    <p className="text-ems-muted text-xs mb-1">
                      <strong className="text-white">Allergies:</strong> {selected.patient.allergies.join(', ')}
                    </p>
                  )}
                  {selected.patient?.medicalConditions?.length > 0 && (
                    <p className="text-ems-muted text-xs">
                      <strong className="text-white">Conditions:</strong> {selected.patient.medicalConditions.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
