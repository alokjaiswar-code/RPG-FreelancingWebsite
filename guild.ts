export type Rank = "S" | "A" | "B" | "C" | "D";

export interface User {
  id: string;
  name: string;
  rank: Rank;
  xp: number;
  completedQuests: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  bounty: number;
  requiredRank: Rank;
  status: "open" | "claimed" | "in-progress" | "submitted" | "completed" | "failed" | "expired";
  claimedBy?: string;
}