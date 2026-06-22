import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Overview" },
  { href: "/impact-items", label: "Impact Items" },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Sustainability Impact Logger
        </Link>

        <nav className="flex items-center gap-5">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-emerald-300"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/impact-items/new"
            className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            + Add item
          </Link>
        </nav>
      </div>
    </header>
  );
}