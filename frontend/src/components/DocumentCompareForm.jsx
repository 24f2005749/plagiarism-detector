import React, { useState } from "react";
import { Search, FileText } from "lucide-react";

function DocumentCompareForm() {
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");

  const handleCompare = () => {
    if (!docA.trim() || !docB.trim()) {
      alert("Please paste text into both documents before comparing.");
      return;
    }
    console.log("Comparing:", docA, docB);
  };

  return (
    <div className="compare-form-card">
      <div className="section-title">
        <FileText size={17} />
        <h2>COMPARE DOCUMENTS</h2>
      </div>

      <div className="new-analysis-form">
        <div className="text-input-group">
          <div className="text-input-label">
            <FileText size={16} />
            <span>DOCUMENT A</span>
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
            <span>DOCUMENT B</span>
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
          Compare Documents
        </button>
      </div>
    </div>
  );
}

export default DocumentCompareForm;