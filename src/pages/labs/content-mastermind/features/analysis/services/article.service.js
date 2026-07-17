import { supabase } from "../../../lib/supabase";

class ArticleService {
  async getAnalysis() {
    const { data, error } = await supabase
      .from("article_analysis")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from("article_analysis")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

export default new ArticleService();