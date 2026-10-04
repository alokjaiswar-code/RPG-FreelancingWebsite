// components/DeliverableSubmissionModal.tsx
"use client";

import { useState, type FormEvent } from "react";
import type { DeliverableSubmission } from "@/types/missionWork";

interface DeliverableSubmissionModalProps {
  isOpen: boolean;
  missionTitle: string;
  onClose: () => void;
  onSubmit: (submission: DeliverableSubmission) => void;
}

export default function DeliverableSubmissionModal({
  isOpen,
  missionTitle,
  onClose,
  onSubmit,
}: DeliverableSubmissionModalProps) {
  const [links, setLinks] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function updateLink(index: number, value: string) {
    setLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
  }

  function addLinkField() {
    setLinks((prev) => [...prev, ""]);
  }

  function removeLinkField(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanedLinks = links.map((l) => l.trim()).filter(Boolean);

    if (cleanedLinks.length === 0) {
      setError("Add at least one work link before submitting.");
      return;
    }

    onSubmit({
      links: cleanedLinks,
      notes: notes.trim(),
      submittedAt: new Date().toISOString(),
    });

    setLinks([""]);
    setNotes("");
    setError(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-oak-dark/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deliverable-modal-title"
    >
      <div className="w-full max-w-md rounded-sm border border-parchment-shadow/60 bg-parchment p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2
              id="deliverable-modal-title"
              className="font-display text-lg font-semibold text-oak-dark"
            >
              Submit for Verification
            </h2>
            <p className="mt-0.5 font-body text-xs text-oak/60">{missionTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-display text-lg leading-none text-oak/50 hover:text-oak"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-body text-xs uppercase tracking-wide text-oak/60">
              Work Links
            </label>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 rounded-sm border border-oak/20 bg-parchment px-3 py-2 font-body text-sm text-oak-dark placeholder:text-oak/40 focus:border-oak/50 focus:outline-none"
                  />
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLinkField(index)}
                      aria-label="Remove link"
                      className="rounded-sm border border-oak/20 px-2 font-display text-sm text-oak/50 hover:text-oak"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLinkField}
              className="mt-2 font-body text-xs text-brass-dark hover:underline"
            >
              + Add another link
            </button>
          </div>

          <div>
            <label className="mb-1.5 block font-body text-xs uppercase tracking-wide text-oak/60">
              Notes for the Client
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Summarize what was delivered..."
              className="w-full resize-none rounded-sm border border-oak/20 bg-parchment px-3 py-2 font-body text-sm text-oak-dark placeholder:text-oak/40 focus:border-oak/50 focus:outline-none"
            />
          </div>

          {error && <p className="font-body text-xs text-rank-s">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-oak/20 px-4 py-2 font-display text-sm font-semibold text-oak/70 transition hover:bg-oak/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-sm bg-oak px-4 py-2 font-display text-sm font-semibold text-parchment shadow-sm transition hover:bg-oak-light active:translate-y-px"
            >
              Submit Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
