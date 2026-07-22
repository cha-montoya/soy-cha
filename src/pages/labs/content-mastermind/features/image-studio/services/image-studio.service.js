import { supabase } from "../../../lib/supabase";

export async function getImageStudioContents() {
  const { data, error } = await supabase
    .from("generated_content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data : [];
}