import { SEOHead } from '../components/common/seo-head';
import { getOrganizationSchema, getWebSiteSchema } from '../lib/seo-schemas';
import { Hero } from '../components/landing/hero';
import { LogoMarquee, Services } from '../components/landing/services';
import { SprintBookingSection } from '../components/landing/sprint-booking-section';
import { WhyUs, Process } from '../components/landing/why-process';
import { WorkSection } from '../components/landing/work-section';
import {
  Testimonials,
  Pricing,
  Faq,
  ContactCta,
} from '../components/landing/sections';
import { TeamSection } from '../components/landing/team';

export function HomePage() {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(),
    ],
  };

  return (
    <>
      <SEOHead
        title="My Planet Services — SaaS, Web & AI Development Studio"
        description="My Planet Services builds production websites, mobile apps, AI automation pipelines, SEO/AEO/GEO systems, and full SaaS products for ambitious scaling teams."
        canonicalPath="/"
        keywords="SaaS development, AI automation, custom web development, Headless Shopify Plus, React 19, Next.js studio, AEO, GEO, full stack software studio"
        schema={homeSchema}
      />
      <Hero />
      <LogoMarquee />
      <Services />
      <SprintBookingSection />
      <WhyUs />
      <Process />
      <WorkSection />
      <Testimonials />
      <TeamSection />
      <Pricing />
      <Faq />
      <ContactCta />
    </>
  );
}

export default HomePage;
