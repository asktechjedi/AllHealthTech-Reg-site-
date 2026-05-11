import HeroSection from '../components/home/HeroSection'
import StatsCounter from '../components/home/StatsCounter'
import HighlightsSection from '../components/home/HighlightsSection'
import FeaturedSpeakers from '../components/home/FeaturedSpeakers'
import AgendaPreview from '../components/home/AgendaPreview'
import SponsorsSection from '../components/home/SponsorsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <HighlightsSection />
      <FeaturedSpeakers />
      <AgendaPreview />
      <SponsorsSection />
    </>
  )
}
