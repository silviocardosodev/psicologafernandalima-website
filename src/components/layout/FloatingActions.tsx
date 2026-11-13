"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/site";

const TOP_AFTER = 1200;
const SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;

/** Soft pulse ring keyframes (scoped name). Runs 3 cycles only (WCAG 2.2.2); hidden under reduced motion. */
const pulseCss = `@keyframes fl-fab-pulse{0%{transform:scale(1);opacity:.45}70%,100%{transform:scale(1.55);opacity:0}}`;

export function FloatingActions() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [farDown, setFarDown] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setFarDown(value > TOP_AFTER));
  useEffect(() => setFarDown(window.scrollY > TOP_AFTER), []);

  const spring = reduce ? { duration: 0 } : SPRING;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move focus to the top of the page for keyboard and screen reader users.
    const top = document.getElementById("inicio");
    if (top) {
      top.setAttribute("tabindex", "-1");
      top.focus({ preventScroll: true });
      top.addEventListener("blur", () => top.removeAttribute("tabindex"), { once: true });
    }
  };

  return (
    <div id="floating-actions" className="pointer-events-none fixed right-[calc(1.25rem+env(safe-area-inset-right))] bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-end gap-3">
      <style>{pulseCss}</style>

      <AnimatePresence>
        {farDown && (
          <motion.button
            key="top"
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.8 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            className="pointer-events-auto mr-1 grid size-12 place-items-center rounded-full border border-line bg-white text-ink-soft shadow-[0_6px_20px_rgb(79_70_229/8%)] transition-colors duration-300 hover:border-primary-200 hover:text-primary focus-visible:shadow-focus"
          >
            <ArrowUp className="size-[18px]" aria-hidden />
            <span className="sr-only">Voltar ao topo</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale comigo pelo WhatsApp (abre em nova aba)"
        whileTap={{ scale: 0.95 }}
        transition={spring}
        className="group pointer-events-auto relative flex h-14 items-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_rgb(15_122_59/24%)] transition-colors duration-300 hover:bg-whatsapp-hover focus-visible:shadow-focus focus-visible:outline-offset-4"
      >
        {/* Label expands to the left on hover / keyboard focus */}
        <span
          aria-hidden
          className="max-w-0 overflow-hidden pl-0 text-[15px] font-medium whitespace-nowrap opacity-0 transition-[max-width,padding,opacity] duration-500 ease-out-soft group-hover:max-w-[9rem] group-hover:pl-5 group-hover:opacity-100 group-focus-visible:max-w-[9rem] group-focus-visible:pl-5 group-focus-visible:opacity-100"
        >
          Fale comigo
        </span>
        <span className="relative grid size-14 shrink-0 place-items-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-whatsapp motion-reduce:hidden"
            style={{ animation: "fl-fab-pulse 3.2s cubic-bezier(0.22,1,0.36,1) 1.5s 3 both" }}
          />
          <WhatsAppIcon className="relative size-7" />
        </span>
      </motion.a>
    </div>
  );
}
