import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { joinEMTRoom } from '../../services/socketService';
import api from '../../services/api';
import { emergencyService } from '../../services/emergencyService';
import { timeAgo } from '../../utils/formatTime';
import { STATUS_COLORS, EMERGENCY_TYPES } from '../../utils/constants';
import { FiPhone, FiMapPin, FiCheckCircle, FiAlertTriangle, FiNavigation, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

export default function EMTDispatch() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (user?._id) joinEMTRoom(user._id);
  }, [user]);

  useSocket('dispatch_assigned', (data) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-slide-up' : 'opacity-0'} bg-emergency-red text-white px-6 py-4 rounded-2xl shadow-2xl max-w-sm`}>
        <div className="flex items-center gap-2 mb-1">
          <FiAlertTriangle size={18} />
          <span className="font-bold">New Dispatch!</span>
        </div>
        <p className="text-sm opacity-90 capitalize">{data.severity} {data.type} — {data.patientLocation?.county}</p>
        <p className="text-xs opacity-75 mt-1">{data.patientName}</p>
      </div>
    ), { duration: 10000 });
    fetchJobs();
  }, []);

  useSocket('emergency_cancelled', () => fetchJobs(), []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/emergency/my?limit=20');
      setJobs(data.emergencies || []);
    } catch { toast.error('Failed to load dispatch queue'); }
    finally { setLoading(false); }
  };

  const advance = async (id, nextStatus) => {
    setUpdating(id);
    try {
      await emergencyService.updateStatus(id, { status: nextStatus });
      toast.success(`Status: ${nextStatus.replace(/_/g, ' ')}`);
      fetchJobs();
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const flow = {
    dispatched:   { next: 'enroute',      label: '🚀 Mark En Route',     color: 'btn-emergency' },
    enroute:      { next: 'on_scene',     label: '📍 Arrived On Scene',  color: 'btn-emergency' },
    on_scene:     { next: 'transporting', label: '🏥 Transporting Now',  color: 'btn-emergency' },
    transporting: { next: 'at_hospital',  label: '✅ At Hospital',       color: 'btn-emergency' },
    at_hospital:  { next: 'completed',    label: '✓ Complete & Clear',   color: 'btn-emergency' },
  };

  const active = jobs.filter(j => !['completed','cancelled'].includes(j.status));
  const history = jobs.filter(j => ['completed','cancelled'].includes(j.status));

  return (
    <DashboardLayout title="Dispatch Queue">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Active jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-ems-white">ACTIVE JOBS</h2>
            <button onClick={fetchJobs} className="text-ems-muted hover:text-white text-xs flex items-center gap-1 transition-colors">
              <FiActivity size={12} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader size="lg" text="Loading queue..." /></div>
          ) : active.length === 0 ? (
            <div className="ems-card text-center py-12">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="text-ems-white font-semibold mb-2">No Active Dispatches</h3>
              <p className="text-ems-muted text-sm">You're clear. Stay ready for the next call.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {active.map(job => {
                const typeInfo = EMERGENCY_TYPES.find(t => t.value === job.type);
                const step = flow[job.status];
                return (
                  <div key={job._id} className="ems-card border-emergency-red/30 bg-emergency-red/3">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{typeInfo?.icon || '🚑'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-ems-white font-bold capitalize">{job.type} Emergency</h3>
                            <span className={`status-badge text-xs ${job.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                              {job.severity}
                            </span>
                          </div>
                          <p className="text-ems-muted text-xs">{job.emergencyId} · {timeAgo(job.createdAt)}</p>
                        </div>
                      </div>
                      <span className="status-badge text-xs" style={{ background: `${STATUS_COLORS[job.status]}20`, color: STATUS_COLORS[job.status] }}>
                        {job.status?.replace(/_/g,' ')}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Patient */}
                      {job.patient && (
                        <div className="bg-ems-dark rounded-xl p-3">
                          <p className="text-ems-muted text-xs mb-1.5 uppercase tracking-wider">Patient</p>
                          <p className="text-ems-white font-semibold text-sm">{job.patient.firstName} {job.patient.lastName}</p>
                          <p className="text-ems-muted text-xs">Blood: <span className="text-emergency-red font-medium">{job.patient.bloodGroup}</span></p>
                          {job.patient.allergies?.length > 0 && (
                            <p className="text-yellow-400 text-xs mt-1">⚠ {job.patient.allergies.slice(0,2).join(', ')}</p>
                          )}
                        </div>
                      )}

                      {/* Location */}
                      <div className="bg-ems-dark rounded-xl p-3">
                        <p className="text-ems-muted text-xs mb-1.5 uppercase tracking-wider flex items-center gap-1"><FiMapPin size={10} /> Location</p>
                        <p className="text-ems-white text-sm font-medium">{job.patientLocation?.county}</p>
                        {job.patientLocation?.address && <p className="text-ems-muted text-xs mt-0.5">{job.patientLocation.address}</p>}
                        {job.patientLocation?.what3words && (
                          <p className="text-blue-400 text-xs mt-1">📍 {job.patientLocation.what3words}</p>
                        )}
                      </div>
                    </div>

                    {/* AI guidance */}
                    {job.aiTriageSummary && (
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 mb-4">
                        <p className="text-blue-400 text-xs font-medium mb-1">🤖 AI Triage</p>
                        <p className="text-ems-muted text-xs">{job.aiTriageSummary}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 flex-wrap">
                      {step && (
                        <button
                          onClick={() => advance(job._id, step.next)}
                          disabled={updating === job._id}
                          className="btn-emergency flex items-center gap-2 py-3 px-6 flex-1 justify-center disabled:opacity-60"
                        >
                          {updating === job._id ? <Loader size="sm" /> : step.label}
                        </button>
                      )}

                      {job.patient?.phone && (
                        <a href={`tel:${job.patient.phone}`}
                          className="btn-ghost flex items-center gap-2 py-3 px-5 text-sm">
                          <FiPhone size={15} /> Patient
                        </a>
                      )}

                      {job.patientLocation?.coordinates && (
                        <a
                          href={`https://maps.google.com/?q=${job.patientLocation.coordinates[1]},${job.patientLocation.coordinates[0]}`}
                          target="_blank" rel="noreferrer"
                          className="btn-ghost flex items-center gap-2 py-3 px-5 text-sm"
                        >
                          <FiNavigation size={15} /> Navigate
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <h2 className="text-sm font-display text-ems-muted uppercase tracking-widest mb-3">Recent History</h2>
            <div className="space-y-2">
              {history.slice(0, 8).map(job => (
                <div key={job._id} className="flex items-center gap-4 p-3 bg-ems-dark border border-ems-border rounded-xl">
                  <span className="text-xl">{EMERGENCY_TYPES.find(t=>t.value===job.type)?.icon || '🚑'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-ems-white text-sm capitalize">{job.type}</p>
                    <p className="text-ems-muted text-xs">{job.patientLocation?.county} · {timeAgo(job.createdAt)}</p>
                  </div>
                  {job.responseTime && (
                    <span className="text-green-400 text-xs font-medium">{job.responseTime} min</span>
                  )}
                  <span className="status-badge text-xs" style={{ background: `${STATUS_COLORS[job.status]}20`, color: STATUS_COLORS[job.status] }}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
