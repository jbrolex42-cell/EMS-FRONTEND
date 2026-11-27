
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiShield,
  FiClock,
  FiMapPin,
} from 'react-icons/fi';
import EmergencyButton from './EmergencyButton';

export default function HeroSection() {
  const heroStats = [
    {
      icon: FiClock,
      value: '<13 min',
      label: 'Urban response',
    },
    {
      icon: FiMapPin,
      value: '47',
      label: 'Counties covered',
    },
    {
      icon: FiShield,
      value: '24/7',
      label: 'Always active',
    },
  ];

  const emergencyContacts = [
    { label: 'Toll Free', value: '1514' },
    { label: 'Mobile', value: '0757 751 980' },
    { label: 'USSD', value: '*888#' },
    { label: 'WhatsApp', value: '0757 751 980' },
  ];

  return (
    <section className="
      relative isolate flex min-h-screen
      w-full items-center overflow-hidden
      bg-white pt-24
    ">
      {/* ==================================================
          BACKGROUND GRID
      ================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          opacity-[0.035]
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(220,38,38,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ==================================================
          DECORATIVE GLOW
      ================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-40 top-1/4
          h-[500px] w-[500px]
          rounded-full bg-red-100/70
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -bottom-40 -left-40
          h-[450px] w-[450px]
          rounded-full bg-red-50
          blur-3xl
        "
      />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="
        relative mx-auto w-full
        max-w-7xl px-4 py-16
        sm:px-6 sm:py-20
        lg:px-8 lg:py-24
      ">
        <div className="
          grid items-center gap-16
          lg:grid-cols-2 lg:gap-12
        ">

          {/* =================================================
              LEFT: HERO CONTENT
          ================================================= */}

          <div className="space-y-8">

            {/* Availability badge */}

            <div className="
              inline-flex items-center gap-2
              rounded-full border border-red-200
              bg-red-50 px-4 py-2
              text-xs font-bold
              text-red-700
            ">
              <span className="
                h-2 w-2 rounded-full
                bg-red-600 animate-pulse
              " />

              Live across 47 counties — Kenya
            </div>

            {/* Main heading */}

            <div>
              <h1 className="
                font-display text-5xl
                leading-[0.95] tracking-wide
                text-slate-950
                sm:text-6xl
                lg:text-7xl
                xl:text-8xl
              ">
                EMERGENCY
                <br />

                <span className="text-red-600">
                  RESPONSE
                </span>

                <br />

                IN MINUTES
              </h1>
            </div>

            {/* Description */}

            <p className="
              max-w-xl
              text-base leading-8
              text-slate-600
              sm:text-lg
            ">
              Kenya's fastest dispatch network. One tap connects
              you to the nearest ambulance, EMT, or motorcycle
              first responder — anytime, anywhere.
            </p>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="
              grid grid-cols-3 gap-3
              sm:gap-4
            ">
              {heroStats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="
                    rounded-2xl
                    border border-slate-200
                    bg-white p-3
                    text-center
                    shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-red-200
                    hover:shadow-md
                    sm:p-4
                  "
                >
                  <div className="
                    mb-2 flex justify-center
                  ">
                    <Icon
                      size={19}
                      className="text-red-600"
                    />
                  </div>

                  <div className="
                    text-sm font-extrabold
                    text-slate-900
                    sm:text-lg
                  ">
                    {value}
                  </div>

                  <div className="
                    mt-1 text-[10px]
                    leading-relaxed text-slate-500
                    sm:text-xs
                  ">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="
              flex flex-col gap-3
              sm:flex-row sm:flex-wrap
            ">
              <Link
                to="/register"
                className="
                  inline-flex items-center
                  justify-center gap-3
                  rounded-xl bg-red-600
                  px-7 py-4
                  text-sm font-bold text-white
                  shadow-lg shadow-red-600/20
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-red-700
                  hover:shadow-xl
                  focus:outline-none
                  focus:ring-2 focus:ring-red-500
                  focus:ring-offset-2
                  sm:text-base
                "
              >
                Get Emergency Cover
                <FiArrowRight size={17} />
              </Link>

              <Link
                to="/membership"
                className="
                  inline-flex items-center
                  justify-center gap-2
                  rounded-xl border border-slate-300
                  bg-white px-7 py-4
                  text-sm font-bold text-slate-800
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-red-300
                  hover:bg-red-50
                  hover:text-red-700
                  focus:outline-none
                  focus:ring-2 focus:ring-red-500
                  focus:ring-offset-2
                  sm:text-base
                "
              >
                View Plans
              </Link>
            </div>

            {/* Compliance information */}

            <p className="
              text-xs leading-relaxed
              text-slate-500
            ">
              Regulated by KMPDC · SHA ECCIF integrated ·
              ODPC compliant
            </p>
          </div>

          {/* =================================================
              RIGHT: EMERGENCY SOS
          ================================================= */}

          <div className="
            flex flex-col items-center
            justify-center gap-9
          ">

            {/* SOS introduction */}

            <div className="space-y-2 text-center">
              <p className="
                text-xs font-bold uppercase
                tracking-[0.2em] text-red-600
              ">
                Emergency Assistance
              </p>

              <h2 className="
                text-xl font-bold
                text-slate-900 sm:text-2xl
              ">
                In an emergency?
              </h2>

              <p className="
                text-sm text-slate-600
              ">
                Tap the SOS button to request help.
              </p>
            </div>

            {/* Emergency button */}

            <div className="
              flex w-full items-center
              justify-center
              rounded-3xl border border-red-100
              bg-red-50/70
              px-4 py-10
              shadow-sm
            ">
              <EmergencyButton size="lg" />
            </div>

            {/* =================================================
                EMERGENCY CONTACT DETAILS
            ================================================= */}

            <div className="
              w-full max-w-sm
            ">
              <div className="mb-4 text-center">
                <p className="
                  text-xs font-bold uppercase
                  tracking-[0.2em] text-slate-500
                ">
                  Or contact us directly
                </p>
              </div>

              <div className="
                grid grid-cols-2 gap-3
              ">
                {emergencyContacts.map(({ label, value }) => (
                  <div
                    key={label}
                    className="
                      rounded-xl
                      border border-slate-200
                      bg-white p-4
                      text-center shadow-sm
                      transition-all duration-200
                      hover:border-red-200
                      hover:shadow-md
                    "
                  >
                    <div className="
                      mb-1 text-xs
                      font-medium text-slate-500
                    ">
                      {label}
                    </div>

                    <div className="
                      break-words text-sm
                      font-bold text-slate-900
                    ">
                      {value}
                    </div>
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