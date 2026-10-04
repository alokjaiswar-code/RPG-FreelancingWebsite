"use client";

import { useMemo, useState } from "react";
import MissionCard from "@/components/MissionCard";
import { mockMissions, mockUser } from "@/lib/mockData";
import type { Mission, Rank } from "@/types/guild";

const ALL_RANKS: Rank[] = ["S", "A", "B", "C", "D"];

type StatusFilter = "all" | "open" | "in-progress" | "completed";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Postings" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Verified" },
];

const RANK_DOT_COLORS: Record<Rank, string> = {
  S: "bg-rank-s",
  A: "bg-rank-a",
  B: "bg-rank-b",
  C: "bg-rank-c",
  D: "bg-rank-d",
};

export default function MissionBoardPage() {
  const [selectedRanks, setSelectedRanks] = useState<Set<Rank>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  function toggleRank(rank: Rank) {
    setSelectedRanks((prev) => {
      const next = new Set(prev);
      if (next.has(rank)) {
        next.delete(rank);
      } else {
        next.add(rank);
      }
      return next;
    });
  }

  const filteredMissions = useMemo(() => {
    return mockMissions.filter((mission: Mission) => {
      const rankMatch =
        selectedRanks.size === 0 || selectedRanks.has(mission.requiredRank);
      const statusMatch =
        statusFilter === "all" || mission.status === statusFilter;
      return rankMatch && statusMatch;
    });
  }, [selectedRanks, statusFilter]);

  function handleAcceptQuest(missionId: string) {
    console.log(`Accepted quest ${missionId}`);
  }
  function handleSubmitProposal(missionId: string) {
    console.log(`Submitted proposal for quest ${missionId}`);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-oak-dark">
          Mission Board
        </h1>
        <p className="mt-1 font-body text-sm text-oak/70">
          Postings pinned by clients across the guild. Claim what your rank
          allows, or track the quests already underway.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 space-y-4 rounded-sm border border-parchment-shadow/60 bg-parchment-dark/40 p-4 shadow-sm">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-1 border-b border-oak/10 pb-3">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-sm px-3 py-1.5 font-display text-sm font-semibold transition ${
                  active
                    ? "bg-oak text-parchment shadow-sm"
                    : "text-oak/60 hover:bg-oak/10 hover:text-oak"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Rank chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-body text-xs uppercase tracking-wide text-oak/60">
            Rank required
          </span>
          {ALL_RANKS.map((rank) => {
            const active = selectedRanks.has(rank);
            return (
              <button
                key={rank}
                type="button"
                onClick={() => toggleRank(rank)}
                aria-pressed={active}
                className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold transition ${
                  RANK_DOT_COLORS[rank]
                } ${
                  active
                    ? "text-parchment ring-2 ring-oak ring-offset-2 ring-offset-parchment-dark"
                    : "text-parchment/70 opacity-50 hover:opacity-90"
                }`}
              >
                {rank}
              </button>
            );
          })}
          {selectedRanks.size > 0 && (
            <button
              type="button"
              onClick={() => setSelectedRanks(new Set())}
              className="ml-1 font-body text-xs text-oak/50 underline-offset-2 hover:text-oak hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Mission grid */}
      {filteredMissions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              userRank={mockUser.rank}
              userId={mockUser.id}
              onAcceptQuest={handleAcceptQuest}
              onSubmitProposal={handleSubmitProposal}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-oak/20 py-16 text-center font-body text-sm text-oak/50">
          No postings match those filters. Try clearing a rank or checking a
          different status.
        </div>
      )}
    </div>
  );
}