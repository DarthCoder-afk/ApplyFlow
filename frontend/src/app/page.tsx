import HeroSection from '../components/landing/hero-section';
import FeaturesSection from '../components/landing/features.section';
import CtaSection from '../components/landing/cta-section';
import LandingNavbar from '../components/landing/landing-navbar';
import LandingFooter from '../components/landing/landing-footer';
import {
  AnalyticsPreviewSection,
  DashboardPreviewSection,
  FaqSection,
  HowItWorksSection,
  TrustedBySection,
} from '../components/landing/landing-sections';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <LandingNavbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <AnalyticsPreviewSection />
      <HowItWorksSection />
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
