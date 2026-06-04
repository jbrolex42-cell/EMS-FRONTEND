import { useEffect, useRef } from 'react';

export default function MapView({
  center = [-1.2921, 36.8219],
  zoom = 13,
  markers = [],
  className = 'h-96 w-full rounded-2xl overflow-hidden',
  onMapClick
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix leaflet default icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          center,
          zoom,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(mapInstanceRef.current);

        if (onMapClick) {
          mapInstanceRef.current.on('click', (e) => {
            onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
          });
        }
      }

      // Clear old markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Add markers
      markers.forEach((m) => {
        const icon = m.type === 'emergency'
          ? L.divIcon({
              html: `<div style="width:24px;height:24px;background:#FF3B30;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(255,59,48,0.7);animation:pulse 1.5s infinite;"></div>`,
              className: '',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          : m.type === 'ambulance'
          ? L.divIcon({
              html: `<div style="width:28px;height:28px;background:#3B82F6;border-radius:6px;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;">🚑</div>`,
              className: '',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            })
          : L.divIcon({
              html: `<div style="width:24px;height:24px;background:#22C55E;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:12px;">🏥</div>`,
              className: '',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

        const marker = L.marker([m.lat, m.lng], { icon })
          .addTo(mapInstanceRef.current);

        if (m.popup) marker.bindPopup(m.popup);
        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      markers.forEach((m) => {
        const icon = L.divIcon({
          html: m.type === 'emergency'
            ? `<div style="width:20px;height:20px;background:#FF3B30;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(255,59,48,0.7);"></div>`
            : m.type === 'ambulance'
            ? `<div style="font-size:20px;">🚑</div>`
            : `<div style="font-size:20px;">🏥</div>`,
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([m.lat, m.lng], { icon }).addTo(mapInstanceRef.current);
        if (m.popup) marker.bindPopup(m.popup);
        markersRef.current.push(marker);
      });
    });
  }, [JSON.stringify(markers)]);

  return (
    <div className={className}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
