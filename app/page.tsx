import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import VideoScrollSection from "./components/VideoScrollSection";
import Gallery from "./components/Gallery";
import Materials from "./components/Materials";
import HowItWorks from "./components/HowItWorks";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <VideoScrollSection />
        <Gallery />
        <Materials />
        <HowItWorks />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
