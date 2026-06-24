import { FeatureIconName } from './data/features-data';

type FeatureMockProps = {
  icon: FeatureIconName;
  variant: 'light';
};

export default function FeatureMock({ icon }: FeatureMockProps) {
  const shell = 'border-slate-200 bg-white shadow-sm';
  const row = 'bg-slate-50';
  const muted = 'text-slate-500';
  const text = 'text-slate-900';

  if (icon === 'briefcase') {
    return (
      <div className={`rounded-3xl border p-6 ${shell}`}>
        <p className={`mb-4 text-sm font-semibold ${text}`}>Saved Jobs</p>
        <div className="space-y-3">
          {[
            'Product Designer · Acme Co',
            'Frontend Engineer · Nova Labs',
            'UX Researcher · Brightly',
          ].map((job) => (
            <div key={job} className={`rounded-xl ${row} p-3`}>
              <p className={`text-sm font-medium ${text}`}>{job}</p>
              <p className={`text-xs ${muted}`}>Saved · Applied</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (icon === 'barChart3') {
    return (
      <div className={`rounded-3xl border p-6 ${shell}`}>
        <p className={`mb-4 text-sm font-semibold ${text}`}>Your Progress</p>
        <div className={`mb-3 rounded-xl ${row} p-3`}>
          <p className={`text-xs ${muted}`}>Applications</p>
          <p className={`text-2xl font-bold ${text}`}>24</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-xl ${row} p-3`}>
            <p className={`text-xs ${muted}`}>Interview</p>
            <p className="text-lg font-semibold text-cyan-500">5</p>
          </div>
          <div className={`rounded-xl ${row} p-3`}>
            <p className={`text-xs ${muted}`}>Offer</p>
            <p className="text-lg font-semibold text-violet-500">1</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border p-6 ${shell}`}>
      <p className={`mb-4 text-sm font-semibold ${text}`}>Application Timeline</p>
      <div className="space-y-3">
        {[
          { label: 'Applied', note: 'Submitted via company site' },
          { label: 'Interview', note: 'Phone screen scheduled Friday' },
          { label: 'Follow-up', note: 'Send thank-you email' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl ${row} p-3`}>
            <p className={`text-sm font-medium ${text}`}>{item.label}</p>
            <p className={`text-xs ${muted}`}>{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
