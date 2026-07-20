import MainLayout from '../layouts/MainLayout';
import { FiShield, FiMapPin, FiDatabase, FiLock, FiUsers, FiMail } from 'react-icons/fi';

const SECTIONS = [
  {
    Icon: FiDatabase,
    title: '1. Information We Collect',
    body: `We collect information you provide directly (name, phone number, national ID, next-of-kin details, medical history relevant to emergency response) and information generated automatically when you use the platform, including real-time GPS location during an active emergency request, device information, and USSD session data for *888# users.`
  },
  {
    Icon: FiMapPin,
    title: '2. How We Use Location Data',
    body: `Live GPS location is used exclusively to dispatch the nearest available ambulance, motorcycle responder, or air evacuation unit to your location, and to share your position with the assigned EMT and receiving hospital. Location tracking is active only during an open emergency request and is not collected in the background outside of active dispatch sessions.`
  },
  {
    Icon: FiUsers,
    title: '3. Sharing With Third Parties',
    body: `We share the minimum necessary data with: the dispatched EMT and ambulance crew, the receiving partner hospital, the Social Health Authority (SHA) for ECCIF claim processing where applicable, and the Kenya Medical Practitioners and Dentists Council (KMPDC) for regulatory compliance audits. We do not sell personal or health data to advertisers or unrelated third parties.`
  },
  {
    Icon: FiLock,
    title: '4. Data Security',
    body: `Health and location data is encrypted in transit and at rest. Access to patient records is role-restricted to on-duty EMTs, dispatch admins, and partner hospital staff directly involved in a case. Account passwords are hashed and never stored in plain text.`
  },
  {
    Icon: FiShield,
    title: '5. Data Retention',
    body: `Emergency case records, including timeline and location history, are retained for a minimum of seven years in line with Kenyan medical records regulations. Membership and billing data is retained for the duration of an active membership plus the applicable statutory period thereafter.`
  },
  {
    Icon: FiUsers,
    title: '6. Your Rights',
    body: `Under the Kenya Data Protection Act, 2019, you have the right to access, correct, or request deletion of your personal data, subject to our obligation to retain emergency medical records as required by law. You may also withdraw consent for non-essential communications at any time from your account settings.`
  },
  {
    Icon: FiMail,
    title: '7. Contact Our Data Protection Officer',
    body: `For any privacy-related requests or concerns, reach us at info@ems.co.ke, call our toll-free line 1514, or write to our Nairobi office. We aim to respond to all data requests within 14 working days.`
  },
];

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Legal</span>
        <h1 className="text-4xl font-display text-ems-white mt-2 mb-3">PRIVACY POLICY</h1>
        <p className="text-ems-muted mb-10">Last updated: January 2026</p>

        <div className="ems-card mb-8">
          <p className="text-ems-muted text-sm leading-relaxed">
            EMS Kenya ("we", "us", "our") operates an emergency medical dispatch platform across all 47 counties.
            This policy explains what information we collect, how it is used to save lives, and the rights you
            have over your data. By using our app, website, or *888# USSD service, you agree to the practices
            described here.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map(({ Icon, title, body }) => (
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
      </section>
    </MainLayout>
  );
}
