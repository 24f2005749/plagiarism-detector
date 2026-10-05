import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Brain,
  FileSearch,
  FileText,
  Grid2X2,
  Languages,
  Pin,
  Target,
} from "lucide-react";

function LatestAnalysis({ data }) {
  if (!data) {
    return (
      <section className="latest-analysis-section empty-analysis">
        <div className="section-title"><h2>LATEST ANALYSIS</h2></div>
        <p>Run a document or text comparison to see verified plagiarism evidence here.</p>
      </section>
    );
  }

  if (data.isMultiDocument) {
    return (
      <section className="latest-analysis-section">
        <div className="section-title"><h2>BATCH ANALYSIS</h2></div>
        <BatchAnalysis data={data} />
        <DocumentSimilarityHeatmap matrix={data.documentMatrix} />
      </section>
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
      <div className="section-title"><h2>LATEST ANALYSIS</h2></div>

      <div className="latest-analysis-card">
        <div className="document-pair">
          <div className="document"><FileText size={18} /><span>{data.docA}</span></div>
          <ArrowLeftRight size={16} />
          <div className="document"><FileText size={18} /><span>{data.docB}</span></div>
        </div>

        <div className="overall-section">
          <span className="metric-label">PAIR SIMILARITY</span>
          <span className="overall-score">{data.overallScore}</span>
          <span className={`risk ${getRiskClass(data.overallScore)}`}>
            {getRiskIcon(data.overallScore)} {data.riskLevel}
          </span>
        </div>

        <div className="plagiarism-type">
          <div className="type-title"><AlertTriangle size={18} /><span>PLAGIARISM TYPE</span></div>
          <strong>{data.plagiarismType}</strong>
        </div>

        <div className="analysis-divider" />

        <div className="metrics-grid">
          <MetricBox icon={Brain} label="SEMANTIC" value={data.metrics.semantic} />
          <MetricBox icon={Languages} label="LEXICAL" value={data.metrics.lexical} />
          <MetricBox icon={FileSearch} label="SENTENCES" value={data.metrics.sentences} />
          <MetricBox icon={Pin} label="COVERAGE" value={data.metrics.coverage} />
          <MetricBox icon={Target} label="CONFIDENCE" value={data.metrics.confidence} />
        </div>

        <div className="analysis-divider" />

        <div className="sentence-evidence">
          <div className="evidence-title"><BarChart3 size={18} /><span>SENTENCE EVIDENCE</span></div>
          <div className="evidence-row"><span>Highest Match</span><strong>{data.evidence.highestMatch}</strong></div>
          <div className="evidence-row"><span>Average Match</span><strong>{data.evidence.avgMatch}</strong></div>
        </div>
      </div>

      {data.documentMatrix.documents.length > 2 && (
        <DocumentSimilarityHeatmap matrix={data.documentMatrix} />
      )}
    </section>
  );
}

function MetricBox({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <div className="metric-heading"><Icon size={17} /><span>{label}</span></div>
      <strong>{value}</strong>
    </div>
  );
}

function BatchAnalysis({ data }) {
  const { highestPair, averagePairScore } = data.batch;

  return (
    <div className="batch-analysis-card">
      <p className="batch-analysis-intro">
        This batch has no single plagiarism score. Every document pair is evaluated independently; use the heatmap below to compare them all.
      </p>
      <div className="batch-stats">
        <div className="batch-stat"><span>FILES ANALYZED</span><strong>{data.documentsChecked}</strong></div>
        <div className="batch-stat"><span>UNIQUE PAIRS</span><strong>{data.comparisonsMade}</strong></div>
        <div className="batch-stat"><span>AVERAGE PAIR SIMILARITY</span><strong>{averagePairScore}</strong></div>
      </div>
      <div className="batch-highest-pair">
        <span>HIGHEST PAIR SIMILARITY</span>
        <strong>{highestPair.score}</strong>
        <p><FileText size={15} /> {highestPair.documentA} <ArrowLeftRight size={15} /> <FileText size={15} /> {highestPair.documentB}</p>
      </div>
    </div>
  );
}

function DocumentSimilarityHeatmap({ matrix }) {
  const heatClass = (score, isSameFile) => {
    if (isSameFile) return "cell-self";
    if (score >= 70) return "cell-high";
    if (score >= 40) return "cell-medium";
    return "cell-low";
  };

  return (
    <section className="document-heatmap">
      <div className="document-heatmap-heading">
        <div className="matrix-title"><Grid2X2 size={18} /><span>DOCUMENT SIMILARITY HEATMAP</span></div>
        <p>Each off-diagonal cell is the pair similarity between the row and column files.</p>
      </div>

      <div className="matrix-grid-wrapper">
        <div className="matrix-table" role="table" aria-label="Document similarity heatmap">
          <div className="matrix-row header" role="row">
            <div className="matrix-cell corner-cell" role="columnheader">File</div>
            {matrix.documents.map((filename, index) => (
              <div
                key={filename}
                className="matrix-cell header-cell"
                role="columnheader"
                title={filename}
                aria-label={`File ${index + 1}: ${filename}`}
                tabIndex={0}
              >
                {`F${index + 1}`}
              </div>
            ))}
          </div>

          {matrix.values.map((row, rowIndex) => (
            <div key={matrix.documents[rowIndex]} className="matrix-row" role="row">
              <div
                className="matrix-cell row-header"
                role="rowheader"
                title={matrix.documents[rowIndex]}
                aria-label={`File ${rowIndex + 1}: ${matrix.documents[rowIndex]}`}
                tabIndex={0}
              >
                {`F${rowIndex + 1}`}
              </div>
              {row.map((score, columnIndex) => {
                const isSameFile = rowIndex === columnIndex;
                const isAvailable = typeof score === "number";
                const label = isSameFile
                  ? `${matrix.documents[rowIndex]} (same file)`
                  : `${matrix.documents[rowIndex]} compared with ${matrix.documents[columnIndex]}: ${Number(score).toFixed(1)}%`;

                return (
                  <div
                    key={`${rowIndex}-${columnIndex}`}
                    className={`matrix-cell data-cell ${isAvailable ? heatClass(score, isSameFile) : "cell-unavailable"}`}
                    role="cell"
                    title={label}
                    aria-label={label}
                    tabIndex={0}
                  >
                    {isSameFile ? "—" : isAvailable ? `${Number(score).toFixed(1)}%` : "N/A"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="file-key" aria-label="File key">
        {matrix.documents.map((filename, index) => (
          <span key={filename} title={filename} aria-label={`File ${index + 1}: ${filename}`}>
            <strong>{`F${index + 1}`}</strong> {filename}
          </span>
        ))}
      </div>

      <div className="matrix-legend" aria-label="Heatmap legend">
        <span className="legend-label">Pair similarity</span>
        <div className="legend-scale">
          <span className="scale-item low">0–39%</span>
          <span className="scale-item medium">40–69%</span>
          <span className="scale-item high">70–100%</span>
        </div>
      </div>
    </section>
  );
}

export default LatestAnalysis;
