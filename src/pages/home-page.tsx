import { Hero } from '../components/landing/hero';
import { LogoMarquee, Services } from '../components/landing/services';
import { SprintBookingSection } from '../components/landing/sprint-booking-section';
import { WhyUs, Process } from '../components/landing/why-process';
import {
  Testimonials,
  Pricing,
  Faq,
  ContactCta,
} from '../components/landing/sections';
import { TeamSection } from '../components/landing/team';

export function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <Services />
      <SprintBookingSection />
      <WhyUs />
      <Process />
      <Testimonials />
      <TeamSection />
      <Pricing />
      <Faq />
      <ContactCta />
    </>
  );
}

export default HomePage;
