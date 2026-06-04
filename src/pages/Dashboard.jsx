import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { emergencyService } from '../services/emergencyService';
import {
  FiAlertTriangle, FiClock, FiHeart, FiActivity,
  FiArrowRight, FiCheckCircle, FiMapPin
} from 'react-icons/fi';
import { timeAgo, formatDateTime } from '../utils/formatTime';
import { STATUS_COLORS } from '../utils/constants';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emergencyService.getMyEmergencies({ limit: 5 })
      .then(({ data }) => setRecentEmergencies(data.emergencies))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const membershipActive = user?.membership?.status === 'active';

  return (
    <DashboardLayout title="My Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-display text-ems-white">
          WELCOME BACK, <span className="text-emergency-red">{user?.firstName?.toUpperCase()}</span>
        </h2>
        <p className="text-ems-muted text-sm mt-1">
          {membershipActive
            ? `Your ${user.membership.type} membership is active until ${new Date(user.membership.expiryDate).toLocaleDateString()}`
            : 'No active membership. Get covered from KES 4,000/year.'}
        </p>
      </div>

      {/* Emergency CTA */}
      <div className="ems-card border-emergency-red/30 bg-emergency-red/5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emergency-red rounded-full animate-pulse" />
            <span className="text-emergency-red text-xs font-medium uppercase tracking-widest">Dispatch Active 24/7</span>
          </div>
          <h3 className="text-ems-white font-semibold text-xl mb-1">Need Emergency Help?</h3>
          <p className="text-ems-muted text-sm">Tap below or call 0700 395 395 · Toll Free: 1514 · USSD: *888#</p>
        </div>
        <Link to="/emergency" className="btn-emergency flex items-center gap-2 py-4 px-8 flex-shrink-0 text-lg">
          <FiAlertTriangle size={18} /> SOS Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
          title="Avg. Response"
          value={recentEmergencies.length ? `${recentEmergencies[0]?.responseTime || '—'} min` : '—'}
          subtitle="Last emergency"
          icon={FiActivity}
          color="#8B5CF6"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent emergencies */}
        <div className="lg:col-span-2 ems-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-ems-white font-semibold">Recent Emergencies</h3>
            <Link to="/dashboard/history" className="text-emergency-red text-xs hover:underline flex items-center gap-1">
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="py-10 flex justify-center"><Loader /></div>
          ) : recentEmergencies.length === 0 ? (
            <div className="text-center py-12">
              <FiCheckCircle size={40} className="text-ems-muted mx-auto mb-3" />
              <p className="text-ems-muted text-sm">No emergencies yet</p>
              <p className="text-ems-muted text-xs mt-1">We hope it stays that way 🙏</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEmergencies.map(em => (
                <div key={em._id} className="flex items-center gap-4 p-4 bg-ems-dark rounded-xl hover:bg-ems-black transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-ems-black flex-shrink-0">
                    {em.type === 'cardiac' ? '💔' : em.type === 'trauma' ? '🩹' : em.type === 'obstetric' ? '🤱' : '🚑'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-ems-white text-sm font-medium capitalize">{em.type}</span>
                      <span className="status-badge" style={{ background: `${STATUS_COLORS[em.status]}20`, color: STATUS_COLORS[em.status] }}>
                        {em.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ems-muted">
                      <FiMapPin size={11} /> {em.patientLocation?.county || 'Unknown'} ·
                      <FiClock size={11} /> {timeAgo(em.createdAt)}
                    </div>
                  </div>
                  <div className="text-xs text-ems-muted">{em.emergencyId}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-5">
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/emergency', icon: '🚨', label: 'Request Emergency', sub: 'Dispatch now' },
                { to: '/membership', icon: '💳', label: membershipActive ? 'Manage Membership' : 'Get Covered', sub: membershipActive ? 'Active plan' : 'From KES 4,000/yr' },
                { to: '/hospitals', icon: '🏥', label: 'Nearest Hospitals', sub: 'Live availability' },
                { to: '/settings', icon: '⚙️', label: 'Update Medical Info', sub: 'Blood group, allergies' }
              ].map(({ to, icon, label, sub }) => (
                <Link key={to} to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-ems-dark transition-colors group">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <div className="text-ems-white text-sm font-medium group-hover:text-emergency-red transition-colors">{label}</div>
                    <div className="text-ems-muted text-xs">{sub}</div>
                  </div>
                  <FiArrowRight size={14} className="text-ems-muted ml-auto group-hover:text-emergency-red transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Medical profile card */}
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-4">Medical Profile</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Blood Group', value: user?.bloodGroup || 'Not set' },
                { label: 'SHA Number', value: user?.shaNumber || 'Not linked' },
                { label: 'ID Number', value: user?.idNumber || 'Not set' },
                { label: 'Allergies', value: user?.allergies?.join(', ') || 'None recorded' }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-ems-border last:border-0">
                  <span className="text-ems-muted">{label}</span>
                  <span className="text-ems-white font-medium text-xs">{value}</span>
                </div>
              ))}
            </div>
            <Link to="/settings" className="block mt-4 text-center text-emergency-red text-xs hover:underline">
              Update profile →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
