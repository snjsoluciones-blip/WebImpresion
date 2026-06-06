import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import VideoScrollSection from "./components/VideoScrollSection";
import Gallery from "./components/Gallery";
import HowItWorks from "./components/HowItWorks";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <VideoScrollSection />
        <Gallery />
        <HowItWorks />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
