import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { joinAdminRoom } from '../services/socketService';
import { timeAgo } from '../utils/formatTime';
import { STATUS_COLORS } from '../utils/constants';
import {
  FiUsers, FiAlertTriangle, FiTruck, FiActivity,
  FiCheckCircle, FiClock, FiBarChart2, FiRefreshCw
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Loader from '../components/Loader';

const COLORS = ['#FF3B30', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#06B6D4', '#F97316'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAlerts, setNewAlerts] = useState([]);

  useEffect(() => {
    fetchData();
    joinAdminRoom();
  }, []);

  useSocket('new_emergency', (data) => {
    setNewAlerts(prev => [data, ...prev].slice(0, 5));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, emRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/emergencies?limit=8')
      ]);
      setStats(statsRes.data);
      setRecentEmergencies(emRes.data.emergencies);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout title="Admin Dashboard"><div className="flex justify-center py-20"><Loader size="lg" /></div></AdminLayout>;

  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <AdminLayout title="Command Center">
      {/* Live alerts */}
      {newAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {newAlerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 bg-emergency-red/10 border border-emergency-red/30 rounded-xl px-4 py-3">
              <span className="w-2 h-2 bg-emergency-red rounded-full animate-pulse flex-shrink-0" />
              <p className="text-ems-white text-sm">
                🚨 New <strong>{alert.severity}</strong> {alert.type} emergency in <strong>{alert.county}</strong>
              </p>
              <span className="text-ems-muted text-xs ml-auto">Just now</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard title="Total Users" value={stats?.stats.totalUsers?.toLocaleString() || 0} subtitle="Active patients" icon={FiUsers} color="#3B82F6" />
        <StatsCard title="Today's Emergencies" value={stats?.stats.todayEmergencies || 0} subtitle="In last 24h" icon={FiAlertTriangle} color="#FF3B30" />
        <StatsCard title="Available Units" value={stats?.stats.activeAmbulances || 0} subtitle="Ready for dispatch" icon={FiTruck} color="#22C55E" />
        <StatsCard title="Active Members" value={stats?.stats.activeMembers?.toLocaleString() || 0} subtitle="Subscription holders" icon={FiActivity} color="#8B5CF6" />
        <StatsCard title="Critical Active" value={stats?.stats.criticalActive || 0} subtitle="Needs attention" icon={FiAlertTriangle} color="#EF4444" />
        <StatsCard title="Pending Dispatch" value={stats?.stats.pendingEmergencies || 0} subtitle="Awaiting responder" icon={FiClock} color="#F59E0B" />
        <StatsCard title="Completed Today" value={stats?.stats.completedToday || 0} subtitle="Resolved emergencies" icon={FiCheckCircle} color="#10B981" />
        <StatsCard title="Total Emergencies" value={stats?.stats.totalEmergencies?.toLocaleString() || 0} subtitle="All time" icon={FiBarChart2} color="#06B6D4" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly chart */}
        <div className="lg:col-span-2 ems-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-ems-white font-semibold">Emergency Trend (6 Months)</h3>
            <button onClick={fetchData} className="text-ems-muted hover:text-white transition-colors"><FiRefreshCw size={15} /></button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.monthlyTrend?.map(d => ({ month: monthLabels[d._id.month - 1], count: d.count })) || []}>
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#666', fontSize: 11 }} />
              <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#f5f5f5' }} />
              <Bar dataKey="count" fill="#FF3B30" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Type breakdown */}
        <div className="ems-card">
          <h3 className="text-ems-white font-semibold mb-6">By Emergency Type</h3>
          {stats?.typeBreakdown && stats.typeBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={stats.typeBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={60}>
                    {stats.typeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#f5f5f5' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {stats.typeBreakdown.slice(0, 5).map((t, i) => (
                  <div key={t._id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-ems-muted capitalize">{t._id}</span>
                    </div>
                    <span className="text-ems-white font-medium">{t.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-ems-muted text-sm text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Recent emergencies table */}
      <div className="ems-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-ems-white font-semibold">Recent Emergencies</h3>
          <a href="/admin/emergencies" className="text-emergency-red text-xs hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                <th className="text-left pb-3 pr-4">ID</th>
                <th className="text-left pb-3 pr-4">Patient</th>
                <th className="text-left pb-3 pr-4">Type</th>
                <th className="text-left pb-3 pr-4">County</th>
                <th className="text-left pb-3 pr-4">Severity</th>
                <th className="text-left pb-3 pr-4">Status</th>
                <th className="text-left pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ems-border">
              {recentEmergencies.map(em => (
                <tr key={em._id} className="hover:bg-ems-dark transition-colors">
                  <td className="py-3 pr-4 text-ems-muted font-mono text-xs">{em.emergencyId?.slice(-8)}</td>
                  <td className="py-3 pr-4 text-ems-white">{em.patient?.firstName} {em.patient?.lastName}</td>
                  <td className="py-3 pr-4 text-ems-muted capitalize">{em.type}</td>
                  <td className="py-3 pr-4 text-ems-muted">{em.patientLocation?.county}</td>
                  <td className="py-3 pr-4">
                    <span className={`status-badge ${em.severity === 'critical' ? 'bg-red-500/20 text-red-400' : em.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {em.severity}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="status-badge" style={{ background: `${STATUS_COLORS[em.status]}20`, color: STATUS_COLORS[em.status] }}>
                      {em.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-ems-muted text-xs">{timeAgo(em.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentEmergencies.length === 0 && (
            <p className="text-center text-ems-muted py-10">No emergencies yet</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
