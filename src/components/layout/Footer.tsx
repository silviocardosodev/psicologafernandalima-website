import Link from "next/link";

const footerLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#para-quem-e", label: "Para quem é" },
  { href: "#sobre", label: "Sobre" },
  { href: "#agendar", label: "Agendar" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-[family:var(--font-heading)] text-2xl font-semibold text-text-main">
              Fernanda Lima Psicóloga
            </p>
            <p className="text-sm text-text-muted">CRP: 06/192404</p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-muted">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 hover:text-text-main"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Fernanda Lima Psicóloga. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
