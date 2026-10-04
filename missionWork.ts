// types/missionWork.ts
// Supplemental types for the Active Mission Work Dashboard.
// These sit alongside types/guild.ts (Mission, Rank, etc.) without touching it.

export type KanbanColumn = "todo" | "in-progress" | "review";

export interface MissionTask {
  id: string;
  title: string;
  notes?: string;
  column: KanbanColumn;
}

export interface TimeLogEntry {
  id: string;
  /** Duration of this logged session, in seconds. */
  seconds: number;
  /** ISO timestamp of when the session was stopped and banked. */
  loggedAt: string;
  note?: string;
}

export interface DeliverableSubmission {
  links: string[];
  notes: string;
  submittedAt: string;
}
