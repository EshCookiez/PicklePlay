import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ExperienceSection from "@/components/ExperienceSection";
import CourtsSection from "@/components/CourtsSection";
import MapSection from "@/components/MapSection";
import FeaturesSection from "@/components/FeaturesSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a56a7] via-blue-50 to-white">
      <ScrollToTop />
      <Header />
      <HeroCarousel />
      <ExperienceSection />
      <CourtsSection />
      <MapSection />
      <FeaturesSection />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
