import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';
import {
  FiAlertTriangle, FiClock, FiHeart, FiActivity,
  FiArrowRight, FiCheckCircle, FiMapPin, FiPhone
} from 'react-icons/fi';
import { timeAgo } from '../utils/formatTime';
import { STATUS_COLORS } from '../utils/constants';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user } = useAuth();

  // ── ALL hooks must be declared before any conditional return ──
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if the user is actually a patient
    if (!user || user.role === 'admin' || user.role === 'superadmin' || user.role === 'emt') {
      setLoading(false);
      return;
    }
    emergencyService.getMyEmergencies({ limit: 5 })
      .then(({ data }) => setRecentEmergencies(data.emergencies || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // ── Role guards AFTER all hooks ──────────────────────────────
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return <Navigate to="/admin" replace />;
  }
  if (user?.role === 'emt') {
    return <Navigate to="/emt" replace />;
  }

  const membershipActive = user?.membership?.status === 'active';

  return (
    <DashboardLayout title="My Dashboard">

      {/* Welcome */}
      <div className="mb-7">
        <h2 className="text-2xl sm:text-3xl font-display text-ems-white">
          WELCOME BACK,{' '}
          <span className="text-emergency-red">{user?.firstName?.toUpperCase()}</span>
        </h2>
        <p className="text-ems-muted text-sm mt-1">
          {membershipActive
            ? `Your ${user.membership.type} membership is active until ${new Date(user.membership.expiryDate).toLocaleDateString('en-KE')}`
            : 'No active membership. Get covered from KES 4,000 / year.'}
        </p>
      </div>

      {/* Emergency CTA */}
      <div className="ems-card border-emergency-red/30 bg-emergency-red/5 mb-7
                      flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emergency-red rounded-full animate-pulse" />
            <span className="text-emergency-red text-xs font-semibold uppercase tracking-widest">
              Dispatch Active 24 / 7
            </span>
          </div>
          <h3 className="text-ems-white font-bold text-xl mb-1">Need Emergency Help?</h3>
          <p className="text-ems-muted text-sm">
            Tap below · or call <strong className="text-white">0700 395 395</strong>
            {' '}· Toll Free: <strong className="text-white">1514</strong>
            {' '}· USSD: <strong className="text-white">*888#</strong>
          </p>
        </div>
        <Link
          to="/emergency"
          className="btn-emergency flex items-center gap-2 py-4 px-8 flex-shrink-0 text-lg font-bold"
        >
          <FiAlertTriangle size={20} /> SOS Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatsCard
          title="Total Emergencies"
          value={user?.totalEmergencies || 0}
          subtitle="All time"
          icon={FiAlertTriangle}
          color="#FF3B30"
        />
        <StatsCard
          title="Membership"
          value={membershipActive ? 'Active' : 'Inactive'}
          subtitle={user?.membership?.type || 'No plan'}
          icon={FiHeart}
          color={membershipActive ? '#22C55E' : '#6B7280'}
        />
        <StatsCard
          title="Last Response"
          value={recentEmergencies[0] ? timeAgo(recentEmergencies[0].createdAt) : '—'}
          subtitle="Most recent"
          icon={FiClock}
          color="#3B82F6"
        />
        <StatsCard
          title="Avg Response"
          value={(() => {
            const withTime = recentEmergencies.filter(e => e.responseTime);
            if (!withTime.length) return '—';
            return `${Math.round(withTime.reduce((s, e) => s + e.responseTime, 0) / withTime.length)} min`;
          })()}
          subtitle="Minutes on scene"
          icon={FiActivity}
          color="#8B5CF6"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent emergencies */}
        <div className="lg:col-span-2 ems-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-ems-white font-semibold">Recent Emergencies</h3>
            <Link to="/tracking"
              className="text-emergency-red text-xs hover:underline flex items-center gap-1">
              Track active <FiArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="py-10 flex justify-center"><Loader /></div>
          ) : recentEmergencies.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <FiCheckCircle size={40} className="text-ems-muted mx-auto" />
              <p className="text-ems-muted text-sm">No emergencies yet</p>
              <p className="text-ems-muted text-xs">We hope it stays that way 🙏</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentEmergencies.map(em => (
                <div key={em._id}
                  className="flex items-center gap-4 p-3.5 bg-ems-dark rounded-xl hover:bg-ems-black transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-ems-black flex-shrink-0">
                    {em.type === 'cardiac'   ? '💔'
                    : em.type === 'trauma'   ? '🩹'
                    : em.type === 'obstetric'? '🤱'
                    : em.type === 'stroke'   ? '🧠'
                    : '🚑'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-ems-white text-sm font-medium capitalize">{em.type}</span>
                      <span className="status-badge text-xs"
                        style={{ background: `${STATUS_COLORS[em.status]}20`, color: STATUS_COLORS[em.status] }}>
                        {em.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ems-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <FiMapPin size={10} /> {em.patientLocation?.county || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={10} /> {timeAgo(em.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span className="text-ems-muted text-xs font-mono hidden sm:block">
                    {em.emergencyId?.slice(-8)}
                  </span>
                </div>
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
                { to: '/emergency',  icon: '🚨', label: 'Request Emergency', sub: 'Dispatch now' },
                { to: '/membership', icon: '💳', label: membershipActive ? 'Manage Membership' : 'Get Covered', sub: membershipActive ? 'Active plan' : 'From KES 4,000/yr' },
                { to: '/hospitals',  icon: '🏥', label: 'Nearest Hospitals', sub: 'Live availability' },
                { to: '/settings',   icon: '⚙️', label: 'Update Medical Info', sub: 'Blood group, allergies' },
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
                  <FiArrowRight size={14} className="text-ems-muted group-hover:text-emergency-red transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Medical profile */}
          <div className="ems-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-ems-white font-semibold">Medical Profile</h3>
              <Link to="/settings" className="text-emergency-red text-xs hover:underline">Edit</Link>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Blood Group', value: user?.bloodGroup || 'Not set' },
                { label: 'SHA Number',  value: user?.shaNumber  || 'Not linked' },
                { label: 'ID Number',   value: user?.idNumber   || 'Not set' },
                { label: 'Allergies',   value: user?.allergies?.join(', ') || 'None recorded' },
              ].map(({ label, value }) => (
                <div key={label}
                  className="flex justify-between items-start gap-2 py-2 border-b border-ems-border last:border-0">
                  <span className="text-ems-muted text-xs flex-shrink-0">{label}</span>
                  <span className="text-ems-white text-xs font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency contact */}
          <div className="p-4 bg-emergency-red/5 border border-emergency-red/20 rounded-2xl text-center">
            <p className="text-ems-muted text-xs mb-2">Always available</p>
            <a href="tel:1514"
              className="flex items-center justify-center gap-2 text-emergency-red font-bold text-lg hover:underline">
              <FiPhone size={16} /> 1514 — Toll Free
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
