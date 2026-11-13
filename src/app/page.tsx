import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/sections/Hero";
import { Identification } from "@/components/sections/Identification";
import { Areas } from "@/components/sections/Areas";
import { Journey } from "@/components/sections/Journey";
import { AboutMe } from "@/components/sections/AboutMe";
import { OnlineTherapy } from "@/components/sections/OnlineTherapy";
import { FAQ } from "@/components/sections/FAQ";
import { Booking } from "@/components/sections/Booking";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Identification />
        <Areas />
        <Journey />
        <AboutMe />
        <OnlineTherapy />
        <FAQ />
        <Booking />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
