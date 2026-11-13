"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, CalendarCheck, Menu, ShieldCheck, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { navItems, site, whatsappLink } from "@/lib/site";

const DRAWER_ID = "menu-mobile";

/** Tracks which nav section is currently crossing the middle band of the viewport. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const current = ids.find((id) => visible.get(id));
        setActive(current ?? null);
      },
      // A thin band around 40% of the viewport height decides the active section.
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="#inicio"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-md"
      aria-label={`${site.name}, Psicóloga — voltar ao início`}
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-hero text-[13px] font-bold tracking-[-0.02em] text-white shadow-primary transition-transform duration-200 group-hover:-rotate-3"
      >
        FL
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-bold tracking-[-0.03em] text-ink">{site.name}</span>
        <span className="mt-1 text-[11.5px] font-medium tracking-[-0.005em] text-ink-muted">
          Psicóloga · {site.crp}
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ids = useRef(navItems.map((item) => item.id)).current;
  const active = useActiveSection(ids);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));
  useEffect(() => setScrolled(window.scrollY > 8), []);

  // Restore focus to the menu button only for "dismiss" closes (Esc, close button, backdrop).
  // When a nav link is followed, focus should move with the navigation instead.
  const restoreFocusRef = useRef(true);
  const close = useCallback(() => {
    restoreFocusRef.current = true;
    setOpen(false);
  }, []);
  const closeForNavigation = useCallback(() => {
    restoreFocusRef.current = false;
    setOpen(false);
  }, []);

  // Drawer: body scroll lock, Esc to close, focus trap, restore focus.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = window.setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }, 30);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocusRef.current = true;
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    const menuButton = menuButtonRef.current;

    return () => {
      window.clearTimeout(focusFirst);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (restoreFocusRef.current) menuButton?.focus({ preventScroll: true });
      restoreFocusRef.current = true;
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-[var(--header-height)] border-b bg-white/80 backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow,background-color] duration-200",
          scrolled ? "border-line shadow-[0_1px_0_rgb(17_24_39/2%),0_8px_24px_rgb(17_24_39/4%)]" : "border-transparent",
        )}
      >
        <Container className="flex h-full items-center justify-between gap-6">
          <Wordmark />

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-line-soft bg-white/60 p-1">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-primary-100 ring-1 ring-primary-200"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <Link
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative z-10 block rounded-full px-3.5 py-1.5 text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-150",
                        isActive ? "text-primary-hover" : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink href="#agendar" size="md" className="hidden sm:inline-flex">
              <CalendarCheck className="size-4" aria-hidden />
              Agendar sessão
            </ButtonLink>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls={DRAWER_ID}
              aria-haspopup="dialog"
              className="grid size-10 place-items-center rounded-md border border-line bg-surface text-ink shadow-xs transition-colors duration-150 hover:bg-surface-hover focus-visible:shadow-focus lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">Abrir menu</span>
            </button>
          </div>
        </Container>

        {/* Reading progress */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-progress"
          style={{ scaleX: reduce ? scrollYProgress : smoothProgress }}
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <div aria-hidden className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={close} />
            <motion.div
              ref={drawerRef}
              id={DRAWER_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-y-auto bg-surface shadow-raised sm:rounded-l-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reduce ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-line-soft px-5 sm:px-6">
                <Wordmark onClick={closeForNavigation} />
                <button
                  type="button"
                  onClick={close}
                  className="grid size-10 place-items-center rounded-md border border-line bg-surface text-ink transition-colors duration-150 hover:bg-surface-hover focus-visible:shadow-focus"
                >
                  <X className="size-5" aria-hidden />
                  <span className="sr-only">Fechar menu</span>
                </button>
              </div>

              <nav aria-label="Navegação mobile" className="px-3 pt-4 sm:px-4">
                <ul className="flex flex-col">
                  {navItems.map((item, index) => {
                    const isActive = active === item.id;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={reduce ? { duration: 0 } : { delay: 0.06 + index * 0.04, duration: 0.24 }}
                      >
                        <Link
                          href={`#${item.id}`}
                          onClick={closeForNavigation}
                          data-autofocus={index === 0 ? "" : undefined}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "group flex items-center gap-4 rounded-lg px-3 py-3.5 transition-colors duration-150",
                            isActive ? "bg-primary-100" : "hover:bg-surface-hover",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "w-6 text-xs font-semibold tabular-nums tracking-[0.02em]",
                              isActive ? "text-primary" : "text-ink-muted",
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "flex-1 text-[22px] font-semibold tracking-[-0.03em]",
                              isActive ? "text-primary-hover" : "text-ink",
                            )}
                          >
                            {item.label}
                          </span>
                          <ArrowUpRight
                            aria-hidden
                            className="size-4 text-ink-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-auto space-y-3 border-t border-line-soft p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
                <ButtonLink href="#agendar" onClick={closeForNavigation} size="lg" className="w-full">
                  <CalendarCheck className="size-4" aria-hidden />
                  Agendar sessão
                </ButtonLink>
                <ButtonLink href={whatsappLink()} external variant="whatsapp" size="lg" className="w-full">
                  <WhatsAppIcon className="size-5" />
                  Conversar no WhatsApp
                </ButtonLink>
                <p className="flex items-center justify-center gap-2 pt-2 text-xs text-ink-muted">
                  <ShieldCheck className="size-3.5 text-primary" aria-hidden />
                  Psicóloga clínica · {site.crp} · Atendimento online
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
