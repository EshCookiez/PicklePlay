import HeroCarousel from "@/components/HeroCarousel";
import ExperienceSection from "@/components/ExperienceSection";
import CourtsSection from "@/components/CourtsSection";
import MapSection from "@/components/MapSection";
import DownloadAppSection from "@/components/DownloadAppSection";
import FeaturesSection from "@/components/FeaturesSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <>
      <ScrollToTop />
      <HeroCarousel />
      <ExperienceSection />
      <CourtsSection />
      <MapSection />
      <DownloadAppSection />
      <FeaturesSection />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
