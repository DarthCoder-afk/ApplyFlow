import LandingNavbar from '../components/landing/landing-navbar';
import LandingFooter from '../components/landing/landing-footer';
import ApplyFlowLanding from '../components/landing/applyflow-landing';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <LandingNavbar />
      <ApplyFlowLanding />
      <LandingFooter />
    </main>
  );
}
