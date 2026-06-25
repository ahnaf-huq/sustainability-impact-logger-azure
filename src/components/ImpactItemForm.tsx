"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const impactAreas = [
  "ENVIRONMENTAL",
  "SOCIAL",
  "ECONOMIC",
  "TECHNICAL",
  "INDIVIDUAL",
];

const impactLevels = ["LOW", "MEDIUM", "HIGH"];

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function ImpactItemForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      impactArea: String(formData.get("impactArea") ?? ""),
      likelihood: String(formData.get("likelihood") ?? ""),
      severity: String(formData.get("severity") ?? ""),
    };

    try {
      const response = await fetch("/api/impact-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Could not create the impact item.");
      }

      router.push("/impact-items");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Decision title
        </label>

        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={120}
          placeholder="Example: Introduce automated test coverage"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          required
          minLength={5}
          maxLength={1000}
          rows={5}
          placeholder="Describe the software decision and its expected sustainability impact."
          className="w-full resize-y rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="impactArea"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Impact area
          </label>

          <select
            id="impactArea"
            name="impactArea"
            defaultValue="ENVIRONMENTAL"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-emerald-400"
          >
            {impactAreas.map((area) => (
              <option key={area} value={area}>
                {formatLabel(area)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="likelihood"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Likelihood
          </label>

          <select
            id="likelihood"
            name="likelihood"
            defaultValue="MEDIUM"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-emerald-400"
          >
            {impactLevels.map((level) => (
              <option key={level} value={level}>
                {formatLabel(level)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="severity"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Severity
          </label>

          <select
            id="severity"
            name="severity"
            defaultValue="MEDIUM"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-emerald-400"
          >
            {impactLevels.map((level) => (
              <option key={level} value={level}>
                {formatLabel(level)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/impact-items")}
          className="rounded-md border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save impact item"}
        </button>
      </div>
    </form>
  );
}