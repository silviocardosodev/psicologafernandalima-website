"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, LayoutDashboard, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/mapa-de-calor", label: "Mapa de calor", icon: Flame },
  { href: "/admin/contatos", label: "Contatos", icon: Users },
];

export function AdminNav({ newLeads }: { newLeads: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Painel">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "bg-primary-100 text-primary-deep" : "text-ink-soft hover:bg-tint-mist hover:text-ink",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {label}
                {href === "/admin/contatos" && newLeads > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
                    {newLeads}
                    <span className="sr-only"> novos</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
