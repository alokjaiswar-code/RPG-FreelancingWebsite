import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  rank: string;
  xp: number;
  gold: number;
  role: string;
}

// Function to calculate rank based on total XP
export function calculateRank(xp: number): string {
  if (xp >= 10000) return "S";
  if (xp >= 5000) return "A";
  if (xp >= 2500) return "B";
  if (xp >= 1000) return "C";
  return "D";
}

// Fetch user profile stats
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}