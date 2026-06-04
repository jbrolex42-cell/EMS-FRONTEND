export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 border-2 border-ems-border rounded-full" />
        <div className="absolute inset-0 border-2 border-t-emergency-red rounded-full animate-spin" />
      </div>
      {text && <p className="text-ems-muted text-sm">{text}</p>}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-ems-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-display text-emergency-red mb-4">EMS</div>
        <Loader size="lg" text={text} />
      </div>
    </div>
  );
}
