import { useEffect, useRef, useState, useCallback } from 'react';
import api from '../services/api';

const PING_INTERVAL_MS = 15000; // send location every 15 seconds

/**
 * useGPSTracking
 * Web browser GPS tracking hook for EMTs.
 * Uses navigator.geolocation.watchPosition to get live coordinates
 * and sends them to the backend every PING_INTERVAL_MS milliseconds.
 *
 * Usage:
 *   const { isTracking, startTracking, stopTracking, error, lastPing } = useGPSTracking(ambulanceId);
 */
export function useGPSTracking(ambulanceId) {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError]           = useState(null);
  const [lastPing, setLastPing]     = useState(null);
  const [coords, setCoords]         = useState(null);

  const watchIdRef    = useRef(null);
  const intervalRef   = useRef(null);
  const latestCoords  = useRef(null); // always holds freshest position

  // ── Send coordinates to backend ─────────────────────────────────────────
  const sendLocation = useCallback(async (coordinates, status) => {
    if (!ambulanceId || !coordinates) return;
    try {
      await api.put(`/admin/fleet/${ambulanceId}/location`, {
        coordinates, // [lng, lat]
        status: status || 'available',
      });
      setLastPing(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to send location:', err);
      setError('Failed to send location to server');
    }
  }, [ambulanceId]);

  // ── Start tracking ───────────────────────────────────────────────────────
  const startTracking = useCallback((status = 'available') => {
    if (!ambulanceId) {
      setError('No ambulance ID provided');
      return;
    }
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setError(null);
    setIsTracking(true);

    // Watch position continuously (updates latestCoords ref)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        const coordinates = [longitude, latitude];
        latestCoords.current = coordinates;
        setCoords(coordinates);
      },
      (err) => {
        setError(`GPS error: ${err.message}`);
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    // Send location on interval (not on every GPS event — saves bandwidth)
    intervalRef.current = setInterval(() => {
      if (latestCoords.current) {
        sendLocation(latestCoords.current, status);
      }
    }, PING_INTERVAL_MS);

    // Send immediately on start
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = [position.coords.longitude, position.coords.latitude];
        latestCoords.current = coordinates;
        setCoords(coordinates);
        sendLocation(coordinates, status);
      },
      (err) => setError(`GPS error: ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [ambulanceId, sendLocation]);

  // ── Stop tracking ────────────────────────────────────────────────────────
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Mark ambulance offline when tracking stops
    if (ambulanceId && latestCoords.current) {
      api.put(`/admin/fleet/${ambulanceId}/location`, {
        coordinates: latestCoords.current,
        status: 'offline',
      }).catch(() => {});
    }

    setIsTracking(false);
    latestCoords.current = null;
  }, [ambulanceId]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => stopTracking();
  }, [stopTracking]);

  return { isTracking, startTracking, stopTracking, error, lastPing, coords };
}
