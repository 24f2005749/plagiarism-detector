const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "The analysis request could not be completed.");
  }

  return payload;
}

const percentage = (value) => `${Number(value || 0).toFixed(2)}%`;

function toAnalysisViewModel(jobId, decisionResponse, semanticResponse, lexicalResponse, sentenceResponse) {
  const decision = decisionResponse.results[0];
  const semantic = semanticResponse.results[0];
  const lexical = lexicalResponse.results[0];
  const sentences = sentenceResponse.results[0];

  if (!decision || !semantic || !lexical || !sentences) {
    throw new Error("The analysis completed but did not return comparison results.");
  }

  const matches = sentences.matches || [];
  const rows = matches.length
    ? matches.map((match, index) => ({ label: `S${index + 1}`, score: match.score }))
    : [{ label: "S1", score: 0 }];

  return {
    jobId,
    documentsChecked: decisionResponse.total_documents,
    comparisonsMade: decisionResponse.total_comparisons,
    needsReview: decisionResponse.results.filter((result) => !["Low", "Very Low"].includes(result.risk)).length,
    docA: decision.document_1,
    docB: decision.document_2,
    overallScore: percentage(decision.overall),
    riskLevel: `${decision.risk.toUpperCase()} RISK`,
    plagiarismType: decision.type.toUpperCase(),
    metrics: {
      semantic: percentage(semantic.semantic_similarity),
      lexical: percentage(lexical.lexical_similarity),
      sentences: `${sentences.matched_sentences} / ${sentences.total_sentences}`,
      coverage: percentage(sentences.coverage),
      confidence: percentage(decision.confidence),
    },
    evidence: {
      highestMatch: percentage(sentences.highest_similarity),
      avgMatch: percentage(sentences.average_similarity),
    },
    sentenceMatrix: {
      docASentences: rows.map((row) => row.label),
      docBSentences: ["Best match"],
      data: rows.map((row) => [Number(row.score || 0).toFixed(2)]),
    },
    technical: [
      { label: "Semantic", value: percentage(semantic.semantic_similarity) },
      { label: "Lexical", value: percentage(lexical.lexical_similarity) },
      { label: "Coverage", value: percentage(sentences.coverage) },
      { label: "Confidence", value: percentage(decision.confidence) },
    ],
  };
}

export async function analyzeFiles(files) {
  if (files.length < 2) {
    throw new Error("Please provide at least two documents.");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const upload = await request("/documents/upload", { method: "POST", body: formData });
  const jobPath = `/jobs/${upload.job_id}`;
  await request(jobPath, { method: "POST" });

  const [decision, semantic, lexical, sentences] = await Promise.all([
    request(`/jobs/decision/${upload.job_id}`),
    request(`/jobs/semantic/${upload.job_id}`),
    request(`/jobs/lexical/${upload.job_id}`),
    request(`/jobs/sentences/${upload.job_id}`),
  ]);

  return toAnalysisViewModel(upload.job_id, decision, semantic, lexical, sentences);
}
