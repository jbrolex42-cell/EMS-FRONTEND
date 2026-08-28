import { Link } from 'react-router-dom';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiHeart,
  FiArrowRight,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-ems-dark border-t border-ems-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-lg">
                  EMS
                </span>
              </div>

              <div>
                <div className="text-white font-semibold text-sm">
                  EMS Kenya
                </div>

                <div className="text-ems-muted text-xs">
                  Emergency Medical System
                </div>
              </div>
            </div>

            <p className="text-ems-muted text-sm leading-relaxed">
              Kenya's fastest emergency dispatch network. Powered by
              real-time GPS, AI triage, and community EMTs. Available
              across all 47 counties.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">

              {[
                {
                  Icon: FiFacebook,
                  href: 'https://www.facebook.com/profile.php?id=61574262032887',
                },
                {
                  Icon: FiInstagram,
                  href: 'https://www.instagram.com/iced.rolex?igsh=MTZ6NmlwamNidmE0NQ==',
                },
                {
                  Icon: FiTwitter,
                  href: 'https://x.com/kenduniccur',
                },
                {
                  Icon: FiYoutube,
                  href: 'https://youtube.com/@gamer254-k4c?si=aumUBJ2NgFAhbf-t',
                },
                {
                  Icon: FaWhatsapp,
                  href: 'https://wa.me/qr/WYE74MOMBBA3J1',
                },
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-ems-card border border-ems-border rounded-lg flex items-center justify-center text-ems-muted hover:text-emergency-red hover:border-emergency-red transition-colors"
                  aria-label="Social media"
                >
                  <Icon size={15} />
                </a>
              ))}

            </div>

          </div>

          {/* Services */}
          <div className="space-y-4">

            <h3 className="text-ems-white font-semibold text-sm uppercase tracking-widest">
              Services
            </h3>

            {[
              'Emergency Dispatch',
              'Ambulance Network',
              'Motorcycle Response',
              'Air Evacuation',
              'Medical Taxi Escort',
              'Telemedicine',
            ].map((service) => (
              <Link
                key={service}
                to="#"
                className="block text-ems-muted hover:text-emergency-red text-sm transition-colors"
              >
                {service}
              </Link>
            ))}

          </div>

          {/* Membership */}
          <div className="space-y-4">

            <h3 className="text-ems-white font-semibold text-sm uppercase tracking-widest">
              Membership
            </h3>

            {[
              'Individual Cover',
              'Family Package',
              'Mum & Dad Cover',
              'Corporate Cover',
              'School Cover',
              'SACCO Package',
            ].map((membership) => (
              <Link
                key={membership}
                to="/membership"
                className="block text-ems-muted hover:text-emergency-red text-sm transition-colors"
              >
                {membership}
              </Link>
            ))}

          </div>

          {/* Contact */}
          <div className="space-y-4">

            <h3 className="text-ems-white font-semibold text-sm uppercase tracking-widest">
              Contact
            </h3>

            <div className="space-y-3">

              {[
                {
                  Icon: FiPhone,
                  text: '0757 751 980',
                  red: true,
                },
                {
                  Icon: FiMail,
                  text: 'info@ems.co.ke',
                },
                {
                  Icon: FiMapPin,
                  text: 'Nairobi, Kenya — 47 Counties',
                },
              ].map(({ Icon, text, red }, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <Icon
                    size={14}
                    className={`mt-0.5 flex-shrink-0 ${
                      red
                        ? 'text-emergency-red'
                        : 'text-ems-muted'
                    }`}
                  />

                  <span className="text-ems-muted text-sm">
                    {text}
                  </span>
                </div>
              ))}

            </div>

            {/* USSD */}
            <div className="mt-4 p-3 bg-emergency-red/10 border border-emergency-red/30 rounded-xl">

              <p className="text-emergency-red font-semibold text-sm">
                USSD: *888#
              </p>

              <p className="text-ems-muted text-xs mt-1">
                Works on any network
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            DONATION BOX
        ====================================================== */}

        <div className="mt-14">

          <div className="relative overflow-hidden rounded-2xl border border-emergency-red/30 bg-emergency-red/5">

            {/* Decorative background */}
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-emergency-red/10 blur-2xl pointer-events-none" />

            <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-emergency-red/10 blur-2xl pointer-events-none" />

            <div className="relative p-6 md:p-8">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* Donation Message */}
                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-xl bg-emergency-red/15 border border-emergency-red/20 flex items-center justify-center flex-shrink-0">

                    <FiHeart
                      className="text-emergency-red"
                      size={22}
                    />

                  </div>

                  <div>

                    <p className="text-emergency-red text-xs font-semibold uppercase tracking-widest">
                      Support Emergency Response
                    </p>

                    <h3 className="text-white text-xl md:text-2xl font-bold mt-1">
                      Every Second Saves a Life.
                    </h3>

                    <p className="text-ems-muted text-sm mt-2 max-w-2xl leading-relaxed">
                      Your contribution helps EMS Kenya strengthen
                      emergency response, support community EMTs,
                      and help provide life-saving care across Kenya.
                    </p>

                  </div>

                </div>

                {/* Donate Button */}
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emergency-red text-white font-bold text-sm hover:opacity-90 hover:scale-[1.02] transition-all whitespace-nowrap shadow-lg shadow-red-900/20"
                >
                  <FiHeart size={17} />
                  Donate Now
                  <FiArrowRight size={16} />
                </Link>

              </div>

              {/* Small donation information */}
              <div className="mt-6 pt-5 border-t border-emergency-red/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />

                  <span className="text-ems-muted text-xs">
                    M-PESA & Bank Transfer Supported
                  </span>
                </div>

                <span className="text-ems-muted text-xs">
                  Ambulance • Emergency Response • Community EMT • General Support
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            BOTTOM FOOTER
        ====================================================== */}

        <div className="border-t border-ems-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-ems-muted text-sm">
            © 2026 EMS Kenya. Developed by ROLEX.
          </p>

          <div className="flex flex-wrap justify-center gap-6">

            {[
              {
                label: 'Privacy Policy',
                to: '/privacy-policy',
              },
              {
                label: 'Terms of Service',
                to: '/terms-of-service',
              },
              {
                label: 'KMPDC Compliance',
                to: '/kmpdc-compliance',
              },
              {
                label: 'SHA Integration',
                to: '/sha-integration',
              },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-ems-muted hover:text-white text-xs transition-colors"
              >
                {label}
              </Link>
            ))}

          </div>

        </div>

      </div>
    </footer>
  );
}