
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';
import {
  FiAlertTriangle,
  FiClock,
  FiHeart,
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
} from 'react-icons/fi';
import { timeAgo } from '../utils/formatTime';
import { STATUS_COLORS } from '../utils/constants';
import Loader from '../components/Loader';

// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard() {
  const { user } = useAuth();

  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      !user ||
      user.role === 'admin' ||
      user.role === 'superadmin' ||
      user.role === 'emt'
    ) {
      setLoading(false);
      return;
    }

    let active = true;

    emergencyService
      .getMyEmergencies({ limit: 5 })
      .then(({ data }) => {
        if (active) {
          setRecentEmergencies(data.emergencies || []);
        }
      })
      .catch(() => {
        if (active) {
          setRecentEmergencies([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  // ==========================================================
  // ROLE-BASED REDIRECTS
  // ==========================================================

  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === 'emt') {
    return <Navigate to="/emt" replace />;
  }

  // ==========================================================
  // MEMBERSHIP
  // ==========================================================

  const membershipActive =
    user?.membership?.status === 'active';

  // ==========================================================
  // RESPONSE TIME
  // ==========================================================

  const emergenciesWithResponseTime = recentEmergencies.filter(
    (emergency) => emergency.responseTime
  );

  const averageResponseTime = emergenciesWithResponseTime.length
    ? `${Math.round(
        emergenciesWithResponseTime.reduce(
          (total, emergency) => total + emergency.responseTime,
          0
        ) / emergenciesWithResponseTime.length
      )} min`
    : '—';

  // ==========================================================
  // QUICK ACTIONS
  // ==========================================================

  const quickActions = [
    {
      to: '/emergency',
      icon: '🚨',
      label: 'Request Emergency',
      sub: 'Dispatch now',
    },
    {
      to: '/membership',
      icon: '💳',
      label: membershipActive
        ? 'Manage Membership'
        : 'Get Covered',
      sub: membershipActive
        ? 'Active plan'
        : 'From KES 4,000/yr',
    },
    {
      to: '/hospitals',
      icon: '🏥',
      label: 'Nearest Hospitals',
      sub: 'Live availability',
    },
    {
      to: '/settings',
      icon: '⚙️',
      label: 'Update Medical Info',
      sub: 'Blood group, allergies',
    },
  ];

  // ==========================================================
  // MEDICAL PROFILE
  // ==========================================================

  const medicalProfile = [
    {
      label: 'Blood Group',
      value: user?.bloodGroup || 'Not set',
    },
    {
      label: 'SHA Number',
      value: user?.shaNumber || 'Not linked',
    },
    {
      label: 'ID Number',
      value: user?.idNumber || 'Not set',
    },
    {
      label: 'Allergies',
      value: user?.allergies?.join(', ') || 'None recorded',
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <DashboardLayout title="My Dashboard">

      {/* ====================================================
          WELCOME
      ==================================================== */}

      <section className="mb-7">
        <h2 className="
          text-2xl font-display
          text-slate-900
          sm:text-3xl
        ">
          WELCOME BACK,{' '}
          <span className="text-red-600">
            {user?.firstName?.toUpperCase()}
          </span>
        </h2>

        <p className="
          mt-2 text-sm leading-relaxed
          text-slate-600
        ">
          {membershipActive
            ? `Your ${user.membership.type} membership is active until ${new Date(
                user.membership.expiryDate
              ).toLocaleDateString('en-KE')}`
            : 'No active membership. Get covered from KES 4,000 / year.'}
        </p>
      </section>

      {/* ====================================================
          EMERGENCY CTA
      ==================================================== */}

      <section className="
        mb-7 flex flex-col items-start
        justify-between gap-5
        rounded-2xl border border-red-200
        bg-red-50 p-5 shadow-sm
        sm:flex-row sm:items-center
        sm:p-7
      ">
        <div className="min-w-0 flex-1">

          <div className="mb-3 flex items-center gap-2">
            <span className="
              h-2.5 w-2.5 rounded-full
              bg-red-600 animate-pulse
            " />

            <span className="
              text-xs font-bold uppercase
              tracking-widest text-red-700
            ">
              Dispatch Active 24 / 7
            </span>
          </div>

          <h3 className="
            mb-2 text-xl font-bold
            text-slate-900 sm:text-2xl
          ">
            Need Emergency Help?
          </h3>

          <p className="
            text-sm leading-7 text-slate-600
          ">
            Tap below · or call{' '}
            <strong className="font-bold text-slate-900">
              0700 395 395
            </strong>
            {' '}· Toll Free:{' '}
            <strong className="font-bold text-slate-900">
              1514
            </strong>
            {' '}· USSD:{' '}
            <strong className="font-bold text-slate-900">
              *888#
            </strong>
          </p>
        </div>

        <Link
          to="/emergency"
          className="
            inline-flex shrink-0
            items-center justify-center gap-3
            rounded-xl bg-red-600
            px-7 py-4
            text-base font-bold text-white
            shadow-lg shadow-red-600/20
            transition-all duration-200
            hover:-translate-y-0.5
            hover:bg-red-700
            hover:shadow-xl
            focus:outline-none
            focus:ring-2 focus:ring-red-500
            focus:ring-offset-2
          "
        >
          <FiAlertTriangle size={20} />
          SOS Request
        </Link>
      </section>

      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <section className="
        mb-7 grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      ">
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
          color={membershipActive ? '#16A34A' : '#6B7280'}
        />

        <StatsCard
          title="Last Response"
          value={
            recentEmergencies[0]
              ? timeAgo(recentEmergencies[0].createdAt)
              : '—'
          }
          subtitle="Most recent"
          icon={FiClock}
          color="#2563EB"
        />

        <StatsCard
          title="Avg Response"
          value={averageResponseTime}
          subtitle="Minutes on scene"
          icon={FiActivity}
          color="#7C3AED"
        />
      </section>

      {/* ====================================================
          MAIN DASHBOARD GRID
      ==================================================== */}

      <div className="
        grid items-start gap-5
        lg:grid-cols-3
      ">

        {/* ==================================================
            RECENT EMERGENCIES
        ================================================== */}

        <section className="
          min-w-0 rounded-2xl
          border border-slate-200
          bg-white p-5
          shadow-sm sm:p-6
          lg:col-span-2
        ">
          <div className="
            mb-5 flex items-center
            justify-between gap-3
          ">
            <h3 className="
              font-bold text-slate-900
            ">
              Recent Emergencies
            </h3>

            <Link
              to="/tracking"
              className="
                flex shrink-0 items-center gap-1
                text-xs font-semibold text-red-600
                transition-colors hover:text-red-700
              "
            >
              Track active
              <FiArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="
              flex justify-center py-12
            ">
              <Loader />
            </div>
          ) : recentEmergencies.length === 0 ? (
            <div className="
              space-y-3 py-12 text-center
            ">
              <FiCheckCircle
                size={42}
                className="mx-auto text-slate-400"
              />

              <p className="
                text-sm font-semibold
                text-slate-700
              ">
                No emergencies yet
              </p>

              <p className="
                text-xs text-slate-500
              ">
                We hope it stays that way 🙏
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEmergencies.map((emergency) => (
                <div
                  key={emergency._id}
                  className="
                    flex items-center gap-3
                    rounded-xl border border-slate-100
                    bg-slate-50 p-3.5
                    transition-colors
                    hover:border-red-100
                    hover:bg-red-50/40
                    sm:gap-4
                  "
                >
                  <div className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl border border-slate-200
                    bg-white text-xl shadow-sm
                  ">
                    {emergency.type === 'cardiac'
                      ? '💔'
                      : emergency.type === 'trauma'
                        ? '🩹'
                        : emergency.type === 'obstetric'
                          ? '🤱'
                          : emergency.type === 'stroke'
                            ? '🧠'
                            : '🚑'}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="
                      mb-1 flex flex-wrap
                      items-center gap-2
                    ">
                      <span className="
                        text-sm font-bold
                        capitalize text-slate-900
                      ">
                        {emergency.type}
                      </span>

                      <span
                        className="
                          inline-flex items-center
                          rounded-full px-2.5 py-1
                          text-[10px] font-bold
                          capitalize
                        "
                        style={{
                          backgroundColor: `${
                            STATUS_COLORS[emergency.status] || '#64748B'
                          }15`,
                          color:
                            STATUS_COLORS[emergency.status] || '#64748B',
                        }}
                      >
                        {emergency.status?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="
                      flex flex-wrap items-center
                      gap-x-4 gap-y-1
                      text-xs text-slate-500
                    ">
                      <span className="
                        flex items-center gap-1
                      ">
                        <FiMapPin size={11} />
                        {emergency.patientLocation?.county || 'Unknown'}
                      </span>

                      <span className="
                        flex items-center gap-1
                      ">
                        <FiClock size={11} />
                        {timeAgo(emergency.createdAt)}
                      </span>
                    </div>
                  </div>

                  <span className="
                    hidden shrink-0
                    font-mono text-xs
                    text-slate-500
                    sm:block
                  ">
                    {emergency.emergencyId?.slice(-8)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <aside className="min-w-0 space-y-5">

          {/* QUICK ACTIONS */}

          <section className="
            rounded-2xl border border-slate-200
            bg-white p-5 shadow-sm
          ">
            <h3 className="
              mb-4 font-bold text-slate-900
            ">
              Quick Actions
            </h3>

            <div className="space-y-2">
              {quickActions.map(
                ({ to, icon, label, sub }) => (
                  <Link
                    key={to}
                    to={to}
                    className="
                      group flex items-center gap-3
                      rounded-xl border border-transparent
                      p-3 transition-all
                      hover:border-red-100
                      hover:bg-red-50/60
                    "
                  >
                    <span className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-xl bg-slate-100
                      text-xl transition-colors
                      group-hover:bg-red-100
                    ">
                      {icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="
                        truncate text-sm font-semibold
                        text-slate-800
                        transition-colors
                        group-hover:text-red-600
                      ">
                        {label}
                      </p>

                      <p className="
                        mt-0.5 text-xs text-slate-500
                      ">
                        {sub}
                      </p>
                    </div>

                    <FiArrowRight
                      size={15}
                      className="
                        shrink-0 text-slate-400
                        transition-all
                        group-hover:translate-x-1
                        group-hover:text-red-600
                      "
                    />
                  </Link>
                )
              )}
            </div>
          </section>

          {/* MEDICAL PROFILE */}

          <section className="
            rounded-2xl border border-slate-200
            bg-white p-5 shadow-sm
          ">
            <div className="
              mb-4 flex items-center
              justify-between gap-3
            ">
              <h3 className="
                font-bold text-slate-900
              ">
                Medical Profile
              </h3>

              <Link
                to="/settings"
                className="
                  text-xs font-semibold
                  text-red-600 hover:text-red-700
                  hover:underline
                "
              >
                Edit
              </Link>
            </div>

            <div>
              {medicalProfile.map(({ label, value }) => (
                <div
                  key={label}
                  className="
                    flex items-start
                    justify-between gap-3
                    border-b border-slate-100
                    py-3 last:border-0
                  "
                >
                  <span className="
                    shrink-0 text-xs
                    text-slate-500
                  ">
                    {label}
                  </span>

                  <span className="
                    max-w-[65%] break-words
                    text-right text-xs
                    font-semibold text-slate-800
                  ">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* EMERGENCY CONTACT */}

          <section className="
            rounded-2xl border border-red-200
            bg-red-50 p-5 text-center
          ">
            <p className="
              mb-3 text-xs font-medium
              text-slate-600
            ">
              Always available
            </p>

            <a
              href="tel:1514"
              className="
                inline-flex items-center
                justify-center gap-2
                text-lg font-bold text-red-600
                transition-colors hover:text-red-700
                hover:underline
              "
            >
              <FiPhone size={17} />
              1514 — Toll Free
            </a>
          </section>

        </aside>
      </div>
    </DashboardLayout>
  );
}