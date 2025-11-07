import supabase from "@/lib/supabase.ts";

interface SignUpParams {
  email: string;
  password: string;
}
export async function signUp({ email, password }: SignUpParams) {
  const response = await supabase.auth.signUp({ email, password });
  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.message);
  }

  return response.data;
}
