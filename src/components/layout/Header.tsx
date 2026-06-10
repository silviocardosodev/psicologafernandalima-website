"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "#inicio", label: "Início" },
  { href: "#para-quem-e", label: "Para quem é" },
  { href: "#sobre", label: "Sobre" },
  { href: "#agendar", label: "Agendar" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop || isOpen) {
        setIsMobileHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY <= 24) {
        setIsMobileHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsMobileHeaderVisible(false);
      } else {
        setIsMobileHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-white/70 bg-white/82 backdrop-blur-xl transition-transform duration-300 lg:translate-y-0 ${
          isMobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link
            href="#inicio"
            className="font-[family:var(--font-heading)] text-3xl font-semibold tracking-[0.02em] text-text-main"
          >
            Fernanda Lima
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <nav className="flex items-center gap-5 text-sm text-text-muted">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors duration-200 hover:text-text-main"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="#agendar"
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(142,116,255,0.94),rgba(184,167,255,0.92))] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(142,116,255,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Agendar sessão
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-soft bg-white text-text-main shadow-[0_8px_24px_rgba(28,28,30,0.04)] transition-colors duration-200 hover:bg-background-soft lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-all duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={closeMenu}
          className={`absolute inset-0 bg-[rgba(28,28,30,0.28)] backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[min(86vw,24rem)] flex-col border-l border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,251,255,0.96))] px-6 py-6 shadow-[-18px_0_50px_rgba(28,28,30,0.08)] transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-[family:var(--font-heading)] text-2xl font-semibold text-text-main">
              Fernanda Lima
            </p>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fechar menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-white text-text-main"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-2xl border border-transparent px-4 py-3 text-base font-medium text-text-main transition-colors duration-200 hover:border-border-soft hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="#agendar"
            onClick={closeMenu}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(142,116,255,0.94),rgba(184,167,255,0.92))] px-5 py-3.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(142,116,255,0.16)]"
          >
            Agendar sessão
          </Link>
        </aside>
      </div>
    </>
  );
}
