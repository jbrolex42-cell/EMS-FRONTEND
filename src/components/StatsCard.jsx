
export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#FF3B30',
  trend,
}) {
  const hasTrend = trend !== undefined && trend !== null;

  const isPositiveTrend = Number(trend) >= 0;

  return (
    <div className="
      group min-w-0
      rounded-2xl
      border border-slate-200
      bg-white p-5
      shadow-sm
      transition-all duration-300
      hover:-translate-y-1
      hover:border-red-200
      hover:shadow-lg
    ">
      {/* Icon and trend */}

      <div className="
        mb-5 flex items-start
        justify-between gap-3
      ">
        <div
          className="
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-xl
          "
          style={{
            backgroundColor: `${color}18`,
          }}
        >
          {Icon && (
            <Icon
              size={21}
              style={{ color }}
              aria-hidden="true"
            />
          )}
        </div>

        {hasTrend && (
          <span
            className={`
              inline-flex items-center
              rounded-full px-2.5 py-1
              text-xs font-bold
              ${
                isPositiveTrend
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }
            `}
          >
            {isPositiveTrend ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>

      {/* Value */}

      <div className="
        mb-1 break-words
        font-display text-3xl
        leading-tight text-slate-900
      ">
        {value ?? '—'}
      </div>

      {/* Title */}

      <div className="
        mb-1 text-sm font-bold
        leading-snug text-slate-800
      ">
        {title}
      </div>

      {/* Subtitle */}

      {subtitle && (
        <div className="
          text-xs leading-relaxed
          text-slate-500
        ">
          {subtitle}
        </div>
      )}
    </div>
  );
}