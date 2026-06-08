import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';
import { timeAgo } from '../utils/formatTime';
import { STATUS_COLORS } from '../utils/constants';
import {
  FiAlertTriangle, FiCheckCircle, FiClock, FiActivity,
  FiMapPin, FiPhone, FiArrowRight, FiRefreshCw, FiUser, FiTruck
} from 'react-icons/fi';
import Loader from '../components/Loader';

export default function EMTDashboard() {
  const { user } = useAuth();
  const [assignedCases, setAssignedCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(user?.status || 'available');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => { fetchData(); }, []);

  // Real-time: refresh when a new case is assigned
  useSocket('dispatch_assigned', () => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [casesRes, statsRes] = await Promise.all([
        api.get('/emt/cases?limit=6'),
        api.get('/emt/stats')
      ]);
      setAssignedCases(casesRes.data.cases || []);
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.patch('/emt/status', { status: newStatus });
      setStatus(newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusConfig = {
    available:   { label: 'Available',   color: '#22C55E', bg: 'border-green-500/40 bg-green-500/10'  },
    on_call:     { label: 'On Call',     color: '#F59E0B', bg: 'border-yellow-500/40 bg-yellow-500/10'},
    unavailable: { label: 'Unavailable', color: '#6B7280', bg: 'border-gray-500/40 bg-gray-500/10'   },
  };

  return (
    <DashboardLayout title="EMT Dashboard">

      {/* Welcome + availability toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display text-ems-white">
            ON DUTY,{' '}
            <span className="text-emergency-red">{user?.firstName?.toUpperCase()}</span>
          </h2>
          <p className="text-ems-muted text-sm mt-1">
            EMT · Badge #{user?.badgeNumber || 'N/A'} · {user?.station || 'Unassigned station'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button
              key={key}
              disabled={updatingStatus}
              onClick={() => handleStatusChange(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                status === key ? cfg.bg : 'border-ems-border text-ems-muted hover:border-ems-muted'
              }`}
              style={status === key ? { color: cfg.color } : {}}
            >
              {status === key && (
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
                  style={{ background: cfg.color }} />
              )}
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatsCard title="Active Cases"    value={stats?.activeCases    ?? '—'} subtitle="Assigned to you"  icon={FiAlertTriangle} color="#FF3B30" />
        <StatsCard title="Completed Today" value={stats?.completedToday ?? '—'} subtitle="Resolved cases"   icon={FiCheckCircle}   color="#22C55E" />
        <StatsCard title="Avg Response"    value={stats?.avgResponseTime ? `${stats.avgResponseTime} min` : '—'} subtitle="Time to scene" icon={FiClock} color="#3B82F6" />
        <StatsCard title="Total Handled"   value={stats?.totalHandled   ?? '—'} subtitle="All time"         icon={FiActivity}      color="#8B5CF6" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Assigned cases */}
        <div className="lg:col-span-2 ems-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-ems-white font-semibold">Assigned Cases</h3>
            <button onClick={fetchData} className="text-ems-muted hover:text-white transition-colors">
              <FiRefreshCw size={14} />
            </button>
          </div>

          {loading ? (
            <div className="py-10 flex justify-center"><Loader /></div>
          ) : assignedCases.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <FiCheckCircle size={40} className="text-ems-muted mx-auto" />
              <p className="text-ems-muted text-sm">No active cases</p>
              <p className="text-ems-muted text-xs">You're all clear 👍</p>
            </div>
          ) : (
            <div className="space-y-2">
              {assignedCases.map(em => (
                <Link key={em._id} to={`/emt/dispatch`}
                  className="flex items-center gap-4 p-3.5 bg-ems-dark rounded-xl hover:bg-ems-black transition-colors group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-ems-black flex-shrink-0 ${
                    em.severity === 'critical' ? 'ring-1 ring-red-500/50' : ''
                  }`}>
                    {em.type === 'cardiac' ? '💔' : em.type === 'trauma' ? '🩹'
                     : em.type === 'obstetric' ? '🤱' : em.type === 'stroke' ? '🧠' : '🚑'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-ems-white text-sm font-medium capitalize">{em.type}</span>
                      <span className="status-badge text-xs"
                        style={{ background: `${STATUS_COLORS[em.status]}20`, color: STATUS_COLORS[em.status] }}>
                        {em.status?.replace(/_/g, ' ')}
                      </span>
                      {em.severity === 'critical' && (
                        <span className="status-badge text-xs bg-red-500/20 text-red-400">CRITICAL</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ems-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <FiUser size={10} /> {em.patient?.firstName} {em.patient?.lastName}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMapPin size={10} /> {em.patientLocation?.county || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={10} /> {timeAgo(em.createdAt)}
                      </span>
                    </div>
                  </div>
                  <FiArrowRight size={14}
                    className="text-ems-muted group-hover:text-emergency-red transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Quick actions */}
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { to: '/emt/dispatch', icon: '🚨', label: 'Active Dispatch',    sub: 'View current case'   },
                { to: '/settings',     icon: '⚙️', label: 'Update Profile',     sub: 'Badge, station info' },
              ].map(({ to, icon, label, sub }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-ems-dark transition-colors group">
                  <span className="text-xl w-8 flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-ems-white text-sm font-medium group-hover:text-emergency-red transition-colors truncate">
                      {label}
                    </p>
                    <p className="text-ems-muted text-xs">{sub}</p>
                  </div>
                  <FiArrowRight size={14}
                    className="text-ems-muted group-hover:text-emergency-red transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Unit info */}
          <div className="ems-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-ems-white font-semibold">My Unit</h3>
              <Link to="/settings" className="text-emergency-red text-xs hover:underline">Edit</Link>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Badge #',       value: user?.badgeNumber    || 'Not set'      },
                { label: 'Station',       value: user?.station        || 'Not assigned' },
                { label: 'Ambulance',     value: user?.ambulance  || 'Not assigned' },
                { label: 'Certification', value: user?.certification  || 'Not set'      },
              ].map(({ label, value }) => (
                <div key={label}
                  className="flex justify-between items-start gap-2 py-2 border-b border-ems-border last:border-0">
                  <span className="text-ems-muted text-xs flex-shrink-0">{label}</span>
                  <span className="text-ems-white text-xs font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch hotline */}
          <div className="p-4 bg-emergency-red/5 border border-emergency-red/20 rounded-2xl text-center">
            <p className="text-ems-muted text-xs mb-2">Dispatch Line</p>
            <a href="tel:0700395395"
              className="flex items-center justify-center gap-2 text-emergency-red font-bold text-lg hover:underline">
              <FiPhone size={16} /> 0700 395 395
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
