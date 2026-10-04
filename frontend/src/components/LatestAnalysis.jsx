import {
  FileText,
  ArrowLeftRight,
  AlertTriangle,
  Brain,
  Languages,
  FileSearch,
  Pin,
  Target,
  BarChart3,
  Cpu,
  Grid,
  Flame,
  CheckCircle2
} from "lucide-react";
function TechnicalMetricCircle({ label, value }) {
  const numericValue = parseFloat(value);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (numericValue / 100) * circumference;

  return (
    <div className="technical-metric-circle">

      <span className="technical-metric-label">
        {label}
      </span>

      <div className="mini-progress-circle">

        <svg
          width="58"
          height="58"
          viewBox="0 0 58 58"
        >
          {/* Background Circle */}
          <circle
            cx="29"
            cy="29"
            r={radius}
            className="mini-progress-bg"
          />
          {/* Progress Circle */}
          <circle
            cx="29"
            cy="29"
            r={radius}
            className="mini-progress-value"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="mini-progress-text">
          {numericValue}
        </div>
      </div>
    </div>
  );
}
function LatestAnalysis({ data, onViewReport }) {
  if (!data) return null;
  const analysis = data;

function renderSimilarityMatrix(matrixData) {
  const {
    docASentences,
    docBSentences,
    data
  } = matrixData;
  const getHeatmapClass = (val) => {
    if (val >= 80) return "cell-high";
    if (val >= 40) return "cell-med";
    return "cell-low";
  };
  return (
    <div className="matrix-grid-wrapper">
      <div className="matrix-table">
        <div className="matrix-row header">
          <div className="matrix-cell corner-cell">
            A \ B
          </div>
          {docBSentences.map((col, idx) => (
            <div
              key={idx}
              className="matrix-cell header-cell"
            >
              {col}
            </div>
          ))}
        </div>
        {data.map((row, rIdx) => (
          <div
            key={rIdx}
            className="matrix-row"
          >
            <div className="matrix-cell row-header">
              {docASentences[rIdx]}
            </div>
            {row.map((score, cIdx) => (
              <div
                key={cIdx}
                className={`matrix-cell data-cell ${getHeatmapClass(
                  score
                )}`}
                title={score === null
                  ? `No threshold match for ${docASentences[rIdx]} vs ${docBSentences[cIdx]}`
                  : `Match ${docASentences[rIdx]} vs ${docBSentences[cIdx]}: ${score}%`}
              >
                {score === null ? "-" : `${score}%`}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
  const getRiskClass = (score) => {
    const numericScore = parseFloat(score);

    if (numericScore >= 80) return "high-risk";
    if (numericScore >= 50) return "medium-risk";

    return "low-risk";
  };

  const getRiskIcon = (score) => {
    const numericScore = parseFloat(score);

    if (numericScore >= 80) return "🔴";
    if (numericScore >= 50) return "🟡";

    return "🟢";
  };

  return (
    <section className="latest-analysis-section">

      <div className="section-title">
        <h2>LATEST ANALYSIS</h2>
      </div>

      <div className="latest-analysis-card">

        {/* Document Pair */}
        <div className="document-pair">

          <div className="document">
            <FileText size={18} />
            <span>{analysis.docA}</span>
          </div>

          <ArrowLeftRight size={16} />

          <div className="document">
            <FileText size={18} />
            <span>{analysis.docB}</span>
          </div>

        </div>

        {/* Overall Score */}
        <div className="overall-section">

          <span className="metric-label">
            OVERALL SIMILARITY
          </span>

          <span className="overall-score">
            {analysis.overallScore}
          </span>

          <span
            className={`risk ${getRiskClass(
              analysis.overallScore
            )}`}
          >
            {getRiskIcon(analysis.overallScore)}{" "}
            {analysis.riskLevel}
          </span>

        </div>

        {/* Plagiarism Type */}
        <div className="plagiarism-type">

          <div className="type-title">
            <AlertTriangle size={18} />
            <span>PLAGIARISM TYPE</span>
          </div>

          <strong>{analysis.plagiarismType}</strong>

        </div>

        <div className="analysis-divider" />

        {/* Primary Metrics Grid */}
        <div className="metrics-grid">

          <MetricBox
            icon={Brain}
            label="SEMANTIC"
            value={analysis.metrics.semantic}
          />

          <MetricBox
            icon={Languages}
            label="LEXICAL"
            value={analysis.metrics.lexical}
          />

          <MetricBox
            icon={FileSearch}
            label="SENTENCES"
            value={analysis.metrics.sentences}
          />

          <MetricBox
            icon={Pin}
            label="COVERAGE"
            value={analysis.metrics.coverage}
          />

          <MetricBox
            icon={Target}
            label="CONFIDENCE"
            value={analysis.metrics.confidence}
          />

        </div>

        <div className="analysis-divider" />

        {/* Sentence Evidence */}
        <div className="sentence-evidence">

          <div className="evidence-title">
            <BarChart3 size={18} />
            <span>SENTENCE EVIDENCE</span>
          </div>

          <div className="evidence-row">
            <span>Highest Match</span>
            <strong>{analysis.evidence.highestMatch}</strong>
          </div>

          <div className="evidence-row">
            <span>Average Match</span>
            <strong>{analysis.evidence.avgMatch}</strong>
          </div>

        </div>

        <div className="analysis-divider" />

        {/* Sentence Similarity Matrix */}
        <div className="matrix-section">

          <div className="matrix-title">
            <Grid size={18} />
            <span>SENTENCE SIMILARITY MATRIX</span>
          </div>

          <div className="matrix-pro-container">
            {/* Heatmap Matrix */}
            {renderSimilarityMatrix(analysis.sentenceMatrix)}

            {/* Insights Panel */}
            <div className="matrix-insights-panel">

              <div className="insight-card">

                <Flame
                  size={16}
                  className="text-risk-high"
                />
                <div>
                  <strong>Critical Matches</strong>
                  <p>
                    {analysis.sentenceMatches.filter((match) => match.score >= 90).length} sentence pairs scored at least 90%.
                  </p>
                </div>
              </div>
              <div className="insight-card">
                <CheckCircle2
                  size={16}
                  className="text-accent"
                />
                <div>
                  <strong>Unique Content</strong>
                  <p>
                    {analysis.sentenceMatches.length} sentence pairs met the matching threshold.
                  </p>
                </div>
              </div>
              <div className="matrix-legend">
                <span className="legend-label">
                  Intensity:
                </span>
                <div className="legend-scale">
                  <span className="scale-item low">
                    &lt;40%
                  </span>
                  <span className="scale-item med">
                    40-80%
                  </span>
                  <span className="scale-item high">
                    &gt;80%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="analysis-divider" />
        {/* Technical Metrics */}
        <div className="technical-metrics">
          <div className="technical-title">
            <Cpu size={18} />
            <span>TECHNICAL METRICS</span>
          </div>
          <div className="technical-grid">
            {analysis.technical.map((item, idx) => (
              <TechnicalMetricCircle
                key={idx}
                label={item.label}
                value={item.value}
              />
            ))}

          </div>
          <button
            className="detailed-report-btn"
            onClick={onViewReport}
          >
            View Detailed Report →
          </button>
        </div>
      </div>
    </section>
  );
}
function MetricBox({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <div className="metric-heading">
        <Icon size={17} />
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}
export default LatestAnalysis;