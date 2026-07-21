import HeroSection from '../components/home/HeroSection'
import StatsCounter from '../components/home/StatsCounter'
import FeaturedSpeakers from '../components/home/FeaturedSpeakers'
import AgendaPreview from '../components/home/AgendaPreview'
import PartnerSpotlight from '../components/home/PartnerSpotlight'
import SponsorsSection from '../components/home/SponsorsSection'
import AnimatedSection from '../components/ui/AnimatedSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <AnimatedSection animation="fadeIn" duration={800}>
        <StatsCounter />
      </AnimatedSection>

      <AnimatedSection animation="slideRight" duration={1000} threshold={0.2}>
        <FeaturedSpeakers />
      </AnimatedSection>

      <AnimatedSection animation="slideLeft" duration={1000} threshold={0.2}>
        <AgendaPreview />
      </AnimatedSection>

      <PartnerSpotlight />

      <div className="relative z-10 overflow-hidden rounded-t-[32px] shadow-[0_-24px_60px_rgba(0,8,74,0.18)] lg:motion-safe:-mt-[100vh]">
        <SponsorsSection />
      </div>
    </>
  )
}
