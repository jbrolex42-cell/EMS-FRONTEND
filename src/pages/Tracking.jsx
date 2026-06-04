import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { emergencyService } from '../services/emergencyService';
import { useSocket } from '../hooks/useSocket';
import { joinEmergencyRoom } from '../services/socketService';
import { STATUS_COLORS, EMERGENCY_TYPES } from '../utils/constants';
import { timeAgo, formatDateTime } from '../utils/formatTime';
import { FiPhone, FiMapPin, FiClock, FiActivity, FiCheckCircle } from 'react-icons/fi';
import Loader from '../components/Loader';

const statusSteps = ['pending', 'dispatched', 'enroute', 'on_scene', 'transporting', 'at_hospital', 'completed'];
const statusLabels = {
  pending: 'Request Received',
  dispatched: 'Responder Dispatched',
  enroute: 'En Route to You',
  on_scene: 'Responder On Scene',
  transporting: 'Transporting to Hospital',
  at_hospital: 'At Hospital',
  completed: 'Completed'
};

export default function Tracking() {
  const { id } = useParams();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState(null);

  useEffect(() => {
    if (!id) return;
    emergencyService.getById(id)
      .then(({ data }) => { setEmergency(data.emergency); setLiveStatus(data.emergency.status); })
      .catch(() => {})
      .finally(() => setLoading(false));

    joinEmergencyRoom(id);
  }, [id]);

  useSocket('status_update', (data) => {
    setLiveStatus(data.status);
    setEmergency(prev => prev ? { ...prev, status: data.status } : prev);
  }, []);

  if (loading) return <DashboardLayout title="Live Tracking"><div className="flex justify-center py-20"><Loader size="lg" text="Loading emergency..." /></div></DashboardLayout>;

  if (!emergency && id) return (
    <DashboardLayout title="Live Tracking">
      <div className="text-center py-20">
        <p className="text-ems-muted mb-4">Emergency not found</p>
        <Link to="/emergency" className="btn-emergency">Request New Emergency</Link>
      </div>
    </DashboardLayout>
  );

  const currentStatus = liveStatus || emergency?.status || 'pending';
  const currentStepIdx = statusSteps.indexOf(currentStatus);
  const typeInfo = EMERGENCY_TYPES.find(t => t.value === emergency?.type);

  return (
    <DashboardLayout title="Live Tracking">
      {!id ? (
        <div className="max-w-xl mx-auto text-center py-20 space-y-6">
          <div className="text-6xl">🚑</div>
          <h2 className="text-2xl font-display text-ems-white">NO ACTIVE EMERGENCY</h2>
          <p className="text-ems-muted">You have no active emergency to track right now.</p>
          <Link to="/emergency" className="btn-emergency inline-block py-4 px-8">Request Emergency →</Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header card */}
          <div className="ems-card border-emergency-red/30 bg-emergency-red/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: STATUS_COLORS[currentStatus] }} />
                  <span className="text-xs font-medium uppercase tracking-widest" style={{ color: STATUS_COLORS[currentStatus] }}>
                    {statusLabels[currentStatus] || currentStatus}
                  </span>
                </div>
                <h2 className="text-2xl font-display text-ems-white">{typeInfo?.label || emergency?.type}</h2>
                <p className="text-ems-muted text-sm">{emergency?.emergencyId}</p>
              </div>
              <div className="text-right">
                <div className="text-ems-muted text-xs">Dispatched</div>
                <div className="text-ems-white text-sm">{timeAgo(emergency?.createdAt)}</div>
              </div>
            </div>

            {/* Responder info */}
            {emergency?.emt && (
              <div className="flex items-center gap-4 p-4 bg-ems-dark rounded-xl">
                <div className="w-12 h-12 bg-emergency-red rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {emergency.emt.firstName?.[0]}{emergency.emt.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-ems-white font-semibold">{emergency.emt.firstName} {emergency.emt.lastName}</p>
                  <p className="text-ems-muted text-sm">KMPDC-Certified EMT · {emergency.ambulance?.type || 'Ambulance'}</p>
                </div>
                <a href={`tel:${emergency.emt.phone}`} className="btn-emergency py-2 px-4 flex items-center gap-2 text-sm">
                  <FiPhone size={14} /> Call EMT
                </a>
              </div>
            )}
          </div>

          {/* Progress tracker */}
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-6">Response Progress</h3>
            <div className="space-y-4">
              {statusSteps.filter(s => s !== 'cancelled').map((s, idx) => {
                const done = idx < currentStepIdx;
                const active = idx === currentStepIdx;
                return (
                  <div key={s} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-green-500/20' : active ? 'bg-emergency-red' : 'bg-ems-dark border border-ems-border'}`}>
                      {done
                        ? <FiCheckCircle size={16} className="text-green-400" />
                        : active
                        ? <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        : <div className="w-2 h-2 bg-ems-muted rounded-full" />}
                    </div>
                    <div className={`flex-1 pb-4 border-b border-ems-border last:border-0 ${active ? 'opacity-100' : done ? 'opacity-70' : 'opacity-30'}`}>
                      <p className={`font-medium text-sm ${active ? 'text-emergency-red' : 'text-ems-white'}`}>{statusLabels[s]}</p>
                      {emergency?.timeline?.find(t => t.status === s) && (
                        <p className="text-ems-muted text-xs mt-0.5">
                          {timeAgo(emergency.timeline.find(t => t.status === s).timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="grid sm:grid-cols-2 gap-5">
            {emergency?.patientLocation && (
              <div className="ems-card">
                <h3 className="text-ems-white font-semibold mb-4 flex items-center gap-2"><FiMapPin size={15} className="text-emergency-red" /> Patient Location</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-ems-muted">{emergency.patientLocation.address || 'Address not provided'}</p>
                  {emergency.patientLocation.what3words && (
                    <p className="text-ems-white">📍 {emergency.patientLocation.what3words}</p>
                  )}
                  <p className="text-ems-muted">{emergency.patientLocation.county} County</p>
                </div>
              </div>
            )}

            {emergency?.hospital && (
              <div className="ems-card">
                <h3 className="text-ems-white font-semibold mb-4 flex items-center gap-2"><FiActivity size={15} className="text-emergency-red" /> Destination Hospital</h3>
                <p className="text-ems-white font-medium text-sm">{emergency.hospital.name}</p>
                <p className="text-ems-muted text-sm">{emergency.hospital.address}</p>
                {emergency.hospital.phone && (
                  <a href={`tel:${emergency.hospital.phone}`} className="flex items-center gap-2 text-emergency-red text-sm mt-2 hover:underline">
                    <FiPhone size={13} /> {emergency.hospital.phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Emergency contact */}
          <div className="ems-card border-emergency-red/20 bg-emergency-red/5 text-center">
            <p className="text-ems-muted text-sm mb-2">Need immediate assistance?</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="tel:1514" className="btn-emergency py-3 px-6 text-sm">📞 1514 Toll Free</a>
              <a href="tel:0700395395" className="btn-ghost py-3 px-6 text-sm">📱 0700 395 395</a>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
