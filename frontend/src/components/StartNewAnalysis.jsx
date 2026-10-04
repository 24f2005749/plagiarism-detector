import { useState, useRef } from "react";
import { Search, Upload, FileText, X } from "lucide-react";
import { uploadDocuments, runAnalysis, fetchAnalysis } from "../api";

function StartNewAnalysis({ onAnalysisComplete }) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleStartAnalysis = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 documents to compare.");
      return;
    }

    try {
      const { job_id } = await uploadDocuments(files);
      await runAnalysis(job_id);
      onAnalysisComplete?.(await fetchAnalysis(job_id));
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="start-analysis-card">
      <Search size={28} className="analysis-search-icon" />
      <h2>START NEW ANALYSIS</h2>
      <p>Compare multiple documents and detect similarities.</p>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <button className="new-analysis-btn" onClick={handleUploadClick}>
        <Upload size={18} />
        Upload Documents
      </button>

      {files.length > 0 && (
        <div className="uploaded-files-list">
          {files.map((file, index) => (
            <div key={index} className="uploaded-file-item">
              <FileText size={15} />
              <span>{file.name}</span>
              <button
                className="remove-file-btn"
                onClick={() => removeFile(index)}
                title="Remove"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <button className="new-analysis-btn start-btn" onClick={handleStartAnalysis}>
            <Search size={16} />
            Start Analysis
          </button>
        </div>
      )}
    </div>
  );
}

export default StartNewAnalysis;