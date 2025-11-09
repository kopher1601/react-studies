import supabase from "@/lib/supabase.ts";
import { getRandomNickname } from "@/lib/utils.ts";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}

export async function createProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .insert({
      id: userId,
      nickname: getRandomNickname(),
    })
    .select()
    .single();
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}
