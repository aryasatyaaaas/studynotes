import { Navbar } from "@/components/landing/Navbar"
import { ScrollProgress } from "@/components/landing/ScrollProgress"
import { HeroSection } from "@/components/landing/HeroSection"
import { HighlightBar } from "@/components/landing/HighlightBar"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { TechStackSection } from "@/components/landing/TechStackSection"
import { StatsSection } from "@/components/landing/StatsSection"
import { OpenSourceSection } from "@/components/landing/OpenSourceSection"
import { FaqSection } from "@/components/landing/FaqSection"
import { CtaSection } from "@/components/landing/CtaSection"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
    return (
        <main className="bg-background text-foreground overflow-x-hidden">
            <ScrollProgress />
            <Navbar />
            <HeroSection />
            <HighlightBar />
            <FeaturesSection />
            <HowItWorks />
            <TechStackSection />
            <StatsSection />
            <OpenSourceSection />
            <FaqSection />
            <CtaSection />
            <Footer />
        </main>
    )
}
