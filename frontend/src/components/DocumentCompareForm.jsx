import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { uploadDocuments, runAnalysis, fetchAnalysis } from "../api";
const textToFile = (text, name) =>
  new File([text], name, { type: "text/plain" });

function DocumentCompareForm({ onAnalysisComplete }) {
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleCompare = async () => {
    if (!docA.trim() || !docB.trim()) {
      alert("Please paste text into both documents before comparing.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { job_id } = await uploadDocuments([
        textToFile(docA, "Document_A.txt"),
        textToFile(docB, "Document_B.txt"),
      ]);
      await runAnalysis(job_id);
      onAnalysisComplete(await fetchAnalysis(job_id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="compare-form-card">
      {error && <p className="form-error">{error}</p>}
      <div className="section-title">
        <FileText size={17} />
        <h2>COMPARE DOCUMENTS</h2>
      </div>

      <form
        className="new-analysis-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleCompare();
        }}
      >
        <div className="text-input-group">
          <label className="text-input-label" htmlFor="document-a">
            <FileText size={16} />
            <span>DOCUMENT A</span>
          </label>
          <textarea
            id="document-a"
            className="document-textbox"
            placeholder="Paste the first document's text here..."
            value={docA}
            onChange={(event) => setDocA(event.target.value)}
          />
        </div>

        <div className="text-input-group">
          <label className="text-input-label" htmlFor="document-b">
            <FileText size={16} />
            <span>DOCUMENT B</span>
          </label>
          <textarea
            id="document-b"
            className="document-textbox"
            placeholder="Paste the second document's text here..."
            value={docB}
            onChange={(event) => setDocB(event.target.value)}
          />
        </div>

        <button
          className="new-analysis-btn"
          type="submit"
          disabled={loading}
        >
          <Search size={18} />
          {loading ? "Analyzing..." : "Compare Documents"}
        </button>
      </form>
    </div>
  );
}

export default DocumentCompareForm;