import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/sections/Hero";
import { Identify } from "@/components/sections/Identify";
import { Turning } from "@/components/sections/Turning";
import { AboutMe } from "@/components/sections/AboutMe";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { Booking } from "@/components/sections/Booking";
import { QuoteCards } from "@/components/sections/QuoteCards";
import { faqItems } from "@/lib/faq";
import { quotes } from "@/lib/quotes";

const homeQuotes = ["vida-boa-pesa", "nem-todo-pensamento", "descansar"]
  .map((id) => quotes.find((q) => q.id === id))
  .filter((q) => q !== undefined);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Identify />
        <Turning />
        <AboutMe />
        <HowItWorks />
        <QuoteCards items={homeQuotes} />
        <FAQ />
        <Booking />
      </main>
      <Footer />
      <FloatingActions />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
