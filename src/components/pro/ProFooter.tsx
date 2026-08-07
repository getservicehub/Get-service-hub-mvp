import Link from "next/link";

export function ProFooter() {
  const columns = [
    { href: "/", label: "GetServiHub" },
    { href: "/pro", label: "GetServiHub Pro" },
    { href: "/pro#how-it-works", label: "Cómo funciona" },
    { href: "/pro#trust", label: "Confianza y seguridad" },
    { href: "/pro/join", label: "Para profesionales" },
    { href: "/terms", label: "Términos" },
    { href: "/privacy", label: "Privacidad" },
    { href: "/contact", label: "Contacto" },
  ];
  return (
    <footer className="border-t border-[var(--pro-line)] px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--pro-text-muted)]">
          {columns.map((c) => (
            <Link key={c.href} href={c.href} className="hover:text-[var(--pro-text)]">{c.label}</Link>
          ))}
        </div>
        <p className="text-xs text-[var(--pro-text-muted)]">
          GetServiHub Pro es una experiencia dentro del ecosistema GetServiHub.
        </p>
      </div>
    </footer>
  );
}
