import { AboutSection } from '@/presentation/components/home/AboutSection'
import { FeaturedHotelsSection } from '@/presentation/components/home/FeaturedHotelsSection'
import { HeroSection } from '@/presentation/components/home/HeroSection'
import { PublicModulesSection } from '@/presentation/components/home/PublicModulesSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedHotelsSection />
      <PublicModulesSection />
      <AboutSection />
    </>
  )
}
