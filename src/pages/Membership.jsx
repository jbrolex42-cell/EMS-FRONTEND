import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { MEMBERSHIP_PLANS } from '../utils/constants';
import { FiCheckCircle, FiArrowRight, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Membership() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (type) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setLoading(type);
    try {
      const { data } = await api.post('/users/membership', { type });
      toast.success(`${type} membership activated! Member #${data.membership.memberNumber}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to activate membership');
    } finally {
      setLoading(null);
    }
  };

  const faqs = [
    { q: 'How does SHA ECCIF integrate with membership?', a: 'Your SHA membership covers emergency services under ECCIF. Our system pre-authorizes treatment at dispatch, so you receive care immediately without upfront payment.' },
    { q: 'Does membership guarantee ambulance availability?', a: 'Yes. Members receive priority dispatch ahead of non-members. Our fleet aggregation model ensures at least one responder is within 30 minutes of any member in our coverage area.' },
    { q: 'What if my emergency happens outside Kenya?', a: 'Standard membership covers Kenya only. Contact us for international medical evacuation insurance options through our partners.' },
    { q: 'Can I add beneficiaries after activation?', a: 'Yes. Family, Corporate, and SACCO plans allow beneficiaries to be added via the app or by calling 0700 395 395 at any time during your membership period.' }
  ];

  return (
    <MainLayout>
      {/* Hero */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(rgba(255,59,48,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,48,1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Membership Plans</span>
          <h1 className="text-5xl sm:text-6xl font-display text-ems-white mt-2 mb-4">
            YOUR LIFE.<br /><span className="text-emergency-red">GUARANTEED.</span>
          </h1>
          <p className="text-ems-muted text-lg leading-relaxed">
            Pre-pay for emergency cover. No financial friction when every second matters. SHA ECCIF integrated — your government fund pays at the point of care.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MEMBERSHIP_PLANS.map(plan => {
            const isActive = user?.membership?.type === plan.type && user?.membership?.status === 'active';
            return (
              <div
                key={plan.type}
                className={`ems-card flex flex-col transition-all hover:border-emergency-red/30 ${isActive ? 'border-emergency-red bg-emergency-red/5' : ''}`}
              >
                {isActive && (
                  <div className="bg-emergency-red text-white text-xs font-medium px-3 py-1 rounded-full self-start mb-4">
                    Your Plan
                  </div>
                )}
                <div className="text-4xl mb-3">{plan.icon}</div>
                <h3 className="text-ems-white font-bold text-lg mb-1">{plan.label}</h3>
                <div className="mb-4">
                  <span className="text-emergency-red font-display text-3xl">KES {plan.price.toLocaleString()}</span>
                  <span className="text-ems-muted text-sm"> / year</span>
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <FiCheckCircle size={13} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-ems-muted">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.type)}
                  disabled={isActive || loading === plan.type}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isActive ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-default'
                    : 'btn-emergency'
                  }`}
                >
                  {loading === plan.type ? '...' : isActive ? '✓ Active' : <><span>Activate Now</span><FiArrowRight size={14} /></>}
                </button>
              </div>
            );
          })}
        </div>

        {/* SHA note */}
        <div className="mt-12 p-8 bg-ems-dark border border-ems-border rounded-2xl text-center max-w-3xl mx-auto">
          <h3 className="text-ems-white font-semibold text-xl mb-3">Already Covered by SHA?</h3>
          <p className="text-ems-muted text-sm leading-relaxed mb-4">
            The Social Health Authority ECCIF fund covers emergency ambulance services for all Kenyan residents. 
            Link your SHA number in your profile to enable automatic billing. Our system verifies your eligibility at dispatch.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Salaried', value: '2.75% gross' },
              { label: 'Informal sector', value: 'From KES 300/mo' },
              { label: 'ECCIF covers', value: 'Ambulance + 24h care' },
              { label: 'Claim settlement', value: '59% rate (2025)' }
            ].map(({ label, value }) => (
              <div key={label} className="bg-ems-card border border-ems-border rounded-xl p-3 text-center">
                <div className="text-ems-white font-semibold text-sm">{value}</div>
                <div className="text-ems-muted text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-display text-ems-white text-center mb-10">FREQUENTLY ASKED</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="ems-card">
                <h4 className="text-ems-white font-semibold mb-2">{q}</h4>
                <p className="text-ems-muted text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 text-center">
          <p className="text-ems-muted text-sm mb-4">Questions about which plan is right for you?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:0757751980" className="btn-emergency flex items-center gap-2 py-3 px-6">
              <FiPhone size={15} /> Call 0757 751 980
            </a>
            <a href="mailto:jbrolex42@gmail.com" className="btn-ghost py-3 px-6">Email Us</a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
