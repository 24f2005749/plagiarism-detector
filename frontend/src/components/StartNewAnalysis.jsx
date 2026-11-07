import { useState, useRef } from "react";
import { Search, Upload, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeFiles } from "../services/api";

function StartNewAnalysis({ onAnalysisComplete, setLoading }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const addFiles = (selectedFiles) => {
    const incomingFiles = Array.from(selectedFiles);
    const supportedFiles = incomingFiles.filter((file) => /\.(pdf|docx?|txt)$/i.test(file.name));

    if (supportedFiles.length > 0) {
      setFiles((prev) => [...prev, ...supportedFiles]);
    }

    setError(
      supportedFiles.length < incomingFiles.length
        ? "Only PDF, DOC, DOCX, and TXT files are supported."
        : ""
    );
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDropzoneKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUploadClick();
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleStartAnalysis = async () => {
    if (files.length < 2) {
      setError("Please upload at least two documents to compare.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const analysis = await analyzeFiles(files);
      onAnalysisComplete(analysis);
      navigate("/results");
    } catch (err) {
      setError(err.message || "Unable to analyze the selected documents.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="start-analysis-card">
      <Search size={28} className="analysis-search-icon" />
      <h2>START NEW ANALYSIS</h2>
      <p>Compare multiple documents and detect similarities.</p>

      <div
        className={`upload-dropzone${isDragging ? " is-dragging" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload documents. Drop files here or press Enter to browse."
        onClick={handleUploadClick}
        onKeyDown={handleDropzoneKeyDown}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: "none" }}
        />
        <Upload size={22} />
        <strong>Drag and drop documents here</strong>
        <span>or click to browse · PDF, DOC, DOCX, TXT</span>
      </div>

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
      {error && <p className="analysis-form-error" role="alert">{error}</p>}
    </div>
  );
}

export default StartNewAnalysis;
