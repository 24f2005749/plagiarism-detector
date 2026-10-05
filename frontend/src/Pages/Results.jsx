import LatestAnalysis from "../components/LatestAnalysis";
import AnalysisOverview from "../components/AnalysisOverview";

function Results({ analysis }) {
  return (
    <>
      <div className="Result-Content">
        <div className="header-content">
          <h1>Show Results</h1>
          <p>
            Results for the documents compared will be shown below.
          </p>
        </div>
      </div>
      <AnalysisOverview
        documentsChecked={analysis?.documentsChecked ?? 0}
        comparisonsMade={analysis?.comparisonsMade ?? 0}
        needsReview={analysis?.needsReview ?? 0}
      />
      <LatestAnalysis data={analysis} />
    </>
  );
}

export default Results;
