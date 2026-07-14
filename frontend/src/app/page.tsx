import HeroSection from '../components/landing/hero-section';
import FeaturesSection from '../components/landing/features.section';
import CtaSection from '../components/landing/cta-section';
import LandingNavbar from '../components/landing/landing-navbar';
import LandingFooter from '../components/landing/landing-footer';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
