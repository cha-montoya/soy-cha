import api from "../../../services/api";

export async function generateContent(analysisId) {
  return api.post("/content/generate", {
    analysis_id: analysisId,
  });
}