export default function StatsCard({ title, value, subtitle, icon: Icon, color = '#FF3B30', trend }) {
  return (
    <div className="ems-card hover:border-emergency-red/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center`} style={{ background: `${color}20` }}>
          {Icon && <Icon size={20} style={{ color }} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-3xl font-display text-ems-white mb-1">{value}</div>
      <div className="text-sm font-medium text-ems-white mb-0.5">{title}</div>
      {subtitle && <div className="text-xs text-ems-muted">{subtitle}</div>}
    </div>
  );
}
