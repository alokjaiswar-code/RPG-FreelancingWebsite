import type { Mission, User } from "@/types/guild";

export const mockUser: User = {
  id: "usr-1",
  name: "Novice Adventurer",
  rank: "B", // You can change this rank (S, A, B, C, D) to test rank-gating!
  xp: 1450,
  completedQuests: 12,
};

export const mockMissions: Mission[] = [
  {
    id: "quest-101",
    title: "Fix Authentication Token Leak",
    description: "Audit local storage auth tokens and implement refresh tokens.",
    bounty: 350,
    requiredRank: "C",
    status: "open",
  },
  {
    id: "quest-102",
    title: "Build Custom UI Component Library",
    description: "Design and code high-accessibility React UI components with Tailwind.",
    bounty: 800,
    requiredRank: "B",
    status: "in-progress",
    claimedBy: "usr-1",
  },
  {
    id: "quest-103",
    title: "Deploy Microservice Architecture",
    description: "Migrate backend database cluster and setup Docker orchestrations.",
    bounty: 2500,
    requiredRank: "S",
    status: "open",
  },
];
