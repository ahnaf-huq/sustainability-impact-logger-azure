import ImpactItemActions from "@/components/ImpactItemActions";

type ImpactItem = {
  id: string;
  title: string;
  description: string;
  impactArea: string;
  likelihood: string;
  severity: string;
  status: "PROPOSED" | "APPROVED" | "IMPLEMENTED" | "ARCHIVED";
  createdAt: Date;
};

type ImpactItemCardProps = {
  item: ImpactItem;
};

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function getStatusStyle(status: string) {
  const styles: Record<string, string> = {
    PROPOSED: "border-amber-700 bg-amber-950/60 text-amber-300",
    APPROVED: "border-blue-700 bg-blue-950/60 text-blue-300",
    IMPLEMENTED: "border-emerald-700 bg-emerald-950/60 text-emerald-300",
    ARCHIVED: "border-slate-700 bg-slate-800 text-slate-400",
  };

  return styles[status] ?? styles.PROPOSED;
}

export default function ImpactItemCard({ item }: ImpactItemCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-slate-700">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{item.title}</h2>

          <p className="mt-1 text-sm text-slate-400">
            Logged on{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(item.createdAt)}
          </p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
            item.status
          )}`}
        >
          {formatLabel(item.status)}
        </span>
      </div>

      <p className="mb-5 leading-6 text-slate-300">{item.description}</p>

      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
          Area: {formatLabel(item.impactArea)}
        </span>

        <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
          Likelihood: {formatLabel(item.likelihood)}
        </span>

        <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
          Severity: {formatLabel(item.severity)}
        </span>
      </div>

      <ImpactItemActions
        id={item.id}
        initialStatus={item.status}
      />
    </article>
  );
}