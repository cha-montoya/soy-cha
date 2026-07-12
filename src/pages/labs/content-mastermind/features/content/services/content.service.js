import { supabase } from "../../../lib/supabase";

export async function getContents() {
  const { data, error } = await supabase
    .from("generated_content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}