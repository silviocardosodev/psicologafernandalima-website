"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X } from "lucide-react";

import { BrandMark } from "@/components/ui/BrandMark";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { ctaLabel, navItems, site, whatsappLink } from "@/lib/site";

const DRAWER_ID = "menu-mobile";
const SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;
const PILL_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

/** Elements made `inert` while the drawer is open (everything outside the dialog). */
const INERT_TARGETS = ["conteudo", "rodape", "floating-actions"];

/** Short helper line under each drawer item (≤ 4 words). */
const subtitles: Record<(typeof navItems)[number]["id"], string> = {
  "para-voce": "Isso fala de você?",
  sobre: "Quem vai te ouvir",
  "como-funciona": "Um passo por vez",
  duvidas: "Perguntas antes de começar",
};

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

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  // Only touch state when the boolean flips, not on every scroll frame.
  const scrolledRef = useRef(false);
  const syncScrolled = useCallback((y: number) => {
    const next = y > 8;
    if (next !== scrolledRef.current) {
      scrolledRef.current = next;
      setScrolled(next);
    }
  }, []);
  useMotionValueEvent(scrollY, "change", syncScrolled);
  useEffect(() => syncScrolled(window.scrollY), [syncScrolled]);

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

    // Make everything behind the dialog unreachable (keyboard, pointer, screen readers).
    const background = [
      headerRef.current,
      ...INERT_TARGETS.map((id) => document.getElementById(id)),
    ].filter((el): el is HTMLElement => el !== null);
    background.forEach((el) => el.setAttribute("inert", ""));

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
      // Remove inert before restoring focus to the (header) menu button.
      background.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (restoreFocusRef.current) menuButton?.focus({ preventScroll: true });
      restoreFocusRef.current = true;
    };
  }, [open]);

  const press = reduce ? { duration: 0 } : SPRING;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-line-soft bg-white/85 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-full items-center justify-between gap-2 sm:gap-4">
          <Wordmark />

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-0 xl:gap-0.5">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    {isActive && (
                      <m.span
                        layoutId="nav-active-pill"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-tint-lilac"
                        transition={reduce ? { duration: 0 } : PILL_SPRING}
                      />
                    )}
                    <Link
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative z-10 block rounded-full px-2.5 py-1.5 text-[14px] xl:px-3 whitespace-nowrap transition-colors duration-300 ease-out-soft focus-visible:shadow-focus",
                        isActive ? "text-primary" : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Same label and destination everywhere: always opens WhatsApp. Compact pill below lg
                (hidden under 390px, where it doesn't fit; the drawer keeps it). */}
            <m.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={press}
              className="hidden min-[390px]:block"
            >
              <ButtonLink
                href={whatsappLink()}
                external
                size="md"
                className="h-9 px-3.5 text-[13px] hover:translate-y-0 active:translate-y-0 sm:h-11 sm:px-5 sm:text-sm"
              >
                {ctaLabel}
              </ButtonLink>
            </m.div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls={DRAWER_ID}
              aria-haspopup="dialog"
              className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-tint-lilac focus-visible:shadow-focus lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">Abrir menu</span>
            </button>
          </div>
        </Container>

        {/* Reading progress */}
        <m.div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-progress"
          style={{ scaleX: reduce ? scrollYProgress : smoothProgress }}
        />
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            key="drawer"
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          >
            <div aria-hidden className="absolute inset-0 bg-primary-deep/15 backdrop-blur-sm" onClick={close} />
            <m.div
              ref={drawerRef}
              id={DRAWER_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col overflow-y-auto bg-white sm:rounded-l-[2rem]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between px-5 sm:px-6">
                <Wordmark onClick={closeForNavigation} />
                <button
                  type="button"
                  onClick={close}
                  className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-tint-lilac focus-visible:shadow-focus"
                >
                  <X className="size-5" aria-hidden />
                  <span className="sr-only">Fechar menu</span>
                </button>
              </div>

              <nav aria-label="Navegação mobile" className="px-3 pt-6 sm:px-4">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, index) => {
                    const isActive = active === item.id;
                    return (
                      <m.li
                        key={item.id}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={reduce ? { duration: 0 } : { ...SPRING, delay: 0.08 + index * 0.05 }}
                      >
                        <Link
                          href={`#${item.id}`}
                          onClick={closeForNavigation}
                          data-autofocus={index === 0 ? "" : undefined}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "group block rounded-2xl px-3 py-3 transition-colors duration-300 ease-out-soft focus-visible:shadow-focus",
                            isActive ? "bg-tint-lilac" : "hover:bg-tint-mist",
                          )}
                        >
                          <span
                            className={cn(
                              "block text-[22px] leading-tight font-[650] tracking-[-0.03em] transition-colors duration-300",
                              isActive ? "text-primary" : "text-ink group-hover:text-primary",
                            )}
                          >
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-sm text-ink-muted">{subtitles[item.id]}</span>
                        </Link>
                      </m.li>
                    );
                  })}
                </ul>
              </nav>

              <m.div
                className="mt-auto space-y-3 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { ...SPRING, delay: 0.08 + navItems.length * 0.05 }}
              >
                <ButtonLink href={whatsappLink()} external onClick={close} size="lg" className="w-full">
                  <WhatsAppIcon />
                  {ctaLabel}
                </ButtonLink>
                <p className="pt-2 text-center text-xs text-ink-muted">Psicóloga clínica · {site.crp}</p>
              </m.div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
