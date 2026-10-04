// components/CreateMissionModal.tsx
"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Mission, Rank } from "@/types/guild";

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (mission: Mission) => void;
  /** Name shown as the poster of the quest — swap for the real client/session name. */
  postedBy?: string;
}

const RANK_OPTIONS: Rank[] = ["S", "A", "B", "C", "D"];

function defaultDeadlineIso(daysFromNow = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

function newMissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `quest-${crypto.randomUUID()}`;
  }
  return `quest-${Date.now()}`;
}

export default function CreateMissionModal({
  isOpen,
  onClose,
  onCreate,
  postedBy = "You (Guild Client)",
}: CreateMissionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState("");
  const [requiredRank, setRequiredRank] = useState<Rank>("D");
  const [error, setError] = useState<string | null>(null);

  // Reset the form each time the modal is freshly opened.
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setBounty("");
      setRequiredRank("D");
      setError(null);
    }
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const bountyValue = Number(bounty);

    if (!trimmedTitle) {
      setError("Give the quest a title.");
      return;
    }
    if (!bounty || Number.isNaN(bountyValue) || bountyValue <= 0) {
      setError("Bounty must be a positive number.");
      return;
    }

    const newMission: Mission = {
      id: newMissionId(),
      title: trimmedTitle,
      description: description.trim() || "No further details provided.",
      bounty: bountyValue,
      requiredRank,
      status: "open",
      timer: defaultDeadlineIso(),
      postedBy,
    };

    onCreate(newMission);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-oak-dark/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-mission-heading"
        className="w-full max-w-lg rounded-md border-2 border-brass/70 bg-parchment shadow-[0_0_30px_rgba(0,0,0,0.5)]"
      >
        {/* Header plaque */}
        <div className="flex items-center justify-between rounded-t-sm bg-gradient-to-b from-oak-light to-oak border-b-2 border-brass/60 px-5 py-3">
          <h2
            id="create-mission-heading"
            className="font-display text-lg font-bold text-brass-light"
          >
            Post a New Quest
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-sm px-2 py-1 font-display text-lg leading-none text-parchment/70 transition hover:bg-oak-dark hover:text-parchment"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {error && (
            <p className="rounded-sm border border-red-700/40 bg-red-900/10 px-3 py-2 font-body text-sm text-red-800">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="quest-title"
              className="mb-1 block font-body text-xs font-semibold uppercase tracking-wide text-oak/70"
            >
              Quest Title
            </label>
            <input
              id="quest-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fortify the Payment Gateway"
              className="w-full rounded-sm border border-oak/25 bg-white/60 px-3 py-2 font-body text-sm text-oak-dark shadow-inner outline-none focus:border-brass focus:ring-2 focus:ring-brass/30"
            />
          </div>

          <div>
            <label
              htmlFor="quest-description"
              className="mb-1 block font-body text-xs font-semibold uppercase tracking-wide text-oak/70"
            >
              Description
            </label>
            <textarea
              id="quest-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What does this quest actually involve?"
              className="w-full resize-none rounded-sm border border-oak/25 bg-white/60 px-3 py-2 font-body text-sm text-oak-dark shadow-inner outline-none focus:border-brass focus:ring-2 focus:ring-brass/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="quest-bounty"
                className="mb-1 block font-body text-xs font-semibold uppercase tracking-wide text-oak/70"
              >
                Bounty ($)
              </label>
              <input
                id="quest-bounty"
                type="number"
                min={1}
                value={bounty}
                onChange={(e) => setBounty(e.target.value)}
                placeholder="1200"
                className="w-full rounded-sm border border-oak/25 bg-white/60 px-3 py-2 font-mono text-sm text-oak-dark shadow-inner outline-none focus:border-brass focus:ring-2 focus:ring-brass/30"
              />
            </div>

            <div>
              <label
                htmlFor="quest-rank"
                className="mb-1 block font-body text-xs font-semibold uppercase tracking-wide text-oak/70"
              >
                Required Rank
              </label>
              <select
                id="quest-rank"
                value={requiredRank}
                onChange={(e) => setRequiredRank(e.target.value as Rank)}
                className="w-full rounded-sm border border-oak/25 bg-white/60 px-3 py-2 font-display text-sm font-semibold text-oak-dark shadow-inner outline-none focus:border-brass focus:ring-2 focus:ring-brass/30"
              >
                {RANK_OPTIONS.map((rank) => (
                  <option key={rank} value={rank}>
                    Rank {rank}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm px-4 py-2 font-display text-sm font-semibold text-oak/60 transition hover:bg-oak/10 hover:text-oak"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-sm bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-2 font-display text-sm font-bold text-oak-dark shadow-md shadow-amber-500/20 transition hover:shadow-lg hover:shadow-amber-500/40 active:translate-y-px"
            >
              Post Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
