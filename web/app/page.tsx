import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/marketing/Hero";
import TrustedBy from "@/components/marketing/TrustedBy";
import Features from "@/components/marketing/Features";
import AIEmployees from "@/components/marketing/AIEmployees";
import HowItWorks from "@/components/marketing/HowItWorks";
import Demo from "@/components/marketing/Demo";
import Pricing from "@/components/marketing/Pricing";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <AIEmployees />
        <HowItWorks />
        <Demo />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
