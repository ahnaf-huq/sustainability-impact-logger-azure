import ImpactItemForm from "@/components/ImpactItemForm";

export default function NewImpactItemPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-300">
          New decision
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Add an impact item
        </h1>

        <p className="mt-2 text-slate-400">
          Record a software engineering decision and assess its expected
          sustainability impact.
        </p>
      </div>

      <ImpactItemForm />
    </main>
  );
}