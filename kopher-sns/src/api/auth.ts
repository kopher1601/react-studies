import supabase from "@/lib/supabase.ts";
import type { Provider } from "@supabase/supabase-js";

interface AuthRequestParams {
  email: string;
  password: string;
}
export async function signUp({ email, password }: AuthRequestParams) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function signIn({ email, password }: AuthRequestParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
