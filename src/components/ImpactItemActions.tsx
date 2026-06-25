"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  "PROPOSED",
  "APPROVED",
  "IMPLEMENTED",
  "ARCHIVED",
] as const;

type ImpactStatus = (typeof statuses)[number];

type ImpactItemActionsProps = {
  id: string;
  initialStatus: ImpactStatus;
};

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function ImpactItemActions({
  id,
  initialStatus,
}: ImpactItemActionsProps) {
  const router = useRouter();

  const [status, setStatus] = useState<ImpactStatus>(initialStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function updateStatus(newStatus: ImpactStatus) {
    setStatus(newStatus);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/impact-items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not update status.");
      }

      router.refresh();
    } catch {
      setStatus(initialStatus);
      alert("Could not update the status. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteItem() {
    const confirmed = window.confirm(
      "Delete this impact item? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/impact-items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete item.");
      }

      router.refresh();
    } catch {
      alert("Could not delete this item. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Status</span>

        <select
          value={status}
          disabled={isSaving || isDeleting}
          onChange={(event) =>
            updateStatus(event.target.value as ImpactStatus)
          }
          className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-200 outline-none focus:border-emerald-400 disabled:opacity-60"
        >
          {statuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {formatLabel(statusOption)}
            </option>
          ))}
        </select>

        {isSaving ? (
          <span className="text-xs text-slate-500">Saving...</span>
        ) : null}
      </div>

      <button
        type="button"
        disabled={isDeleting || isSaving}
        onClick={deleteItem}
        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}