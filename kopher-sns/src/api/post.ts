import supabase from "@/lib/supabase.ts";

export async function createPost(content: string) {
  const { data, error } = await supabase.from("post").insert({
    content,
  });
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}
