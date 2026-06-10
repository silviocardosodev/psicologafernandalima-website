import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { AboutMe } from "@/components/sections/AboutMe";
import { Benefits } from "@/components/sections/Benefits";
import { CTA } from "@/components/sections/CTA";
import { Hero } from "@/components/sections/Hero";
import { Identification } from "@/components/sections/Identification";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main>
        <Hero />
        <Identification />
        <AboutMe />
        <Benefits />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
