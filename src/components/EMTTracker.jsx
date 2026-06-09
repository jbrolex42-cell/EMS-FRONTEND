import { useState, useEffect } from 'react';
import { useGPSTracking } from '../hooks/useGPSTracking';
import { FiMapPin, FiWifi, FiWifiOff, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';

/**
 * EMTTracker
 * Drop this component into your EMT dashboard.
 * It lets the EMT select their assigned ambulance and toggle GPS tracking on/off.
 *
 * Props:
 *   user — the logged-in EMT user object (needs user._id)
 */
export default function EMTTracker({ user }) {
  const [ambulances, setAmbulances]         = useState([]);
  const [selectedAmbulance, setSelected]    = useState('');
  const [shiftStatus, setShiftStatus]       = useState('available');
  const [loadingAmb, setLoadingAmb]         = useState(true);

  const { isTracking, startTracking, stopTracking, error, lastPing, coords } =
    useGPSTracking(selectedAmbulance);

  // Load ambulances assigned to this EMT
  useEffect(() => {
    const fetchMyAmbulances = async () => {
      try {
        const res = await api.get('/admin/fleet');
        const mine = (res.data.ambulances || []).filter(
          a => a.emt?._id === user?._id || a.driver?._id === user?._id
        );
        setAmbulances(mine);
        if (mine.length === 1) setSelected(mine[0]._id); // auto-select if only one
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAmb(false);
      }
    };
    if (user?._id) fetchMyAmbulances();
  }, [user]);

  const handleToggle = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking(shiftStatus);
    }
  };

  const selectedAmb = ambulances.find(a => a._id === selectedAmbulance);

  return (
    <div className="ems-card border border-ems-border">
      <div className="flex items-center gap-2 mb-4">
        <FiMapPin size={16} className="text-emergency-red" />
        <h3 className="text-ems-white font-semibold">GPS Tracking</h3>
        {isTracking && (
          <span className="ml-auto flex items-center gap-1.5 text-green-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Ambulance selector */}
      {!isTracking && (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-ems-muted text-xs mb-1">Your Ambulance</label>
            {loadingAmb ? (
              <p className="text-ems-muted text-sm">Loading...</p>
            ) : ambulances.length === 0 ? (
              <p className="text-ems-muted text-sm">No ambulances assigned to you. Contact admin.</p>
            ) : (
              <select
                className="ems-input w-full"
                value={selectedAmbulance}
                onChange={e => setSelected(e.target.value)}
              >
                <option value="">Select ambulance...</option>
                {ambulances.map(a => (
                  <option key={a._id} value={a._id}>
                    {a.registrationNumber} — {a.type} ({a.county})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-ems-muted text-xs mb-1">Shift Status</label>
            <select
              className="ems-input w-full"
              value={shiftStatus}
              onChange={e => setShiftStatus(e.target.value)}
            >
              <option value="available">Available</option>
              <option value="dispatched">Dispatched</option>
              <option value="enroute">En Route</option>
              <option value="on_scene">On Scene</option>
              <option value="transporting">Transporting</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      )}

      {/* Active tracking info */}
      {isTracking && selectedAmb && (
        <div className="bg-ems-dark rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ems-muted">Ambulance</span>
            <span className="text-ems-white font-mono">{selectedAmb.registrationNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ems-muted">Status</span>
            <span className="text-green-400 capitalize">{shiftStatus}</span>
          </div>
          {coords && (
            <div className="flex justify-between text-sm">
              <span className="text-ems-muted">Coordinates</span>
              <span className="text-ems-white text-xs font-mono">
                {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
              </span>
            </div>
          )}
          {lastPing && (
            <div className="flex justify-between text-sm">
              <span className="text-ems-muted">Last ping</span>
              <span className="text-ems-white text-xs">{lastPing.toLocaleTimeString()}</span>
            </div>
          )}
          {/* Update status while tracking */}
          <div className="pt-2 border-t border-ems-border">
            <label className="block text-ems-muted text-xs mb-1">Update Status</label>
            <select
              className="ems-input w-full text-sm"
              value={shiftStatus}
              onChange={e => {
                setShiftStatus(e.target.value);
                // immediately send status update
                if (coords) {
                  api.put(`/admin/fleet/${selectedAmbulance}/location`, {
                    coordinates: coords,
                    status: e.target.value,
                  }).catch(() => {});
                }
              }}
            >
              <option value="available">Available</option>
              <option value="dispatched">Dispatched</option>
              <option value="enroute">En Route</option>
              <option value="on_scene">On Scene</option>
              <option value="transporting">Transporting</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-emergency-red/10 border border-emergency-red/30 text-emergency-red text-xs rounded-xl px-3 py-2 mb-4">
          <FiAlertCircle size={13} /> {error}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        disabled={!selectedAmbulance}
        className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
          isTracking
            ? 'bg-emergency-red/20 border border-emergency-red text-emergency-red hover:bg-emergency-red/30'
            : 'btn-emergency'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {isTracking
          ? <><FiWifiOff size={15} /> Stop Tracking</>
          : <><FiWifi size={15} /> Start GPS Tracking</>
        }
      </button>

      {!isTracking && (
        <p className="text-ems-muted text-xs text-center mt-2">
          Sends your location every 15 seconds while active
        </p>
      )}
    </div>
  );
}
