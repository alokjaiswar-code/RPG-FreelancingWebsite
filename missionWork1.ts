export type KanbanColumn = "todo" | "in-progress" | "review";

export interface MissionTask {
  id: string;
  title: string;
  column: KanbanColumn;
}

export interface TimeLogEntry {
  id: string;
  seconds: number;
  loggedAt: string;
}

export interface DeliverableSubmission {
  links: string[];
  notes: string;
  submittedAt: string;
}