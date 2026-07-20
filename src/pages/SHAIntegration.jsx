import MainLayout from '../layouts/MainLayout';
import { FiCheckCircle, FiHeart, FiFileText, FiHome } from 'react-icons/fi';

const POINTS = [
  {
    Icon: FiHeart,
    title: 'What Is SHA?',
    body: `The Social Health Authority (SHA) is Kenya's national health insurance body, succeeding NHIF, responsible for administering universal health coverage including the Emergency, Chronic and Critical Illness Fund (ECCIF).`
  },
  {
    Icon: FiHome,
    title: 'SHA-Empanelled Hospitals',
    body: `Our partner hospital network includes facilities empanelled with SHA, marked with an "SHA" badge on the Hospitals page. Where possible, we prioritise routing patients to SHA-empanelled facilities to simplify claims and reduce out-of-pocket costs.`
  },
  {
    Icon: FiFileText,
    title: 'ECCIF Claims for Emergencies',
    body: `For SHA-registered members, eligible emergency transport and initial stabilization costs can be claimed under ECCIF. Our dispatch and hospital handover records are structured to support the documentation SHA requires for claim processing.`
  },
  {
    Icon: FiCheckCircle,
    title: 'Checking Your SHA Status',
    body: `You can add your SHA registration number in your EMS Kenya account settings so it's available to EMTs and hospital staff at the point of care. This does not replace the need to verify your own coverage status directly with SHA.`
  },
];

export default function SHAIntegration() {
  return (
    <MainLayout>
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Compliance</span>
        <h1 className="text-4xl font-display text-ems-white mt-2 mb-3">SHA INTEGRATION</h1>
        <p className="text-ems-muted mb-10">How EMS Kenya works with the Social Health Authority</p>

        <div className="ems-card mb-8">
          <p className="text-ems-muted text-sm leading-relaxed">
            EMS Kenya integrates with the Social Health Authority (SHA) to help members access emergency care
            through Kenya's universal health coverage system, wherever they are eligible to do so.
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
            SHA registration, contribution status, and claim approvals are managed entirely by SHA. EMS Kenya
            facilitates documentation and hospital routing but is not responsible for SHA's eligibility decisions
            or reimbursement timelines.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
