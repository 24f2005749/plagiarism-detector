
import DocumentCompareForm from "../components/DocumentCompareForm.jsx";
import StartNewAnalysis from "../components/StartNewAnalysis.jsx";

function NewCheck({ setLoading, onAnalysisComplete }) {
  return (
    <>
      <div className="NewCheck-Content">
        <div className="header-content">
          <h1>New check</h1>
          <p>Upload or paste two documents to compare for similarity.</p>
        </div>
      </div>

      <StartNewAnalysis onAnalysisComplete={onAnalysisComplete} setLoading={setLoading} />
      <DocumentCompareForm onAnalysisComplete={onAnalysisComplete} setLoading={setLoading} />
    </>
  );
}

export default NewCheck;
