const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const isLocalBrowser =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

// Use IPv4 explicitly: on macOS, localhost:5000 can resolve to AirPlay Receiver
// over IPv6 instead of this app's Flask process, which returns an unrelated 403.
// Deployments should provide VITE_API_BASE_URL or proxy /api.
const API_BASE_URL = configuredApiBaseUrl || (isLocalBrowser ? "http://127.0.0.1:5000/api" : "/api");

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error("Cannot reach the analysis API. Start the backend server at http://127.0.0.1:5000 and try again.");
  }

  const responseText = await response.text();
  let payload;
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    payload = { error: responseText };
  }

  if (!response.ok) {
    if (response.status === 403 && !configuredApiBaseUrl) {
      throw new Error(
        "The frontend server rejected the API request. Start the Flask API on port 5000 or set VITE_API_BASE_URL to your API URL.",
      );
    }

    throw new Error(
      payload.error || payload.message || `The analysis API returned an error (${response.status}).`,
    );
  }

  return payload;
}

const percentage = (value) => `${Number(value || 0).toFixed(2)}%`;

function toAnalysisViewModel(
  jobId,
  decisionResponse,
  semanticResponse,
  lexicalResponse,
  sentenceResponse,
  heatmapResponse,
) {
  const decision = decisionResponse.results[0];
  const semantic = semanticResponse.results[0];
  const lexical = lexicalResponse.results[0];
  const sentences = sentenceResponse.results[0];

  if (!decision || !semantic || !lexical || !sentences) {
    throw new Error("The analysis completed but did not return comparison results.");
  }

  const pairs = decisionResponse.results.map((pair) => ({
    documentA: pair.document_1,
    documentB: pair.document_2,
    score: Number(pair.overall),
    risk: pair.risk,
  }));
  const highestPair = pairs.reduce((highest, pair) => (pair.score > highest.score ? pair : highest));
  const averagePairScore = pairs.reduce((total, pair) => total + pair.score, 0) / pairs.length;

  return {
    jobId,
    documentsChecked: decisionResponse.total_documents,
    comparisonsMade: decisionResponse.total_comparisons,
    needsReview: decisionResponse.results.filter((result) => !["Low", "Very Low"].includes(result.risk)).length,
    isMultiDocument: decisionResponse.total_documents > 2,
    batch: {
      averagePairScore: percentage(averagePairScore),
      highestPair: {
        ...highestPair,
        score: percentage(highestPair.score),
      },
    },
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
    documentMatrix: {
      documents: heatmapResponse.documents.map((document) => document.filename),
      values: heatmapResponse.matrix,
    },
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

  const [decision, semantic, lexical, sentences, heatmap] = await Promise.all([
    request(`/jobs/decision/${upload.job_id}`),
    request(`/jobs/semantic/${upload.job_id}`),
    request(`/jobs/lexical/${upload.job_id}`),
    request(`/jobs/sentences/${upload.job_id}`),
    request(`/jobs/heatmap/${upload.job_id}`),
  ]);

  return toAnalysisViewModel(upload.job_id, decision, semantic, lexical, sentences, heatmap);
}
