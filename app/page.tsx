import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import CapabilitiesMarquee from "./components/CapabilitiesMarquee";
import Services from "./components/Services";
import VideoScrollSection from "./components/VideoScrollSection";
import Gallery from "./components/Gallery";
import Technology from "./components/Technology";
import Materials from "./components/Materials";
import HowItWorks from "./components/HowItWorks";
import Team from "./components/Team";
import Faq from "./components/Faq";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import MobileActionBar from "./components/MobileActionBar";
import { QuoteProvider } from "./components/ui/quote-context";
import GrainOverlay from "./components/ui/GrainOverlay";

export default function Home() {
  return (
    <QuoteProvider>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:px-4 focus:py-2 focus:rounded-full focus:bg-white focus:text-black focus:text-sm focus:font-medium"
      >
        Ir al contenido
      </a>
      <div className="site-root">
        <Header />
        {/* .no-x usa overflow-x:clip (nunca hidden): hidden rompería el sticky de VideoScrollSection */}
        <main id="contenido" className="no-x">
          <Hero />
          <TrustStrip />
          <CapabilitiesMarquee />
          <Services />
          <VideoScrollSection />
          <Gallery />
          <Technology />
          <Materials />
          <HowItWorks />
          <Team />
          <Faq />
          <ContactForm />
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileActionBar />
        <GrainOverlay />
      </div>
    </QuoteProvider>
  );
}
