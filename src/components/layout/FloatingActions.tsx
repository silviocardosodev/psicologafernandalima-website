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
            className="pointer-events-auto grid size-11 place-items-center rounded-full border border-line bg-white text-ink-soft transition-colors duration-150 hover:border-line-hover hover:text-ink focus-visible:shadow-focus"
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
            className="pointer-events-auto grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_6px_20px_rgb(15_122_59/18%)] transition-colors duration-150 hover:bg-whatsapp-hover focus-visible:shadow-focus focus-visible:outline-offset-4"
          >
            <WhatsAppIcon className="size-7" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
