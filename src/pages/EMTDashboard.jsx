import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { joinEMTRoom } from '../services/socketService';
import api from '../services/api';
import { STATUS_COLORS, EMERGENCY_TYPES } from '../utils/constants';
import { timeAgo } from '../utils/formatTime';
import {
  FiAlertTriangle, FiPhone, FiMapPin, FiCheckCircle,
  FiActivity, FiArrowRight, FiWifi, FiWifiOff, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import StatsCard from '../components/StatsCard';

export default function EMTDashboard() {
  const { user } = useAuth();
  const [activeJob, setActiveJob] = useState(null);
  const [stats, setStats] = useState({ completed: 0, avgResponse: 0, rating: 0 });
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      joinEMTRoom(user._id);
      fetchData();
    }
  }, [user]);

  useSocket('dispatch_assigned', (data) => {
    toast.custom((t) => (
      <div className="bg-emergency-red text-white px-6 py-4 rounded-2xl shadow-2xl">
        <p className="font-bold flex items-center gap-2"><FiAlertTriangle size={16} /> New Dispatch!</p>
        <p className="text-sm opacity-90 mt-1">{data.severity?.toUpperCase()} {data.type} — {data.patientLocation?.county}</p>
      </div>
    ), { duration: 8000 });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/emergency/my?limit=20');
      const active = (data.emergencies || []).find(e => !['completed','cancelled'].includes(e.status));
      setActiveJob(active || null);

      const completed = (data.emergencies || []).filter(e => e.status === 'completed');
      const avgResp = completed.length > 0
        ? Math.round(completed.reduce((sum, e) => sum + (e.responseTime || 0), 0) / completed.length)
        : 0;
      const avgRating = completed.filter(e => e.rating).length > 0
        ? (completed.filter(e => e.rating).reduce((sum, e) => sum + e.rating, 0) / completed.filter(e => e.rating).length).toFixed(1)
        : '—';

      setStats({ completed: completed.length, avgResponse: avgResp, rating: avgRating });
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const advanceStatus = async (id, next) => {
    try {
      await api.put(`/emergency/${id}/status`, { status: next });
      toast.success(`Status: ${next.replace(/_/g,' ')}`);
      fetchData();
    } catch { toast.error('Update failed'); }
  };

  const flow = {
    dispatched:   { next: 'enroute',      label: '🚀 En Route' },
    enroute:      { next: 'on_scene',     label: '📍 On Scene' },
    on_scene:     { next: 'transporting', label: '🏥 Transporting' },
    transporting: { next: 'at_hospital',  label: '✅ At Hospital' },
    at_hospital:  { next: 'completed',    label: '✓ Complete' },
  };

  return (
    <DashboardLayout title="EMT Command">

      {/* Welcome + Status toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display text-ems-white">
            WELCOME, <span className="text-emergency-red">{user?.firstName?.toUpperCase()}</span>
          </h2>
          <p className="text-ems-muted text-sm mt-1">EMT · KMPDC Certified · {user?.address?.county || 'Nairobi'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm flex items-center gap-2 ${online ? 'text-green-400' : 'text-ems-muted'}`}>
            {online ? <FiWifi size={15} /> : <FiWifiOff size={15} />}
            {online ? 'Available' : 'Offline'}
          </span>
          <button
            onClick={() => setOnline(!online)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${online ? 'bg-green-500' : 'bg-ems-border'}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white mx-0.5 transition-transform duration-200 ${online ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatsCard title="Completed" value={stats.completed} subtitle="All time" icon={FiCheckCircle} color="#22C55E" />
        <StatsCard title="Avg Response" value={stats.avgResponse > 0 ? `${stats.avgResponse}m` : '—'} subtitle="Minutes on scene" icon={FiClock} color="#3B82F6" />
        <StatsCard title="Rating" value={stats.rating !== '—' ? `${stats.rating}★` : '—'} subtitle="Patient feedback" icon={FiActivity} color="#F59E0B" />
      </div>

      {/* Active job banner */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader size="lg" text="Loading..." /></div>
      ) : activeJob ? (
        <div className="ems-card border-emergency-red/40 bg-emergency-red/5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-emergency-red rounded-full animate-pulse" />
            <span className="text-emergency-red text-xs font-semibold uppercase tracking-widest">Active Dispatch</span>
          </div>

          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-ems-white font-bold text-xl capitalize">{activeJob.type} Emergency</h3>
              <p className="text-ems-muted text-sm">{activeJob.emergencyId} · {timeAgo(activeJob.createdAt)}</p>
            </div>
            <span className="status-badge" style={{ background: `${STATUS_COLORS[activeJob.status]}20`, color: STATUS_COLORS[activeJob.status] }}>
              {activeJob.status?.replace(/_/g,' ')}
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            {activeJob.patient && (
              <div className="bg-ems-dark/70 rounded-xl p-3">
                <p className="text-ems-muted text-xs mb-2 uppercase tracking-wider">Patient</p>
                <p className="text-ems-white font-semibold text-sm">{activeJob.patient.firstName} {activeJob.patient.lastName}</p>
                <p className="text-emergency-red text-xs font-bold">{activeJob.patient.bloodGroup}</p>
                {activeJob.patient.allergies?.length > 0 && (
                  <p className="text-yellow-400 text-xs mt-1">⚠ {activeJob.patient.allergies[0]}</p>
                )}
              </div>
            )}
            <div className="bg-ems-dark/70 rounded-xl p-3">
              <p className="text-ems-muted text-xs mb-2 uppercase tracking-wider flex items-center gap-1"><FiMapPin size={10}/> Location</p>
              <p className="text-ems-white text-sm font-medium">{activeJob.patientLocation?.county}</p>
              {activeJob.patientLocation?.what3words && (
                <p className="text-blue-400 text-xs mt-1">📍 {activeJob.patientLocation.what3words}</p>
              )}
              {activeJob.patientLocation?.address && (
                <p className="text-ems-muted text-xs mt-0.5 line-clamp-1">{activeJob.patientLocation.address}</p>
              )}
            </div>
            <div className="bg-ems-dark/70 rounded-xl p-3">
              <p className="text-ems-muted text-xs mb-2 uppercase tracking-wider">Severity</p>
              <p className={`font-bold text-lg uppercase ${activeJob.severity === 'critical' ? 'text-emergency-red' : 'text-orange-400'}`}>{activeJob.severity}</p>
              <p className="text-ems-muted text-xs">AI Score: {activeJob.aiTriageScore}/10</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {flow[activeJob.status] && (
              <button onClick={() => advanceStatus(activeJob._id, flow[activeJob.status].next)}
                className="btn-emergency py-3 px-6 flex items-center gap-2 flex-1 justify-center text-base font-bold">
                {flow[activeJob.status].label}
              </button>
            )}
            {activeJob.patient?.phone && (
              <a href={`tel:${activeJob.patient.phone}`} className="btn-ghost py-3 px-5 flex items-center gap-2 text-sm">
                <FiPhone size={15}/> Call Patient
              </a>
            )}
            {activeJob.patientLocation?.coordinates && (
              <a href={`https://maps.google.com/?q=${activeJob.patientLocation.coordinates[1]},${activeJob.patientLocation.coordinates[0]}`}
                target="_blank" rel="noreferrer"
                className="btn-ghost py-3 px-5 flex items-center gap-2 text-sm">
                <FiMapPin size={15}/> Navigate
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="ems-card text-center py-14 mb-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle size={32} className="text-green-400" />
          </div>
          <h3 className="text-ems-white font-semibold mb-2">No Active Assignment</h3>
          <p className="text-ems-muted text-sm">You're available and ready. The next dispatch will appear here automatically.</p>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/emt/dispatch" className="ems-card hover:border-emergency-red/30 transition-all flex items-center justify-between group">
          <div>
            <p className="text-ems-white font-medium">Dispatch Queue</p>
            <p className="text-ems-muted text-xs mt-0.5">View all assigned jobs</p>
          </div>
          <FiArrowRight size={18} className="text-ems-muted group-hover:text-emergency-red transition-colors" />
        </Link>
        <Link to="/hospitals" className="ems-card hover:border-emergency-red/30 transition-all flex items-center justify-between group">
          <div>
            <p className="text-ems-white font-medium">Hospital Network</p>
            <p className="text-ems-muted text-xs mt-0.5">Nearest SHA facilities</p>
          </div>
          <FiArrowRight size={18} className="text-ems-muted group-hover:text-emergency-red transition-colors" />
        </Link>
      </div>
    </DashboardLayout>
  );
}
