import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiClock, FiMapPin } from 'react-icons/fi';
import EmergencyButton from './EmergencyButton';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,59,48,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,48,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emergency-red/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emergency-red/10 border border-emergency-red/20 text-emergency-red text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emergency-red rounded-full animate-pulse" />
              Live across 47 counties — Kenya
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display leading-none tracking-wide text-ems-white">
              EMERGENCY<br />
              <span className="text-emergency-red">RESPONSE</span><br />
              IN MINUTES
            </h1>

            <p className="text-ems-muted text-lg leading-relaxed max-w-md">
              Kenya's fastest dispatch network. One tap connects you to the nearest ambulance, EMT, or motorcycle first responder — anytime, anywhere.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FiClock, value: '<13 min', label: 'Urban response' },
                { icon: FiMapPin, value: '47', label: 'Counties covered' },
                { icon: FiShield, value: '24/7', label: 'Always active' }
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center p-3 bg-ems-card border border-ems-border rounded-xl">
                  <Icon size={16} className="text-emergency-red mx-auto mb-1.5" />
                  <div className="text-ems-white font-bold text-sm">{value}</div>
                  <div className="text-ems-muted text-xs">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-emergency flex items-center gap-2 text-base py-3.5 px-7">
                Get Emergency Cover <FiArrowRight size={16} />
              </Link>
              <Link to="/membership" className="btn-ghost flex items-center gap-2 text-base py-3.5 px-7">
                View Plans
              </Link>
            </div>

            <p className="text-ems-muted text-xs">
              Regulated by KMPDC · SHA ECCIF integrated · ODPC compliant
            </p>
          </div>

          {/* Right – SOS button */}
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="text-center space-y-2">
              <p className="text-ems-muted text-sm uppercase tracking-widest">In an emergency?</p>
              <p className="text-ems-white font-semibold text-lg">Tap the SOS button now</p>
            </div>

            <EmergencyButton size="lg" />

            <div className="text-center space-y-3 w-full max-w-xs">
              <p className="text-ems-muted text-xs uppercase tracking-widest">Or call us directly</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Toll Free', value: '1514' },
                  { label: 'Mobile', value: '0757 751 980' },
                  { label: 'USSD', value: '*888#' },
                  { label: 'WhatsApp', value: '0757 751 980' }
                ].map(({ label, value }) => (
                  <div key={label} className="bg-ems-card border border-ems-border rounded-xl p-3 text-center">
                    <div className="text-ems-muted text-xs mb-0.5">{label}</div>
                    <div className="text-ems-white font-semibold text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
