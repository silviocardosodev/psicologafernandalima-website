"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";

import { BrandMark } from "@/components/ui/BrandMark";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
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

function Wordmark({ onClick }: { onClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <Link
      href="#inicio"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md"
      aria-label={`${site.name}, Psicóloga — voltar ao início`}
    >
      <BrandMark className="w-7" />
      <span className="flex flex-col leading-none">
        <span className="text-[16px] font-medium text-ink">{site.name}</span>
        <span className="mt-1 text-[11px] text-ink-muted">Psicóloga</span>
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

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));
  useEffect(() => setScrolled(window.scrollY > 8), []);

  // Restore focus to the menu button only for "dismiss" closes (Esc, close button, backdrop).
  // When a nav link is followed, focus should move with the navigation instead.
  const restoreFocusRef = useRef(true);
  const close = useCallback(() => {
    restoreFocusRef.current = true;
    setOpen(false);
  }, []);
  const closeForNavigation = useCallback((event?: { currentTarget: EventTarget }) => {
    restoreFocusRef.current = false;
    setOpen(false);

    // Move focus to the hash target so keyboard / screen-reader users continue from the
    // section they navigated to instead of being dropped on <body> when the drawer unmounts.
    const href = (event?.currentTarget as HTMLElement | undefined)?.getAttribute?.("href") ?? "";
    const id = href.startsWith("#") ? href.slice(1) : "";
    if (!id) return;
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, 60);
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
          "fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-line-soft bg-white/85 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-full items-center justify-between gap-6">
          <Wordmark />

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative block rounded-sm py-1 text-[14.5px] transition-colors duration-150",
                        isActive ? "text-primary" : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary transition-opacity duration-200",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink href="#agendar" size="md" className="hidden sm:inline-flex">
              Agendar
            </ButtonLink>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls={DRAWER_ID}
              aria-haspopup="dialog"
              className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-white/70 focus-visible:shadow-focus lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">Abrir menu</span>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <div aria-hidden className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={close} />
            <motion.div
              ref={drawerRef}
              id={DRAWER_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col overflow-y-auto bg-white sm:rounded-l-3xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between px-5 sm:px-6">
                <Wordmark onClick={closeForNavigation} />
                <button
                  type="button"
                  onClick={close}
                  className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-hover focus-visible:shadow-focus"
                >
                  <X className="size-5" aria-hidden />
                  <span className="sr-only">Fechar menu</span>
                </button>
              </div>

              <nav aria-label="Navegação mobile" className="px-5 pt-8 sm:px-6">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, index) => {
                    const isActive = active === item.id;
                    return (
                      <li key={item.id}>
                        <Link
                          href={`#${item.id}`}
                          onClick={closeForNavigation}
                          data-autofocus={index === 0 ? "" : undefined}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "block rounded-lg py-2.5 text-[28px] leading-tight font-normal tracking-[-0.02em] transition-colors duration-150",
                            isActive ? "text-primary" : "text-ink hover:text-primary",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-auto space-y-5 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6">
                <ButtonLink href={whatsappLink()} external size="lg" className="w-full">
                  Agendar pelo WhatsApp
                </ButtonLink>
                <p className="text-center text-xs text-ink-muted">Psicóloga clínica · {site.crp}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
