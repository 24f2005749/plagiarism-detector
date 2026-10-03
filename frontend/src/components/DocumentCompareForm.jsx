import React, { useState } from "react";
import { Search, FileText } from "lucide-react";

function DocumentCompareForm({ onAnalysisComplete }) {
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");

  const handleCompare = () => {
    if (!docA.trim() || !docB.trim()) {
      alert("Please paste text into both documents before comparing.");
      return;
    }
    const fakeResult = {
      docA: "Document A",
      docB: "Document B",
      overallScore: "82.07%",
      riskLevel: "HIGH RISK",
      plagiarismType: "NEAR COPY",
      metrics: {
        semantic: "92.30%",
        lexical: "60.42%",
        sentences: "5 / 7",
        coverage: "71.43%",
        confidence: "78.00%"
      },
      evidence: { highestMatch: "100.00%", avgMatch: "77.39%" },
      sentenceMatrix: {
        docASentences: ["S1", "S2", "S3", "S4", "S5"],
        docBSentences: ["S1", "S2", "S3", "S4", "S5"],
        data: [
          [100, 15, 0, 8, 12],
          [18, 95, 22, 5, 0],
          [0, 10, 100, 40, 15],
          [12, 0, 35, 88, 10],
          [5, 2, 10, 15, 92]
        ]
      },
      technical: [
        { label: "RapidFuzz Ratio", value: "54.78%" },
        { label: "RapidFuzz Partial", value: "53.75%" },
        { label: "Token Sort", value: "68.51%" },
        { label: "Token Set", value: "70.31%" },
        { label: "TF-IDF", value: "50.53%" },
        { label: "Sentence Transformer", value: "92.30%" }
      ]
    };

    onAnalysisComplete(fakeResult);
  };

  return (
    <div className="compare-form-card">
      <div className="section-title">
        <FileText size={17} />
        <h2>COMPARE PLAGIARISM</h2>
      </div>

      <div className="new-analysis-form">
        <div className="text-input-group">
          <div className="text-input-label">
            <FileText size={16} />
            <span>TEXT A</span>
          </div>
          <textarea
            className="document-textbox"
            placeholder="Paste the first document's text here..."
            value={docA}
            onChange={(e) => setDocA(e.target.value)}
          />
        </div>

        <div className="text-input-group">
          <div className="text-input-label">
            <FileText size={16} />
            <span>TEXT B</span>
          </div>
          <textarea
            className="document-textbox"
            placeholder="Paste the second document's text here..."
            value={docB}
            onChange={(e) => setDocB(e.target.value)}
          />
        </div>

        <button className="new-analysis-btn" onClick={handleCompare}>
          <Search size={18} />
          Compare
        </button>
      </div>
    </div>
  );
}

export default DocumentCompareForm;