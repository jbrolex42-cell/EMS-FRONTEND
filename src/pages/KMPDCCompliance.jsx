import MainLayout from '../layouts/MainLayout';
import { FiCheckCircle, FiAward, FiUserCheck, FiClipboard } from 'react-icons/fi';

const POINTS = [
  {
    Icon: FiUserCheck,
    title: 'Certified EMT Personnel',
    body: `Every EMT dispatched through EMS Kenya holds a valid certification recognized by the Kenya Medical Practitioners and Dentists Council (KMPDC) or the relevant county health authority. Certification status is verified at onboarding and re-checked annually.`
  },
  {
    Icon: FiAward,
    title: 'Licensed Ambulance Standards',
    body: `Ambulances in our network meet KMPDC and Ministry of Health equipment and staffing standards for their classification (Basic, Advanced, Neonatal, or Bariatric), including required medical equipment, sanitation protocols, and a minimum of one certified EMT per unit.`
  },
  {
    Icon: FiClipboard,
    title: 'Clinical Protocols',
    body: `Triage, treatment, and handover protocols followed by our EMTs are aligned with national Emergency Medical Care guidelines. Every case is logged with a full response timeline for clinical audit and quality assurance.`
  },
  {
    Icon: FiCheckCircle,
    title: 'Ongoing Regulatory Reporting',
    body: `We maintain records available for inspection by KMPDC and county health departments, and cooperate fully with regulatory audits, incident reviews, and continuing professional development requirements for our EMT network.`
  },
];

export default function KMPDCCompliance() {
  return (
    <MainLayout>
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Compliance</span>
        <h1 className="text-4xl font-display text-ems-white mt-2 mb-3">KMPDC COMPLIANCE</h1>
        <p className="text-ems-muted mb-10">How EMS Kenya aligns with the Kenya Medical Practitioners and Dentists Council</p>

        <div className="ems-card mb-8">
          <p className="text-ems-muted text-sm leading-relaxed">
            EMS Kenya operates in accordance with the standards set by the Kenya Medical Practitioners and
            Dentists Council (KMPDC), the statutory body responsible for regulating medical practice in Kenya.
            This page outlines the key ways our platform, personnel, and partner facilities meet those standards.
          </p>
        </div>

        <div className="space-y-6">
          {POINTS.map(({ Icon, title, body }) => (
            <div key={title} className="ems-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emergency-red/10 border border-emergency-red/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-emergency-red" />
                </div>
                <h2 className="text-ems-white font-semibold">{title}</h2>
              </div>
              <p className="text-ems-muted text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="ems-card mt-8 border-emergency-red/20 bg-emergency-red/5">
          <p className="text-ems-muted text-sm leading-relaxed">
            To verify a specific EMT's or facility's registration, or to report a compliance concern, contact
            KMPDC directly or reach our compliance team at <span className="text-ems-white">info@ems.co.ke</span>.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
