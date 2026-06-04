import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-ems-dark border-t border-ems-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-lg">EMS</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">EMS Kenya</div>
                <div className="text-ems-muted text-xs">Emergency Response System</div>
              </div>
            </div>
            <p className="text-ems-muted text-sm leading-relaxed">
              Kenya's fastest emergency dispatch network. Powered by real-time GPS, AI triage, and community EMTs. Available across all 47 counties.
            </p>
            <div className="flex gap-3">
              {[{ Icon: FiFacebook, href: '#' }, { Icon: FiInstagram, href: '#' }, { Icon: FiTwitter, href: '#' }].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 bg-ems-card border border-ems-border rounded-lg flex items-center justify-center text-ems-muted hover:text-emergency-red hover:border-emergency-red transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-ems-white font-semibold text-sm uppercase tracking-widest">Services</h3>
            {['Emergency Dispatch', 'Ambulance Network', 'Motorcycle Response', 'Air Evacuation', 'Medical Taxi Escort', 'Telemedicine'].map(s => (
              <Link key={s} to="#" className="block text-ems-muted hover:text-emergency-red text-sm transition-colors">{s}</Link>
            ))}
          </div>

          {/* Membership */}
          <div className="space-y-4">
            <h3 className="text-ems-white font-semibold text-sm uppercase tracking-widest">Membership</h3>
            {['Individual Cover', 'Family Package', 'Mum & Dad Cover', 'Corporate Cover', 'School Cover', 'SACCO Package'].map(m => (
              <Link key={m} to="/membership" className="block text-ems-muted hover:text-emergency-red text-sm transition-colors">{m}</Link>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-ems-white font-semibold text-sm uppercase tracking-widest">Contact</h3>
            <div className="space-y-3">
              {[
                { Icon: FiPhone, text: '0700 395 395 (Toll Free: 1514)', red: true },
                { Icon: FiPhone, text: '0738 395 395' },
                { Icon: FiMail, text: 'info@ems.co.ke' },
                { Icon: FiMapPin, text: 'Nairobi, Kenya — 47 Counties' }
              ].map(({ Icon, text, red }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon size={14} className={`mt-0.5 flex-shrink-0 ${red ? 'text-emergency-red' : 'text-ems-muted'}`} />
                  <span className="text-ems-muted text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emergency-red/10 border border-emergency-red/30 rounded-xl">
              <p className="text-emergency-red font-semibold text-sm">USSD: *888#</p>
              <p className="text-ems-muted text-xs mt-1">Works on any phone, any network</p>
            </div>
          </div>
        </div>

        <div className="border-t border-ems-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ems-muted text-sm">© 2026 EMS Kenya. A subsidiary of Kenya Red Cross Society. Regulated by KMPDC.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'KMPDC Compliance', 'SHA Integration'].map(l => (
              <Link key={l} to="#" className="text-ems-muted hover:text-white text-xs transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
