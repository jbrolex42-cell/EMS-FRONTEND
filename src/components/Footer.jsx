
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
  const socialLinks = [
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
  ];

  const services = [
    'Emergency Dispatch',
    'Ambulance Network',
    'Motorcycle Response',
    'Air Evacuation',
    'Medical Taxi Escort',
    'Telemedicine',
  ];

  const memberships = [
    'Individual Cover',
    'Family Package',
    'Mum & Dad Cover',
    'Corporate Cover',
    'School Cover',
    'SACCO Package',
  ];

  const contactDetails = [
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
  ];

  const legalLinks = [
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
  ];

  const headingClass =
    'text-slate-900 font-bold text-sm uppercase tracking-widest';

  const linkClass =
    'block w-fit text-slate-600 hover:text-red-600 text-sm transition-colors duration-200';

  return (
    <footer className="relative mt-24 w-full overflow-hidden border-t border-slate-200 bg-white text-slate-800">

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">

        {/* MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* BRAND */}
          <div className="space-y-5">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="EMS Kenya Home"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-md shadow-red-600/20">
                <span className="font-display text-lg font-bold text-white">
                  EMS
                </span>
              </div>

              <div>
                <div className="text-base font-bold text-slate-900">
                  EMS Kenya
                </div>

                <div className="text-xs font-medium text-slate-500">
                  Emergency Medical System
                </div>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-slate-600">
              Kenya's fastest emergency dispatch network. Powered by
              real-time GPS, AI triage, and community EMTs. Available
              across all 47 counties.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl border border-slate-200 bg-slate-50
                    text-slate-600 transition-all duration-200
                    hover:border-red-200 hover:bg-red-50
                    hover:text-red-600 hover:-translate-y-0.5
                  "
                  aria-label={`Social media link ${index + 1}`}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>

          </div>

          {/* SERVICES */}
          <div className="space-y-5">

            <h3 className={headingClass}>
              Services
            </h3>

            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="#"
                    className={linkClass}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* MEMBERSHIP */}
          <div className="space-y-5">

            <h3 className={headingClass}>
              Membership
            </h3>

            <ul className="space-y-3">
              {memberships.map((membership) => (
                <li key={membership}>
                  <Link
                    to="/membership"
                    className={linkClass}
                  >
                    {membership}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* CONTACT */}
          <div className="space-y-5">

            <h3 className={headingClass}>
              Contact
            </h3>

            <div className="space-y-4">
              {contactDetails.map(({ Icon, text, red }, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <Icon
                    size={16}
                    className={`mt-0.5 flex-shrink-0 ${
                      red ? 'text-red-600' : 'text-slate-500'
                    }`}
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* USSD */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold tracking-wide text-red-700">
                USSD: *888#
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Works on any network
              </p>
            </div>

          </div>

        </div>

        {/* DONATION SECTION */}
        <div className="mt-14">

          <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-orange-50">

            {/* DECORATIVE BACKGROUND */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-200/40 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-200/40 blur-3xl" />

            <div className="relative p-6 md:p-8">

              <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

                {/* DONATION MESSAGE */}
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-100">
                    <FiHeart
                      className="text-red-600"
                      size={22}
                    />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                      Support Emergency Response
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
                      Every Second Saves a Life.
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                      Your contribution helps EMS Kenya strengthen
                      emergency response, support community EMTs,
                      and help provide life-saving care across Kenya.
                    </p>

                  </div>

                </div>

                {/* DONATE BUTTON */}
                <Link
                  to="/donate"
                  className="
                    inline-flex flex-shrink-0 items-center
                    justify-center gap-2 rounded-xl
                    bg-red-600 px-6 py-3.5
                    text-sm font-bold text-white
                    shadow-lg shadow-red-600/20
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:bg-red-700
                    hover:shadow-xl
                  "
                >
                  <FiHeart size={17} />
                  Donate Now
                  <FiArrowRight size={16} />
                </Link>

              </div>

              {/* DONATION INFORMATION */}
              <div className="mt-7 flex flex-col gap-3 border-t border-red-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />

                  <span className="text-xs font-medium text-slate-600">
                    M-PESA & Bank Transfer Supported
                  </span>
                </div>

                <span className="text-xs leading-5 text-slate-500">
                  Ambulance • Emergency Response • Community EMT • General Support
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-8 md:flex-row">

          <p className="text-center text-sm text-slate-500 md:text-left">
            © 2026 EMS Kenya. Developed by ROLEX.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">

            {legalLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
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