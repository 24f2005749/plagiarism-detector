import DocumentCompareForm from "../components/DocumentCompareForm.jsx";
import StartNewAnalysis from "../components/StartNewAnalysis.jsx";
import LatestAnalysis from "../components/LatestAnalysis.jsx";

function NewCheck({ latestAnalysis, onAnalysisComplete }) {

  return (
    <>
      <div className="NewCheck-Content">
        <div className="header-content">
          <h1>New check</h1>
          <p>Upload or paste two documents to compare for similarity.</p>
        </div>
      </div>

      <StartNewAnalysis onAnalysisComplete={onAnalysisComplete} />
      <DocumentCompareForm onAnalysisComplete={onAnalysisComplete} />
      {latestAnalysis && <LatestAnalysis data={latestAnalysis} />}
    </>
  );
}

export default NewCheck;