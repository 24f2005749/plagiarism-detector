import { useState } from "react";
import { Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeFiles } from "../services/api";

function DocumentCompareForm({ onAnalysisComplete, setLoading }) {
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCompare = async () => {
    if (!docA.trim() || !docB.trim()) {
      setError("Please paste text into both documents before comparing.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const files = [
        new File([docA], "document-a.txt", { type: "text/plain" }),
        new File([docB], "document-b.txt", { type: "text/plain" }),
      ];
      const analysis = await analyzeFiles(files);
      onAnalysisComplete(analysis);
      navigate("/results");
    } catch (err) {
      setError(err.message || "Unable to analyze the pasted text.");
    } finally {
      setLoading(false);
    }
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
      {error && <p className="analysis-form-error" role="alert">{error}</p>}
    </div>
  );
}

export default DocumentCompareForm;
