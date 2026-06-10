import { useEffect, useRef, useState, useCallback } from "react";
import api from "../services/api";

const PING_INTERVAL = 15000; // 15 seconds

export default function useGPSTracking(ambulanceId) {
  const [isTracking, setIsTracking] = useState(false);
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [lastPing, setLastPing] = useState(null);

  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);
  const latestCoordsRef = useRef(null);

  // Send GPS coordinates to backend
  const sendLocation = useCallback(
    async (coordinates, status = "available") => {
      if (!ambulanceId || !coordinates) return;

      try {
        await api.put(`/admin/fleet/${ambulanceId}/location`, {
          coordinates,
          status,
        });

        setLastPing(new Date());
        setError(null);
      } catch (err) {
        console.error("GPS update failed:", err);
        setError("Unable to update ambulance location");
      }
    },
    [ambulanceId]
  );

  // Stop tracking
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      if (ambulanceId && latestCoordsRef.current) {
        await api.put(`/admin/fleet/${ambulanceId}/location`, {
          coordinates: latestCoordsRef.current,
          status: "offline",
        });
      }
    } catch (err) {
      console.error("Failed to set ambulance offline:", err);
    }

    latestCoordsRef.current = null;
    setIsTracking(false);
  }, [ambulanceId]);

  // Start GPS tracking
  const startTracking = useCallback(
    (status = "available") => {
      if (isTracking) return;

      if (!ambulanceId) {
        setError("Ambulance ID is required");
        return;
      }

      if (!("geolocation" in navigator)) {
        setError("GPS is not supported in this browser");
        return;
      }

      setError(null);
      setIsTracking(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const location = [
            coords.longitude,
            coords.latitude,
          ];

          latestCoordsRef.current = location;
          setCoords(location);
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

      // Send current location immediately
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const location = [
            coords.longitude,
            coords.latitude,
          ];

          latestCoordsRef.current = location;
          setCoords(location);
          sendLocation(location, status);
        },
        (err) => {
          setError(`GPS error: ${err.message}`);
        }
      );

      // Send updates every 15 seconds
      intervalRef.current = setInterval(() => {
        if (latestCoordsRef.current) {
          sendLocation(latestCoordsRef.current, status);
        }
      }, PING_INTERVAL);
    },
    [ambulanceId, isTracking, sendLocation, stopTracking]
  );

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    isTracking,
    coords,
    error,
    lastPing,
    startTracking,
    stopTracking,
  };
}