import { FiMapPin, FiClock, FiActivity } from 'react-icons/fi';

const typeColors = {
  ALS: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  BLS: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  motorcycle: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  air: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  medical_taxi: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' }
};

const statusDot = {
  available: 'bg-green-400',
  dispatched: 'bg-blue-400',
  enroute: 'bg-yellow-400',
  maintenance: 'bg-gray-400',
  offline: 'bg-red-400'
};

export default function AmbulanceCard({ ambulance }) {
  const colors = typeColors[ambulance.type] || typeColors.BLS;

  return (
    <div className="ems-card hover:border-emergency-red/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${statusDot[ambulance.status] || 'bg-gray-400'} ${ambulance.status === 'available' ? 'animate-pulse' : ''}`} />
            <span className="text-ems-white font-semibold">{ambulance.registrationNumber}</span>
          </div>
          <span className={`status-badge ${colors.bg} ${colors.text} border ${colors.border}`}>
            {ambulance.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <span className="text-ems-muted text-xs capitalize">{ambulance.status.replace('_', ' ')}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-ems-muted">
          <FiMapPin size={13} />
          <span>{ambulance.county}</span>
        </div>
        {ambulance.emt && (
          <div className="flex items-center gap-2 text-ems-muted">
            <FiActivity size={13} />
            <span>{ambulance.emt.firstName} {ambulance.emt.lastName}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-ems-muted">
          <FiClock size={13} />
          <span>Avg. {ambulance.averageResponseTime || 0} min response</span>
        </div>
      </div>

      {/* Equipment indicators */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {ambulance.equipment?.defibrillator && <span className="text-xs bg-ems-dark px-2 py-1 rounded-lg text-ems-muted">AED</span>}
        {ambulance.equipment?.ventilator && <span className="text-xs bg-ems-dark px-2 py-1 rounded-lg text-ems-muted">Vent</span>}
        {ambulance.equipment?.oxygenLevel > 0 && (
          <span className="text-xs bg-ems-dark px-2 py-1 rounded-lg text-ems-muted">O₂ {ambulance.equipment.oxygenLevel}%</span>
        )}
        {ambulance.equipment?.bloodProducts && <span className="text-xs bg-ems-dark px-2 py-1 rounded-lg text-ems-muted">Blood</span>}
      </div>
    </div>
  );
}
