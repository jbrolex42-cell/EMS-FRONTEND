import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StatsCard from "../components/StatsCard";
import Loader from "../components/Loader";
import api from "../services/api";
import { useSocket } from "../hooks/useSocket";
import { joinAdminRoom } from "../services/socketService";
import { timeAgo } from "../utils/formatTime";
import { STATUS_COLORS } from "../utils/constants";

import {
  FiUsers,
  FiAlertTriangle,
  FiTruck,
  FiActivity,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#FF3B30",
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [donationStats, setDonationStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [newAlerts, setNewAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /*
   * =========================================================
   * FETCH DASHBOARD DATA
   * =========================================================
   */

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);

      const [
        statsRes,
        emergenciesRes,
        donationStatsRes,
        donationsRes,
      ] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/emergencies?limit=8"),
        api.get("/admin/donations/stats"),
        api.get("/admin/donations?limit=8"),
      ]);

      /*
       * Emergency statistics
       */
      setStats(statsRes.data || null);

      /*
       * Recent emergencies
       */
      setRecentEmergencies(
        emergenciesRes.data?.emergencies || []
      );

      /*
       * Donation statistics
       */
      setDonationStats(
        donationStatsRes.data?.stats || null
      );

      /*
       * Recent donations
       */
      setRecentDonations(
        donationsRes.data?.donations || []
      );
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    fetchData();
    joinAdminRoom();
  }, [fetchData]);

  /*
   * =========================================================
   * NEW EMERGENCY SOCKET EVENT
   * =========================================================
   */

  useSocket(
    "new_emergency",
    (data) => {
      setNewAlerts((prev) => [
        data,
        ...prev,
      ].slice(0, 5));

      fetchData();
    },
    []
  );

  /*
   * =========================================================
   * DONATION SOCKET EVENT
   * =========================================================
   */

  useSocket(
    "donation_updated",
    (data) => {
      console.log(
        "DONATION UPDATE RECEIVED:",
        data
      );

      /*
       * Update existing donation or add new donation
       */
      setRecentDonations((prev) => {
        const donationId =
          data?.id ||
          data?._id ||
          data?.donationId;

        const exists = prev.some(
          (donation) =>
            String(
              donation.id ||
                donation._id
            ) === String(donationId)
        );

        if (exists) {
          return prev.map((donation) => {
            const currentId =
              donation.id ||
              donation._id;

            if (
              String(currentId) ===
              String(donationId)
            ) {
              return {
                ...donation,
                ...data,
              };
            }

            return donation;
          });
        }

        return [
          {
            ...data,
            id:
              data.id ||
              data._id ||
              data.donationId,
          },
          ...prev,
        ].slice(0, 8);
      });

      /*
       * Refresh dashboard totals
       */
      fetchData();
    },
    []
  );

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }

  /*
   * =========================================================
   * SAFE DATA
   * =========================================================
   */

  const emergencyStats =
    stats?.stats || {};

  const monthlyTrend =
    stats?.monthlyTrend || [];

  const typeBreakdown =
    stats?.typeBreakdown || [];

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <AdminLayout title="Command Center">

      {/* =====================================================
          LIVE EMERGENCY ALERTS
      ===================================================== */}

      {newAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {newAlerts.map((alert, index) => (
            <div
              key={
                alert?._id ||
                alert?.emergencyId ||
                index
              }
              className="flex items-center gap-3 bg-emergency-red/10 border border-emergency-red/30 rounded-xl px-4 py-3"
            >
              <span className="w-2 h-2 bg-emergency-red rounded-full animate-pulse flex-shrink-0" />

              <p className="text-ems-white text-sm">
                🚨 New{" "}
                <strong>
                  {alert?.severity || "emergency"}
                </strong>{" "}
                {alert?.type || ""} emergency in{" "}
                <strong>
                  {alert?.county || "unknown county"}
                </strong>
              </p>

              <span className="text-ems-muted text-xs ml-auto">
                Just now
              </span>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          EMERGENCY STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <StatsCard
          title="Total Users"
          value={
            emergencyStats.totalUsers?.toLocaleString() ||
            0
          }
          subtitle="Active patients"
          icon={FiUsers}
          color="#3B82F6"
        />

        <StatsCard
          title="Today's Emergencies"
          value={
            emergencyStats.todayEmergencies || 0
          }
          subtitle="In last 24h"
          icon={FiAlertTriangle}
          color="#FF3B30"
        />

        <StatsCard
          title="Available Units"
          value={
            emergencyStats.activeAmbulances || 0
          }
          subtitle="Ready for dispatch"
          icon={FiTruck}
          color="#22C55E"
        />

        <StatsCard
          title="Active Members"
          value={
            emergencyStats.activeMembers?.toLocaleString() ||
            0
          }
          subtitle="Subscription holders"
          icon={FiActivity}
          color="#8B5CF6"
        />

        <StatsCard
          title="Critical Active"
          value={
            emergencyStats.criticalActive || 0
          }
          subtitle="Needs attention"
          icon={FiAlertTriangle}
          color="#EF4444"
        />

        <StatsCard
          title="Pending Dispatch"
          value={
            emergencyStats.pendingEmergencies || 0
          }
          subtitle="Awaiting responder"
          icon={FiClock}
          color="#F59E0B"
        />

        <StatsCard
          title="Completed Today"
          value={
            emergencyStats.completedToday || 0
          }
          subtitle="Resolved emergencies"
          icon={FiCheckCircle}
          color="#10B981"
        />

        <StatsCard
          title="Total Emergencies"
          value={
            emergencyStats.totalEmergencies?.toLocaleString() ||
            0
          }
          subtitle="All time"
          icon={FiBarChart2}
          color="#06B6D4"
        />

      </div>

      {/* =====================================================
          DONATION STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <StatsCard
          title="Total Donations"
          value={
            donationStats?.totalDonations?.toLocaleString() ||
            0
          }
          subtitle="All payment records"
          icon={FiDollarSign}
          color="#06B6D4"
        />

        <StatsCard
          title="Completed Payments"
          value={
            donationStats?.completedDonations?.toLocaleString() ||
            0
          }
          subtitle="Successful donations"
          icon={FiCheckCircle}
          color="#22C55E"
        />

        <StatsCard
          title="Total Revenue"
          value={`KSh ${Number(
            donationStats?.totalRevenue || 0
          ).toLocaleString()}`}
          subtitle="Successful payments"
          icon={FiBarChart2}
          color="#8B5CF6"
        />

        <StatsCard
          title="Today's Revenue"
          value={`KSh ${Number(
            donationStats?.todayRevenue || 0
          ).toLocaleString()}`}
          subtitle="Successful today"
          icon={FiActivity}
          color="#F59E0B"
        />

      </div>

      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Emergency Trend */}

        <div className="lg:col-span-2 ems-card">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-ems-white font-semibold">
              Emergency Trend (6 Months)
            </h3>

            <button
              onClick={fetchData}
              disabled={refreshing}
              className="text-ems-muted hover:text-white transition-colors disabled:opacity-50"
              title="Refresh dashboard"
            >
              <FiRefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

          </div>

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <BarChart
              data={monthlyTrend.map((item) => ({
                month:
                  MONTH_LABELS[
                    Number(item?._id?.month) - 1
                  ] ||
                  item?._id?.month ||
                  "",
                count:
                  Number(item?.count) || 0,
              }))}
            >

              <XAxis
                dataKey="month"
                stroke="#666"
                tick={{
                  fill: "#666",
                  fontSize: 11,
                }}
              />

              <YAxis
                stroke="#666"
                tick={{
                  fill: "#666",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border:
                    "1px solid #2a2a2a",
                  borderRadius: "8px",
                  color: "#f5f5f5",
                }}
              />

              <Bar
                dataKey="count"
                fill="#FF3B30"
                radius={[
                  4,
                  4,
                  0,
                  0,
                ]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Emergency Type Breakdown */}

        <div className="ems-card">

          <h3 className="text-ems-white font-semibold mb-6">
            By Emergency Type
          </h3>

          {typeBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer
                width="100%"
                height={160}
              >
                <PieChart>

                  <Pie
                    data={typeBreakdown}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                  >
                    {typeBreakdown.map(
                      (item, index) => (
                        <Cell
                          key={
                            item?._id ||
                            index
                          }
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background:
                        "#1a1a1a",
                      border:
                        "1px solid #2a2a2a",
                      borderRadius:
                        "8px",
                      color:
                        "#f5f5f5",
                    }}
                  />

                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-2">

                {typeBreakdown
                  .slice(0, 5)
                  .map((type, index) => (
                    <div
                      key={
                        type?._id ||
                        index
                      }
                      className="flex items-center justify-between text-xs"
                    >

                      <div className="flex items-center gap-2">

                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background:
                              COLORS[
                                index %
                                  COLORS.length
                              ],
                          }}
                        />

                        <span className="text-ems-muted capitalize">
                          {type?._id ||
                            "Unknown"}
                        </span>

                      </div>

                      <span className="text-ems-white font-medium">
                        {type?.count || 0}
                      </span>

                    </div>
                  ))}

              </div>
            </>
          ) : (
            <p className="text-ems-muted text-sm text-center py-8">
              No data yet
            </p>
          )}

        </div>

      </div>

      {/* =====================================================
          RECENT EMERGENCIES
      ===================================================== */}

      <div className="ems-card mb-6">

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-ems-white font-semibold">
            Recent Emergencies
          </h3>

          <a
            href="/admin/emergencies"
            className="text-emergency-red text-xs hover:underline"
          >
            View all →
          </a>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">

                <th className="text-left pb-3 pr-4">
                  ID
                </th>

                <th className="text-left pb-3 pr-4">
                  Patient
                </th>

                <th className="text-left pb-3 pr-4">
                  Type
                </th>

                <th className="text-left pb-3 pr-4">
                  County
                </th>

                <th className="text-left pb-3 pr-4">
                  Severity
                </th>

                <th className="text-left pb-3 pr-4">
                  Status
                </th>

                <th className="text-left pb-3">
                  Time
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-ems-border">

              {recentEmergencies.map(
                (emergency) => (
                  <tr
                    key={
                      emergency?._id
                    }
                    className="hover:bg-ems-dark transition-colors"
                  >

                    <td className="py-3 pr-4 text-ems-muted font-mono text-xs">
                      {emergency?.emergencyId?.slice(
                        -8
                      ) ||
                        emergency?._id?.slice(
                          -8
                        ) ||
                        "-"}
                    </td>

                    <td className="py-3 pr-4 text-ems-white">
                      {emergency?.patient
                        ?.firstName ||
                        "Unknown"}{" "}
                      {emergency?.patient
                        ?.lastName ||
                        ""}
                    </td>

                    <td className="py-3 pr-4 text-ems-muted capitalize">
                      {emergency?.type ||
                        "-"}
                    </td>

                    <td className="py-3 pr-4 text-ems-muted">
                      {emergency
                        ?.patientLocation
                        ?.county ||
                        "-"}
                    </td>

                    <td className="py-3 pr-4">

                      <span
                        className={`status-badge ${
                          emergency?.severity ===
                          "critical"
                            ? "bg-red-500/20 text-red-400"
                            : emergency?.severity ===
                              "high"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {emergency?.severity ||
                          "unknown"}
                      </span>

                    </td>

                    <td className="py-3 pr-4">

                      <span
                        className="status-badge"
                        style={{
                          background: `${
                            STATUS_COLORS[
                              emergency?.status
                            ] ||
                            "#666"
                          }20`,
                          color:
                            STATUS_COLORS[
                              emergency?.status
                            ] ||
                            "#999",
                        }}
                      >
                        {emergency?.status?.replace(
                          /_/g,
                          " "
                        ) ||
                          "unknown"}
                      </span>

                    </td>

                    <td className="py-3 text-ems-muted text-xs">
                      {emergency?.createdAt
                        ? timeAgo(
                            emergency.createdAt
                          )
                        : "-"}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          {recentEmergencies.length ===
            0 && (
            <p className="text-center text-ems-muted py-10">
              No emergencies yet
            </p>
          )}

        </div>

      </div>

      {/* =====================================================
          RECENT DONATIONS
      ===================================================== */}

      <div className="ems-card">

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-ems-white font-semibold">
            Recent Payments
          </h3>

          <a
            href="/admin/donations"
            className="text-emergency-red text-xs hover:underline"
          >
            View all →
          </a>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">

                <th className="text-left pb-3 pr-4">
                  Donor
                </th>

                <th className="text-left pb-3 pr-4">
                  Amount
                </th>

                <th className="text-left pb-3 pr-4">
                  Method
                </th>

                <th className="text-left pb-3 pr-4">
                  Reference
                </th>

                <th className="text-left pb-3 pr-4">
                  Status
                </th>

                <th className="text-left pb-3">
                  Time
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-ems-border">

              {recentDonations.map(
                (donation) => {

                  const donationId =
                    donation?.id ||
                    donation?._id;

                  return (
                    <tr
                      key={donationId}
                      className="hover:bg-ems-dark transition-colors"
                    >

                      <td className="py-3 pr-4">

                        <div className="text-ems-white font-medium">
                          {donation?.donorName ||
                            "Anonymous"}
                        </div>

                        <div className="text-ems-muted text-xs">
                          {donation?.phone ||
                            ""}
                        </div>

                      </td>

                      <td className="py-3 pr-4 text-ems-white font-semibold">
                        KSh{" "}
                        {Number(
                          donation?.amount ||
                            0
                        ).toLocaleString()}
                      </td>

                      <td className="py-3 pr-4">

                        <span className="text-ems-muted capitalize">
                          {donation
                            ?.paymentMethod ||
                            "-"}
                        </span>

                      </td>

                      <td className="py-3 pr-4">

                        <span className="text-ems-muted font-mono text-xs">
                          {donation?.reference ||
                            donation
                              ?.paymentReference ||
                            donation
                              ?.bankReference ||
                            donation
                              ?.checkoutRequestId ||
                            "-"}
                        </span>

                      </td>

                      <td className="py-3 pr-4">

                        <span
                          className={`status-badge ${
                            donation?.status ===
                            "completed"
                              ? "bg-green-500/20 text-green-400"
                              : donation?.status ===
                                "processing"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : donation?.status ===
                                "failed"
                              ? "bg-red-500/20 text-red-400"
                              : donation?.status ===
                                "cancelled"
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {donation?.status ||
                            "unknown"}
                        </span>

                      </td>

                      <td className="py-3 text-ems-muted text-xs">

                        {donation?.createdAt
                          ? timeAgo(
                              donation.createdAt
                            )
                          : "-"}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

          {recentDonations.length ===
            0 && (
            <p className="text-center text-ems-muted py-10">
              No payments yet
            </p>
          )}

        </div>

      </div>

    </AdminLayout>
  );
}