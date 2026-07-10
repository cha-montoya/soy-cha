import { supabase } from "../lib/supabase";

export async function getContents() {
  const { data, error } = await supabase
    .from("generated_content")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Supabase Response:", { data, error });

  if (error) {
    throw error;
  }

  return data;
}