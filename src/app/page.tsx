import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [totalItems, proposedItems, implementedItems, recentItems] =
    await Promise.all([
      prisma.impactItem.count(),
      prisma.impactItem.count({
        where: {
          status: "PROPOSED",
        },
      }),
      prisma.impactItem.count({
        where: {
          status: "IMPLEMENTED",
        },
      }),
      prisma.impactItem.findMany({
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Cloud-ready sustainability tracker
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
          Make sustainability-related software decisions visible.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Log engineering decisions, assess expected impact, and track progress
          from proposal to implementation.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/impact-items/new"
            className="rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Add impact item
          </Link>

          <Link
            href="/impact-items"
            className="rounded-md border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            View all items
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total impact items</p>
          <p className="mt-2 text-3xl font-bold text-white">{totalItems}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Proposed decisions</p>
          <p className="mt-2 text-3xl font-bold text-amber-300">
            {proposedItems}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Implemented decisions</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">
            {implementedItems}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Latest impact items
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Your most recently logged engineering decisions.
            </p>
          </div>

          <Link
            href="/impact-items"
            className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            View all →
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
            <p className="font-medium text-slate-200">
              No impact items logged yet.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Start by recording a software decision and its expected impact.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
                  {item.impactArea.toLowerCase()}
                </p>

                <h3 className="mt-2 font-semibold text-white">{item.title}</h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}