export const pct = (v) =>
  typeof v === "number" ? `${v.toFixed(2)}%` : String(v);
export function mapToAnalysis({ job, decision, lexical, semantic, sentences, heatmap }) {
  const d = decision.results[0];
  const lexicalResult = lexical.results[0];
  const semanticResult = semantic.results[0];
  const s = sentences.results[0];
  const matches = s.matches ?? [];
  const sourceSentences = [...new Set(matches.map((match) => match.sentence1))];
  const targetSentences = [...new Set(matches.map((match) => match.sentence2))];
  const sentenceMatrixData = sourceSentences.map(() =>
    targetSentences.map(() => null)
  );

  matches.forEach((match) => {
    const sourceIndex = sourceSentences.indexOf(match.sentence1);
    const targetIndex = targetSentences.indexOf(match.sentence2);
    sentenceMatrixData[sourceIndex][targetIndex] = match.score;
  });
  const documentAIndex = heatmap.documents.findIndex(
    (document) => document.filename === d.document_1
  );
  const documentBIndex = heatmap.documents.findIndex(
    (document) => document.filename === d.document_2
  );
  const heatmapScore = documentAIndex >= 0 && documentBIndex >= 0
    ? heatmap.matrix[documentAIndex][documentBIndex]
    : null;

  return {
    jobId: decision.job_id,
    docA: d.document_1 ?? job.documents[0],
    docB: d.document_2 ?? job.documents[1],
    overallScore: pct(heatmapScore ?? d.overall),
    riskLevel: String(d.risk).toUpperCase(),
    plagiarismType: String(d.type).toUpperCase(),
    metrics: {
      semantic: pct(semanticResult.semantic_similarity),
      lexical: pct(lexicalResult.lexical_similarity),
      sentences: `${d.matched_sentences} / ${d.total_sentences}`,
      coverage: pct(d.coverage),
      confidence: pct(d.confidence),
    },
    evidence: {
      highestMatch: pct(s.highest_similarity),
      avgMatch: pct(s.average_similarity),
    },
    reason: d.reason,
    sentenceMatches: matches,
    sentenceMatrix: {
      docASentences: sourceSentences.map((_, index) => `S${index + 1}`),
      docBSentences: targetSentences.map((_, index) => `S${index + 1}`),
      data: sentenceMatrixData,
    },
    technical: [],

    stats: {
      documents: heatmap.document_count ?? job.documents.length,
      comparisons: decision.total_comparisons,
      needsReview: decision.results.filter((r) =>
        String(r.risk).toLowerCase().includes("high")
      ).length,
    },
  };
}