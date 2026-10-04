import { mapToAnalysis } from "./utils/mapAnalysis";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
export const uploadDocuments = (files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return request("/documents/upload", { method: "POST", body: formData });
};

export const runAnalysis = (jobId) =>
  request(`/jobs/${jobId}`, { method: "POST" });

export const getJob = (jobId) => request(`/jobs/${jobId}`);
export const deleteJob = (jobId) =>
  request(`/jobs/${jobId}`, { method: "DELETE" });

export const getDecision = (jobId) => request(`/jobs/decision/${jobId}`);
export const getLexical = (jobId) => request(`/jobs/lexical/${jobId}`);
export const getSemantic = (jobId) => request(`/jobs/semantic/${jobId}`);
export const getSentences = (jobId) => request(`/jobs/sentences/${jobId}`);
export const getHeatmap = (jobId) => request(`/jobs/heatmap/${jobId}`);
export const fetchAnalysis = async (jobId) => {
  const [job, decision, lexical, semantic, sentences, heatmap] = await Promise.all([
    getJob(jobId),
    getDecision(jobId),
    getLexical(jobId),
    getSemantic(jobId),
    getSentences(jobId),
    getHeatmap(jobId),
  ]);
  return mapToAnalysis({ job, decision, lexical, semantic, sentences, heatmap });
};