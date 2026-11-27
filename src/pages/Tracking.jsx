
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';
import { useSocket } from '../hooks/useSocket';
import { joinEmergencyRoom } from '../services/socketService';
import { STATUS_COLORS, EMERGENCY_TYPES } from '../utils/constants';
import { timeAgo } from '../utils/formatTime';
import {
  FiPhone,
  FiMapPin,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiNavigation,
  FiRefreshCw,
  FiShield,
  FiTruck,
  FiHeart,
  FiCalendar,
  FiHash,
  FiExternalLink,
  FiRadio,
  FiArrowRight,
  FiMap,
  FiUser,
  FiCheck,
  FiCopy,
  FiHospital,
  FiZap,
  FiTimer
} from 'react-icons/fi';
import Loader from '../components/Loader';

// ============================================================
// CONSTANTS
// ============================================================

const statusSteps = [
  'pending',
  'dispatched',
  'enroute',
  'on_scene',
  'transporting',
  'at_hospital',
  'completed'
];

const statusLabels = {
  pending: 'Request Received',
  dispatched: 'Responder Dispatched',
  enroute: 'En Route to You',
  on_scene: 'Responder On Scene',
  transporting: 'Transporting to Hospital',
  at_hospital: 'At Hospital',
  completed: 'Emergency Completed',
  cancelled: 'Emergency Cancelled'
};

const statusDescriptions = {
  pending: 'Your emergency request has been received and is awaiting dispatch.',
  dispatched: 'An emergency response unit has been assigned to your request.',
  enroute: 'Your assigned responder is travelling to your location.',
  on_scene: 'Your responder has arrived and is attending to you.',
  transporting: 'You are being transported to the destination hospital.',
  at_hospital: 'You have arrived at the destination hospital.',
  completed: 'Your emergency response has been successfully completed.',
  cancelled: 'This emergency request has been cancelled.'
};

const ACTIVE_STATUSES = [
  'pending',
  'dispatched',
  'enroute',
  'on_scene',
  'transporting',
  'at_hospital'
];

// ============================================================
// HELPERS
// ============================================================

const formatDate = (date) => {
  if (!date) return 'Not available';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return 'Not available';
  }

  return parsed.toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getElapsedTime = (date) => {
  if (!date) return '—';

  const timestamp = new Date(date).getTime();

  if (!Number.isFinite(timestamp)) return '—';

  const elapsed = Math.max(0, Date.now() - timestamp);
  const seconds = Math.floor(elapsed / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;

  return `${remainingSeconds}s`;
};

const getInitials = (firstName, lastName) => {
  return (
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() ||
    'EM'
  );
};

const getMapUrl = (location) => {
  if (!location) return null;

  const { latitude, longitude, coordinates, address } = location;

  if (
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude))
  ) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  if (
    Array.isArray(coordinates) &&
    coordinates.length >= 2 &&
    coordinates.every((value) => Number.isFinite(Number(value)))
  ) {
    return `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;
  }

  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  return null;
};

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  accent = 'red'
}) {
  const accents = {
    red: 'text-emergency-red bg-emergency-red/10',
    green: 'text-green-400 bg-green-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    amber: 'text-amber-400 bg-amber-500/10'
  };

  return (
    <div className="ems-card min-w-0 hover:border-emergency-red/30 transition-all duration-300">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accents[accent]}`}>
          <Icon size={19} />
        </div>

        <span className="text-xs text-ems-muted font-medium">
          {label}
        </span>
      </div>

      <p className="text-2xl font-display text-ems-white font-bold truncate">
        {value}
      </p>

      <p className="text-xs text-ems-muted mt-1">
        {description}
      </p>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-emergency-red/10 text-emergency-red flex items-center justify-center">
        <Icon size={17} />
      </div>

      <div>
        <h3 className="text-ems-white font-semibold">{title}</h3>

        {subtitle && (
          <p className="text-xs text-ems-muted mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADMIN EMERGENCY LIST
// ============================================================

function AdminEmergencyList({
  emergencies,
  refreshing,
  onRefresh
}) {
  const activeCount = emergencies.filter((item) =>
    ACTIVE_STATUSES.includes(item.status)
  ).length;

  const completedCount = emergencies.filter(
    (item) => item.status === 'completed'
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emergency-red animate-pulse" />

            <span className="text-xs font-bold tracking-widest uppercase text-emergency-red">
              Emergency Command Centre
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display text-ems-white">
            Emergency Tracking
          </h1>

          <p className="text-sm text-ems-muted mt-2">
            Select an emergency to view its tracking information.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="btn-ghost flex items-center justify-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
        >
          <FiRefreshCw
            size={14}
            className={refreshing ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={FiActivity}
          label="Total Loaded"
          value={emergencies.length}
          description="Records returned by the server"
          accent="blue"
        />

        <StatCard
          icon={FiTruck}
          label="Active"
          value={activeCount}
          description="Currently active emergencies"
          accent="amber"
        />

        <StatCard
          icon={FiCheckCircle}
          label="Completed"
          value={completedCount}
          description="Completed emergencies"
          accent="green"
        />
      </div>

      <div className="ems-card">
        <SectionHeading
          icon={FiRadio}
          title="Emergency Records"
          subtitle="Select a record to open its tracking details"
        />

        {emergencies.length > 0 ? (
          <div className="space-y-3">
            {emergencies.map((item) => {
              const itemType = EMERGENCY_TYPES.find(
                (type) => type.value === item.type
              );

              const statusColor =
                STATUS_COLORS[item.status] || '#ef4444';

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-ems-dark border border-ems-border hover:border-emergency-red/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-ems-white">
                        {item.emergencyId || item._id}
                      </span>

                      <span
                        className="px-2 py-1 rounded-md text-[10px] font-bold uppercase"
                        style={{
                          color: statusColor,
                          backgroundColor: `${statusColor}15`
                        }}
                      >
                        {statusLabels[item.status] || item.status}
                      </span>
                    </div>

                    <p className="text-sm text-ems-muted mt-2">
                      {itemType?.label || item.type || 'Emergency'}
                    </p>

                    <p className="text-xs text-ems-muted mt-1">
                      {item.patientLocation?.address || 'Location unavailable'}
                    </p>

                    <p className="text-xs text-ems-muted mt-1">
                      Reported: {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <Link
                    to={`/tracking/${item._id}`}
                    className="btn-emergency inline-flex items-center justify-center gap-2 px-4 py-3 text-sm flex-shrink-0"
                  >
                    Track Emergency
                    <FiArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiTruck
              size={36}
              className="mx-auto text-ems-muted mb-4"
            />

            <h3 className="text-ems-white font-semibold">
              No emergencies found
            </h3>

            <p className="text-sm text-ems-muted mt-2">
              No emergency records were returned by the server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN TRACKING COMPONENT
// ============================================================

export default function Tracking() {
  const { id } = useParams();
  const { user } = useAuth();

  const isAdmin = ['admin', 'superadmin'].includes(user?.role);

  const [emergency, setEmergency] = useState(null);
  const [adminEmergencies, setAdminEmergencies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [liveStatus, setLiveStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('—');
  const [copied, setCopied] = useState(false);

  // ==========================================================
  // LOAD EMERGENCIES
  // ==========================================================

  const loadEmergency = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setRefreshing(true);
    }

    try {
      if (isAdmin && !id) {
        // Admin: retrieve emergency records
        const { data } =
          await emergencyService.getAllAdminEmergencies({
            limit: 50,
            page: 1
          });

        setAdminEmergencies(data.emergencies || []);
        setEmergency(null);
        setLiveStatus(null);
      } else if (isAdmin && id) {
        // Admin: retrieve one emergency
        const { data } =
          await emergencyService.getAdminEmergency(id);

        const result = data.emergency;

        setEmergency(result || null);
        setLiveStatus(result?.status || null);

        if (result?._id) {
          joinEmergencyRoom(result._id);
        }
      } else if (id) {
        // Patient: retrieve one emergency
        const { data } =
          await emergencyService.getById(id);

        const result = data.emergency;

        setEmergency(result || null);
        setLiveStatus(result?.status || null);

        if (result?._id) {
          joinEmergencyRoom(result._id);
        }
      } else {
        // Patient: retrieve their own emergencies
        const { data } =
          await emergencyService.getMyEmergencies({
            limit: 5
          });

        const emergencies = data.emergencies || [];

        const active = emergencies.find((item) =>
          ACTIVE_STATUSES.includes(item.status)
        );

        const latest = active || emergencies[0] || null;

        setEmergency(latest);
        setLiveStatus(latest?.status || null);

        if (latest?._id) {
          joinEmergencyRoom(latest._id);
        }
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        'Failed to load emergency:',
        error.response?.data || error.message
      );

      setEmergency(null);
      setAdminEmergencies([]);
      setLiveStatus(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, isAdmin]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        if (isAdmin && !id) {
          const { data } =
            await emergencyService.getAllAdminEmergencies({
              limit: 50,
              page: 1
            });

          if (!mounted) return;

          setAdminEmergencies(data.emergencies || []);
          setEmergency(null);
          setLiveStatus(null);
        } else if (isAdmin && id) {
          const { data } =
            await emergencyService.getAdminEmergency(id);

          if (!mounted) return;

          const result = data.emergency;

          setEmergency(result || null);
          setLiveStatus(result?.status || null);

          if (result?._id) {
            joinEmergencyRoom(result._id);
          }
        } else if (id) {
          const { data } =
            await emergencyService.getById(id);

          if (!mounted) return;

          const result = data.emergency;

          setEmergency(result || null);
          setLiveStatus(result?.status || null);

          if (result?._id) {
            joinEmergencyRoom(result._id);
          }
        } else {
          const { data } =
            await emergencyService.getMyEmergencies({
              limit: 5
            });

          if (!mounted) return;

          const emergencies = data.emergencies || [];

          const active = emergencies.find((item) =>
            ACTIVE_STATUSES.includes(item.status)
          );

          const latest = active || emergencies[0] || null;

          setEmergency(latest);
          setLiveStatus(latest?.status || null);

          if (latest?._id) {
            joinEmergencyRoom(latest._id);
          }
        }

        if (mounted) {
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error(
          'Failed to load emergency:',
          error.response?.data || error.message
        );

        if (mounted) {
          setEmergency(null);
          setAdminEmergencies([]);
          setLiveStatus(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id, isAdmin]);

  // ==========================================================
  // REAL-TIME STATUS UPDATES
  // ==========================================================

  useSocket(
    'status_update',
    (data) => {
      if (!data?.status) return;

      setEmergency((previous) => {
        if (!previous) return previous;

        if (
          data.emergencyId &&
          data.emergencyId !== previous.emergencyId &&
          data.emergencyId !== previous._id
        ) {
          return previous;
        }

        setLiveStatus(data.status);
        setLastUpdated(new Date());

        return {
          ...previous,
          status: data.status,
          timeline: [
            ...(previous.timeline || []).filter(
              (item) => item.status !== data.status
            ),
            {
              status: data.status,
              timestamp: new Date()
            }
          ]
        };
      });
    },
    []
  );

  // ==========================================================
  // ELAPSED TIME
  // ==========================================================

  useEffect(() => {
    const updateElapsed = () => {
      if (emergency?.createdAt) {
        setElapsedTime(getElapsedTime(emergency.createdAt));
      }
    };

    updateElapsed();

    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [emergency?.createdAt]);

  // ==========================================================
  // COPY REFERENCE
  // ==========================================================

  const handleCopyReference = async () => {
    const reference = emergency?.emergencyId || emergency?._id;

    if (!reference) return;

    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Unable to copy emergency reference.');
    }
  };

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const currentStatus =
    liveStatus || emergency?.status || 'pending';

  const currentStepIdx = statusSteps.indexOf(currentStatus);

  const typeInfo = EMERGENCY_TYPES.find(
    (type) => type.value === emergency?.type
  );

  const isActive = ACTIVE_STATUSES.includes(currentStatus);
  const isCompleted = currentStatus === 'completed';
  const isCancelled = currentStatus === 'cancelled';

  const progress = isCompleted
    ? 100
    : isCancelled
      ? 0
      : currentStepIdx >= 0
        ? Math.round(
            ((currentStepIdx + 1) / statusSteps.length) * 100
          )
        : 0;

  const patientMapUrl = getMapUrl(emergency?.patientLocation);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <DashboardLayout title="Live Tracking">
        <div className="flex justify-center py-24">
          <Loader
            size="lg"
            text="Connecting to emergency services..."
          />
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================================
  // ADMIN: ALL EMERGENCIES
  // ==========================================================

  if (isAdmin && !id) {
    return (
      <DashboardLayout title="Live Tracking">
        <AdminEmergencyList
          emergencies={adminEmergencies}
          refreshing={refreshing}
          onRefresh={() => loadEmergency(true)}
        />
      </DashboardLayout>
    );
  }

  // ==========================================================
  // NO EMERGENCY FOUND
  // ==========================================================

  if (!emergency) {
    return (
      <DashboardLayout title="Live Tracking">
        <div className="max-w-xl mx-auto py-24 text-center space-y-6">
          <div className="w-24 h-24 rounded-3xl bg-emergency-red/10 flex items-center justify-center mx-auto">
            <FiTruck size={44} className="text-emergency-red" />
          </div>

          <div>
            <h2 className="text-2xl font-display text-ems-white">
              NO EMERGENCY TO TRACK
            </h2>

            <p className="text-ems-muted mt-3 text-sm leading-relaxed">
              {isAdmin
                ? 'The requested emergency could not be found or loaded.'
                : 'You currently have no active or recent emergency requests. When you request assistance, your response information will appear here.'}
            </p>
          </div>

          {isAdmin ? (
            <Link
              to="/tracking"
              className="btn-ghost inline-flex items-center gap-3 py-4 px-8"
            >
              Back to Emergencies
              <FiArrowRight />
            </Link>
          ) : (
            <Link
              to="/emergency"
              className="btn-emergency inline-flex items-center gap-3 py-4 px-8"
            >
              Request Emergency
              <FiArrowRight />
            </Link>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================================
  // SINGLE EMERGENCY TRACKING VIEW
  // ==========================================================

  return (
    <DashboardLayout title="Live Tracking">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">

        {/* TOP BAR */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emergency-red animate-pulse" />

              <span className="text-xs font-bold tracking-widest uppercase text-emergency-red">
                Emergency Command Centre
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display text-ems-white">
              Live Emergency Tracking
            </h1>

            <p className="text-ems-muted text-sm mt-1">
              {isAdmin
                ? 'Monitor emergency response information.'
                : 'Monitor your emergency response in real time.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isAdmin && (
              <Link
                to="/tracking"
                className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm"
              >
                <FiArrowRight className="rotate-180" size={14} />
                All Emergencies
              </Link>
            )}

            <div className="flex items-center gap-2 bg-ems-dark border border-ems-border rounded-xl px-3 py-2">
              <FiRadio className="text-green-400" size={15} />

              <span className="text-xs text-ems-muted">
                Status monitoring
              </span>
            </div>

            <button
              onClick={() => loadEmergency(true)}
              disabled={refreshing}
              className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
            >
              <FiRefreshCw
                size={14}
                className={refreshing ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* STATUS BANNER */}

        <div className="ems-card relative overflow-hidden border-emergency-red/30 bg-gradient-to-br from-emergency-red/10 via-transparent to-transparent">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emergency-red/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emergency-red/15 flex items-center justify-center flex-shrink-0">
                {isCompleted ? (
                  <FiCheckCircle size={27} className="text-green-400" />
                ) : isCancelled ? (
                  <FiAlertCircle size={27} className="text-amber-400" />
                ) : (
                  <FiActivity size={27} className="text-emergency-red animate-pulse" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[currentStatus] || '#ef4444'
                    }}
                  />

                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color:
                        STATUS_COLORS[currentStatus] || '#ef4444'
                    }}
                  >
                    {statusLabels[currentStatus] || currentStatus}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-display text-ems-white">
                  {typeInfo?.label || emergency.type}
                </h2>

                <p className="text-sm text-ems-muted mt-2 max-w-xl">
                  {statusDescriptions[currentStatus] ||
                    'Your emergency response status is being updated.'}
                </p>
              </div>
            </div>

            <div className="lg:text-right">
              <p className="text-xs text-ems-muted mb-2">
                Emergency Reference
              </p>

              <button
                onClick={handleCopyReference}
                className="inline-flex items-center gap-2 text-ems-white font-mono font-semibold text-lg hover:text-emergency-red transition-colors"
                title="Copy emergency reference"
              >
                {emergency.emergencyId || emergency._id}

                {copied ? (
                  <FiCheck size={15} className="text-green-400" />
                ) : (
                  <FiCopy size={15} />
                )}
              </button>

              <p className="text-xs text-ems-muted mt-2">
                {copied ? 'Reference copied' : 'Click to copy reference'}
              </p>
            </div>
          </div>
        </div>

        {/* STATISTICS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={FiTimer}
            label="Elapsed Time"
            value={elapsedTime}
            description="Since emergency was reported"
            accent="red"
          />

          <StatCard
            icon={FiActivity}
            label="Response Progress"
            value={`${progress}%`}
            description="Emergency response journey"
            accent="green"
          />

          <StatCard
            icon={FiCalendar}
            label="Reported"
            value={formatDate(emergency.createdAt).split(',')[0]}
            description={formatDate(emergency.createdAt)}
            accent="blue"
          />

          <StatCard
            icon={FiShield}
            label="Response Status"
            value={isActive ? 'Active' : isCompleted ? 'Resolved' : 'Closed'}
            description="Current emergency classification"
            accent={isActive ? 'amber' : 'green'}
          />
        </div>

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}

          <div className="lg:col-span-2 space-y-6">

            {/* RESPONSE JOURNEY */}

            <div className="ems-card">
              <SectionHeading
                icon={FiActivity}
                title="Response Journey"
                subtitle="Track each stage of the emergency response"
              />

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ems-muted">
                  Overall progress
                </span>

                <span className="text-sm font-bold text-emergency-red">
                  {progress}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-ems-dark overflow-hidden mb-8">
                <div
                  className="h-full rounded-full bg-emergency-red transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-0">
                {statusSteps.map((step, index) => {
                  const timelineEntry = emergency.timeline?.find(
                    (item) => item.status === step
                  );

                  const done =
                    isCompleted ||
                    (currentStepIdx >= 0 && index < currentStepIdx);

                  const active =
                    !isCompleted &&
                    !isCancelled &&
                    index === currentStepIdx;

                  const upcoming = !done && !active;

                  return (
                    <div key={step} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center z-10 flex-shrink-0 transition-all ${
                            done
                              ? 'bg-green-500/15 text-green-400'
                              : active
                                ? 'bg-emergency-red text-white shadow-lg shadow-emergency-red/20'
                                : 'bg-ems-dark border border-ems-border text-ems-muted'
                          }`}
                        >
                          {done ? (
                            <FiCheck size={17} />
                          ) : active ? (
                            <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
                          ) : (
                            <span className="text-xs font-semibold">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {index !== statusSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              done ? 'bg-green-500/40' : 'bg-ems-border'
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p
                            className={`text-sm font-semibold ${
                              active
                                ? 'text-emergency-red'
                                : done
                                  ? 'text-green-400'
                                  : 'text-ems-white'
                            }`}
                          >
                            {statusLabels[step]}
                          </p>

                          {active && (
                            <span className="text-[10px] uppercase tracking-widest text-emergency-red font-bold">
                              Current Stage
                            </span>
                          )}

                          {done && timelineEntry && (
                            <span className="text-xs text-ems-muted">
                              {timeAgo(timelineEntry.timestamp)}
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs mt-1 ${
                            upcoming ? 'text-ems-muted/50' : 'text-ems-muted'
                          }`}
                        >
                          {statusDescriptions[step]}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isCancelled && (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-2 text-amber-400">
                      <FiAlertCircle />
                      <span className="text-sm font-semibold">
                        Emergency Cancelled
                      </span>
                    </div>

                    <p className="text-xs text-ems-muted mt-2">
                      This request is no longer active.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* PATIENT LOCATION */}

            {emergency.patientLocation && (
              <div className="ems-card">
                <SectionHeading
                  icon={FiMapPin}
                  title="Patient Location"
                  subtitle="Reported emergency location"
                />

                <div className="p-4 rounded-xl bg-ems-dark border border-ems-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emergency-red/10 flex items-center justify-center text-emergency-red flex-shrink-0">
                      <FiMapPin size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ems-white">
                        {emergency.patientLocation.address ||
                          'Address not provided'}
                      </p>

                      {emergency.patientLocation.county && (
                        <p className="text-xs text-ems-muted mt-1">
                          {emergency.patientLocation.county} County
                        </p>
                      )}

                      {emergency.patientLocation.what3words && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-ems-card rounded-lg px-3 py-2">
                          <FiNavigation
                            size={13}
                            className="text-emergency-red"
                          />

                          <span className="text-xs text-ems-white font-mono">
                            {emergency.patientLocation.what3words}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {patientMapUrl && (
                    <a
                      href={patientMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emergency-red/10 text-emergency-red hover:bg-emergency-red hover:text-white transition-all text-sm font-semibold"
                    >
                      <FiMap size={16} />
                      Open Patient Location in Google Maps
                      <FiExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* HOSPITAL */}

            {emergency.hospital && (
              <div className="ems-card">
                <SectionHeading
                  icon={FiHospital}
                  title="Destination Hospital"
                  subtitle="Medical facility assigned to this emergency"
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <FiHeart size={25} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-ems-white font-semibold">
                      {emergency.hospital.name}
                    </h4>

                    <p className="text-sm text-ems-muted mt-1">
                      {emergency.hospital.address || 'Address not available'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {emergency.hospital.phone && (
                      <a
                        href={`tel:${emergency.hospital.phone}`}
                        className="btn-ghost flex items-center gap-2 py-2 px-4 text-sm"
                      >
                        <FiPhone size={14} />
                        Call
                      </a>
                    )}

                    {emergency.hospital.address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(emergency.hospital.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost flex items-center gap-2 py-2 px-4 text-sm"
                      >
                        <FiNavigation size={14} />
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVITY FEED */}

            <div className="ems-card">
              <SectionHeading
                icon={FiClock}
                title="Emergency Activity"
                subtitle="Recorded emergency status changes"
              />

              {emergency.timeline?.length > 0 ? (
                <div className="space-y-4">
                  {[...emergency.timeline]
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp) - new Date(a.timestamp)
                    )
                    .map((item, index) => (
                      <div
                        key={`${item.status}-${item.timestamp}-${index}`}
                        className="flex gap-3 items-start"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                          <FiCheckCircle size={16} />
                        </div>

                        <div className="flex-1 border-b border-ems-border pb-4 last:border-0">
                          <p className="text-sm font-medium text-ems-white">
                            {statusLabels[item.status] || item.status}
                          </p>

                          <p className="text-xs text-ems-muted mt-1">
                            {formatDate(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiClock
                    size={25}
                    className="mx-auto text-ems-muted mb-3"
                  />

                  <p className="text-sm text-ems-muted">
                    No additional activity recorded yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-6">

            {/* ASSIGNED RESPONDER */}

            <div className="ems-card">
              <SectionHeading
                icon={FiUser}
                title="Assigned Responder"
                subtitle="Emergency response personnel"
              />

              {emergency.emt ? (
                <div>
                  <div className="text-center pb-5 border-b border-ems-border">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emergency-red to-red-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emergency-red/20">
                      {getInitials(
                        emergency.emt.firstName,
                        emergency.emt.lastName
                      )}
                    </div>

                    <h4 className="text-lg font-semibold text-ems-white mt-4">
                      {emergency.emt.firstName}{' '}
                      {emergency.emt.lastName}
                    </h4>

                    <p className="text-xs text-green-400 mt-1">
                      <FiShield className="inline mr-1" />
                      Assigned Emergency Responder
                    </p>
                  </div>

                  <div className="space-y-4 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-ems-muted">
                        Qualification
                      </span>

                      <span className="text-xs text-ems-white font-medium text-right">
                        KMPDC-Certified EMT
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-ems-muted">
                        Ambulance
                      </span>

                      <span className="text-xs text-ems-white font-medium">
                        {emergency.ambulance?.type || 'Not specified'}
                      </span>
                    </div>

                    {emergency.emt.phone && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-ems-muted">
                          Contact
                        </span>

                        <span className="text-xs text-ems-white font-medium">
                          {emergency.emt.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {emergency.emt.phone && (
                    <a
                      href={`tel:${emergency.emt.phone}`}
                      className="btn-emergency w-full flex items-center justify-center gap-2 py-3"
                    >
                      <FiPhone size={16} />
                      Call Emergency Responder
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4">
                    <FiTruck size={28} />
                  </div>

                  <h4 className="text-sm font-semibold text-ems-white">
                    Locating Available Unit
                  </h4>

                  <p className="text-xs text-ems-muted leading-relaxed mt-2">
                    Dispatch is identifying the nearest available emergency
                    response team. Please remain reachable.
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-4 text-amber-400 text-xs">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    Awaiting assignment
                  </div>
                </div>
              )}
            </div>

            {/* EMERGENCY DETAILS */}

            <div className="ems-card">
              <SectionHeading
                icon={FiHash}
                title="Emergency Details"
                subtitle="Request information"
              />

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-ems-muted mb-1">
                    Reference Number
                  </p>

                  <p className="text-sm text-ems-white font-mono break-all">
                    {emergency.emergencyId || emergency._id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-ems-muted mb-1">
                    Emergency Type
                  </p>

                  <p className="text-sm text-ems-white">
                    {typeInfo?.label || emergency.type}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-ems-muted mb-1">
                    Date Reported
                  </p>

                  <p className="text-sm text-ems-white">
                    {formatDate(emergency.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-ems-muted mb-1">
                    Last Updated
                  </p>

                  <p className="text-sm text-ems-white">
                    {lastUpdated.toLocaleTimeString('en-KE')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-ems-muted mb-1">
                    Current Status
                  </p>

                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: `${
                        STATUS_COLORS[currentStatus] || '#ef4444'
                      }15`,
                      color:
                        STATUS_COLORS[currentStatus] || '#ef4444'
                    }}
                  >
                    {statusLabels[currentStatus] || currentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* EMERGENCY CONTACTS */}

            <div className="ems-card border-emergency-red/30 bg-emergency-red/5">
              <SectionHeading
                icon={FiZap}
                title="Emergency Assistance"
                subtitle="Get immediate help"
              />

              <p className="text-xs text-ems-muted leading-relaxed mb-5">
                If you need immediate assistance, contact the emergency
                response team directly.
              </p>

              <div className="space-y-3">
                <a
                  href="tel:1514"
                  className="btn-emergency w-full flex items-center justify-center gap-2 py-3"
                >
                  <FiPhone size={16} />
                  1514 Toll Free
                </a>

                <a
                  href="tel:0700395395"
                  className="btn-ghost w-full flex items-center justify-center gap-2 py-3"
                >
                  <FiPhone size={16} />
                  0700 395 395
                </a>
              </div>

              <div className="mt-5 pt-4 border-t border-emergency-red/20">
                <p className="text-[11px] text-ems-muted text-center">
                  Keep your emergency reference available when calling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-ems-border bg-ems-dark/50">
          <div className="flex items-center gap-2 text-xs text-ems-muted">
            <FiShield className="text-green-400" size={15} />
            Emergency tracking information
          </div>

          <div className="flex items-center gap-2 text-xs text-ems-muted">
            <FiClock size={14} />
            Last synchronized: {lastUpdated.toLocaleTimeString('en-KE')}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}