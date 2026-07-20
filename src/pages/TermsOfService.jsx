import MainLayout from '../layouts/MainLayout';
import { FiFileText, FiAlertTriangle, FiCreditCard, FiUserCheck, FiXCircle, FiPhone } from 'react-icons/fi';

const SECTIONS = [
  {
    Icon: FiUserCheck,
    title: '1. Eligibility & Accounts',
    body: `You must be at least 18 years old, or have a parent/guardian register on your behalf, to create an EMS Kenya account. You agree to provide accurate identification and medical information — inaccurate details may delay emergency response and are provided at your own risk.`
  },
  {
    Icon: FiPhone,
    title: '2. Emergency Dispatch Service',
    body: `EMS Kenya connects you to independent EMTs, ambulance operators, and partner hospitals. While we strive for the fastest possible response, actual arrival times depend on traffic, weather, county infrastructure, and unit availability, and cannot be guaranteed. In life-threatening situations, always call 1514 or your nearest hospital directly if the app is unreachable.`
  },
  {
    Icon: FiCreditCard,
    title: '3. Membership Plans & Billing',
    body: `Individual, Family, Mum & Dad, Corporate, School, and SACCO packages are billed on the cycle selected at signup (monthly or annual). Fees are non-refundable once a dispatch has been initiated under your plan for that billing period. Plan benefits, coverage limits, and partner hospital networks may be updated with 30 days' notice.`
  },
  {
    Icon: FiAlertTriangle,
    title: '4. Limitation of Liability',
    body: `EMS Kenya facilitates connections between patients and independent, licensed medical responders; we are not a hospital and do not directly employ all EMT personnel. To the maximum extent permitted by Kenyan law, EMS Kenya is not liable for treatment outcomes, delays caused by third parties, or circumstances beyond our reasonable control (natural disasters, network outages, road closures).`
  },
  {
    Icon: FiFileText,
    title: '5. SHA & Insurance Claims',
    body: `Where a member is SHA-registered or covered by the Emergency, Chronic and Critical Illness Fund (ECCIF), we submit claims on your behalf to SHA-empanelled partner hospitals. Approval and reimbursement timelines are determined by the Social Health Authority and not by EMS Kenya.`
  },
  {
    Icon: FiXCircle,
    title: '6. Termination',
    body: `You may cancel your membership at any time from account settings; cancellation takes effect at the end of the current billing cycle. We reserve the right to suspend accounts used to submit false emergency requests, which is a criminal offence under Kenyan law and endangers other patients awaiting dispatch.`
  },
  {
    Icon: FiFileText,
    title: '7. Governing Law',
    body: `These terms are governed by the laws of the Republic of Kenya. Any disputes will first be subject to good-faith negotiation, and if unresolved, referred to arbitration in Nairobi in accordance with the Arbitration Act.`
  },
];

export default function TermsOfService() {
  return (
    <MainLayout>
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Legal</span>
        <h1 className="text-4xl font-display text-ems-white mt-2 mb-3">TERMS OF SERVICE</h1>
        <p className="text-ems-muted mb-10">Last updated: January 2026</p>

        <div className="ems-card mb-8">
          <p className="text-ems-muted text-sm leading-relaxed">
            These Terms of Service govern your use of the EMS Kenya app, website, and *888# USSD service.
            By requesting an emergency dispatch, subscribing to a membership plan, or otherwise using our
            platform, you agree to be bound by these terms.
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
