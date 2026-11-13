import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/sections/Hero";
import { Help } from "@/components/sections/Help";
import { Journey } from "@/components/sections/Journey";
import { AboutMe } from "@/components/sections/AboutMe";
import { FAQ } from "@/components/sections/FAQ";
import { Booking } from "@/components/sections/Booking";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Help />
        <Journey />
        <AboutMe />
        <FAQ />
        <Booking />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
