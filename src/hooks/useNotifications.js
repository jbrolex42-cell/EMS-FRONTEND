// hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useSocket } from './useSocket';

/**
 * Notification types per role:
 *
 * PATIENT      → emergency_dispatched, ambulance_arrived, emergency_resolved,
 *                membership_expiry, emergency_update
 *
 * EMT          → new_assignment, emergency_cancelled, emt_message
 *
 * ADMIN /      → new_emergency, new_user_registered, emt_status_changed,
 * SUPERADMIN     ambulance_location, system_alert, membership_purchase
 */

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [loading, setLoading]           = useState(false);
  const [panelOpen, setPanelOpen]       = useState(false);

  // ── Fetch from backend ─────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications?limit=30');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      console.error('[Notifications] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Helper: prepend a new real-time notification ───────────────
  const addNotification = useCallback((notif) => {
    setNotifications(prev => [notif, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);
  }, []);

  // ── Socket events – patient ────────────────────────────────────
  useSocket('emergency_dispatched', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'emergency_dispatched',
      title: '🚑 Ambulance Dispatched',
      message: `Unit ${data.ambulanceUnit || ''} is on the way (ETA ~${data.eta || '?'} min)`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('ambulance_arrived', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'ambulance_arrived',
      title: '✅ Ambulance Arrived',
      message: `The responding unit has arrived at your location`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('emergency_resolved', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'emergency_resolved',
      title: '🏁 Emergency Resolved',
      message: `Emergency #${data.emergencyId?.slice(-8) || ''} has been closed`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('emergency_update', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'emergency_update',
      title: '📋 Emergency Update',
      message: data.message || 'Your emergency status has been updated',
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  // ── Socket events – EMT ────────────────────────────────────────
  useSocket('new_assignment', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'new_assignment',
      title: '📍 New Assignment',
      message: `${data.type || 'Emergency'} in ${data.county || 'your area'} — severity: ${data.severity || 'unknown'}`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('emergency_cancelled', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'emergency_cancelled',
      title: '❌ Assignment Cancelled',
      message: `Emergency #${data.emergencyId?.slice(-8) || ''} has been cancelled`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  // ── Socket events – admin / superadmin ────────────────────────
  useSocket('new_emergency', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'new_emergency',
      title: `🚨 New ${data.severity?.toUpperCase() || ''} Emergency`,
      message: `${data.type || 'Emergency'} reported in ${data.county || 'unknown county'} via ${data.source || 'app'}`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('new_user_registered', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'new_user',
      title: '👤 New User Registered',
      message: `${data.firstName || 'A user'} ${data.lastName || ''} joined EMS Kenya`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('emt_status_changed', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'emt_status',
      title: '🟢 EMT Status Update',
      message: `EMT ${data.name || ''} is now ${data.status || 'unknown'}`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('membership_purchase', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'membership',
      title: '💳 New Membership',
      message: `${data.userName || 'A user'} purchased ${data.plan || 'a plan'}`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  useSocket('system_alert', (data) => {
    addNotification({
      _id: Date.now(),
      type: 'system_alert',
      title: '⚠️ System Alert',
      message: data.message || 'A system event occurred',
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [addNotification]);

  // ── Mark all as read ───────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      // Optimistic update still reflected in UI
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  }, []);

  // ── Mark single as read ────────────────────────────────────────
  const markRead = useCallback(async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (_) {}
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // ── Clear all ──────────────────────────────────────────────────
  const clearAll = useCallback(async () => {
    try {
      await api.delete('/notifications/clear');
    } catch (_) {}
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen(prev => {
      // auto-mark read when opening
      if (!prev && unreadCount > 0) markAllRead();
      return !prev;
    });
  }, [unreadCount, markAllRead]);

  return {
    notifications,
    unreadCount,
    loading,
    panelOpen,
    togglePanel,
    setPanelOpen,
    markRead,
    markAllRead,
    clearAll,
    refresh: fetchNotifications,
  };
}
