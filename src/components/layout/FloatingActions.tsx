"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/site";

const WHATSAPP_AFTER = 600;
const TOP_AFTER = 1400;

export function FloatingActions() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [farDown, setFarDown] = useState(false);
  const [bookingInView, setBookingInView] = useState(false);

  const sync = (value: number) => {
    setPastHero(value > WHATSAPP_AFTER);
    setFarDown(value > TOP_AFTER);
  };
  useMotionValueEvent(scrollY, "change", sync);
  useEffect(() => sync(window.scrollY), []);

  // Hide the WhatsApp FAB while the booking section (which has its own CTA) is visible.
  useEffect(() => {
    const target = document.getElementById("agendar");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setBookingInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const showWhatsApp = pastHero && !bookingInView;
  const showTop = farDown;

  const pop = {
    initial: { opacity: 0, y: 12, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 12, scale: 0.9 },
    transition: { duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] as const },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move focus to the top of the page for keyboard and screen reader users.
    const main = document.getElementById("inicio") ?? document.body;
    if (main instanceof HTMLElement && main !== document.body) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
    }
  };

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
    >
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            onClick={scrollToTop}
            {...pop}
            className="pointer-events-auto grid size-11 place-items-center rounded-full border border-line bg-white/90 text-ink-soft shadow-raised backdrop-blur-md transition-colors duration-150 hover:bg-white hover:text-primary focus-visible:shadow-focus"
          >
            <ArrowUp className="size-[18px]" aria-hidden />
            <span className="sr-only">Voltar ao topo</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWhatsApp && (
          <motion.a
            key="whatsapp"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale comigo pelo WhatsApp (abre em nova aba)"
            {...pop}
            className="group pointer-events-auto relative flex h-14 items-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_rgb(15_122_59/35%)] transition-colors duration-150 hover:bg-whatsapp-hover focus-visible:shadow-focus focus-visible:outline-offset-4"
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp opacity-25 [animation-duration:2.4s] [animation-iteration-count:3] motion-reduce:hidden"
            />
            <span
              aria-hidden
              className="grid max-w-0 overflow-hidden text-[14.5px] font-semibold tracking-[-0.01em] whitespace-nowrap opacity-0 transition-[max-width,opacity,padding] duration-200 ease-out md:group-hover:max-w-[140px] md:group-hover:pl-5 md:group-hover:opacity-100 md:group-focus-visible:max-w-[140px] md:group-focus-visible:pl-5 md:group-focus-visible:opacity-100"
            >
              Fale comigo
            </span>
            <span className="grid size-14 shrink-0 place-items-center">
              <WhatsAppIcon className="size-7" />
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
