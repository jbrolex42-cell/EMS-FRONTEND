import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import {
  FiArrowRight, FiCheckCircle, FiActivity, FiShield,
  FiMapPin, FiClock, FiZap, FiStar
} from 'react-icons/fi';
import { MEMBERSHIP_PLANS } from '../utils/constants';

export default function Home() {
  const howItWorks = [
    { step: '01', title: 'Tap SOS or Call', desc: 'One tap on the app, USSD *888#, or call 0700 395 395. Works on any phone, any network.' },
    { step: '02', title: 'AI Triage & Dispatch', desc: 'Our AI assesses your emergency in Swahili or English and dispatches the closest, most equipped responder in seconds.' },
    { step: '03', title: 'Responder En Route', desc: 'Track your ambulance or motorcycle EMT live on the map. Get real-time ETA and responder details.' },
    { step: '04', title: 'SHA-Covered Care', desc: 'Our EMTs stabilize you on scene. SHA ECCIF covers the cost — no payment at the point of crisis.' }
  ];

  const features = [
    { icon: FiZap, title: 'Sub-13 Minute Urban ETA', desc: 'GPS-optimized dispatch gets you the nearest available unit — not just the nearest provider.' },
    { icon: FiMapPin, title: '47-County Coverage', desc: 'ALS ambulances, BLS units, and motorcycle first responders across Kenya, including Turkana and Garissa.' },
    { icon: FiShield, title: 'KMPDC Certified EMTs', desc: 'Every responder holds active KMPDC registration and BLS/ALS certification. No gig-economy shortcuts.' },
    { icon: FiActivity, title: 'AI Voice Triage', desc: 'NLP triage in Swahili and English assesses severity and guides bystanders in real time before help arrives.' },
    { icon: FiCheckCircle, title: 'SHA ECCIF Integrated', desc: 'Seamlessly verify your SHA membership at dispatch. Zero out-of-pocket payment for covered emergencies.' },
    { icon: FiClock, title: 'what3words Addressing', desc: 'In rural areas without street names, we pinpoint your exact location to a 3-metre square.' }
  ];

  return (
    <MainLayout>
      <HeroSection />

      {/* How it works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Process</span>
          <h2 className="text-4xl font-display text-ems-white mt-2">HOW IT WORKS</h2>
          <p className="text-ems-muted mt-3 max-w-xl mx-auto">Four steps from crisis to care. Designed for the Kenyan reality — urban congestion and rural distance alike.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map(({ step, title, desc }) => (
            <div key={step} className="ems-card group hover:border-emergency-red/30 transition-all">
              <div className="text-5xl font-display text-emergency-red/20 group-hover:text-emergency-red/40 transition-colors mb-4">{step}</div>
              <h3 className="text-ems-white font-semibold mb-2">{title}</h3>
              <p className="text-ems-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-ems-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Technology</span>
            <h2 className="text-4xl font-display text-ems-white mt-2">BUILT FOR KENYA'S REALITY</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-ems-black border border-ems-border rounded-2xl hover:border-emergency-red/30 transition-all group">
                <div className="w-11 h-11 bg-emergency-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emergency-red/20 transition-colors">
                  <Icon size={20} className="text-emergency-red" />
                </div>
                <h3 className="text-ems-white font-semibold mb-2">{title}</h3>
                <p className="text-ems-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership preview */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Membership</span>
          <h2 className="text-4xl font-display text-ems-white mt-2">FROM KES 4,000 / YEAR</h2>
          <p className="text-ems-muted mt-3 max-w-xl mx-auto">Pre-pay for peace of mind. No payment at the scene of a crisis. SHA ECCIF integrated.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MEMBERSHIP_PLANS.slice(0, 4).map(plan => (
            <div key={plan.type} className="ems-card hover:border-emergency-red/30 transition-all">
              <div className="text-3xl mb-3">{plan.icon}</div>
              <h3 className="text-ems-white font-semibold mb-1">{plan.label}</h3>
              <div className="text-emergency-red text-2xl font-display mb-3">KES {plan.price.toLocaleString()}</div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-ems-muted text-xs">
                    <FiCheckCircle size={12} className="text-green-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/membership" className="btn-emergency inline-flex items-center gap-2 px-8 py-3.5">
            View All Plans <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emergency-red/5 border border-emergency-red/20 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emergency-red/10 to-transparent" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-display text-ems-white mb-4">DON'T WAIT FOR A CRISIS</h2>
            <p className="text-ems-muted text-lg max-w-xl mx-auto mb-8">Join over 2 million Kenyans with guaranteed emergency cover. From KES 4,000 a year.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="btn-emergency text-base py-4 px-8 flex items-center gap-2">
                Activate My Cover <FiArrowRight size={16} />
              </Link>
              <a href="tel:0700395395" className="btn-ghost text-base py-4 px-8">
                Call 0700 395 395
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
