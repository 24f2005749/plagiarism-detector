import LatestAnalysis from "../components/LatestAnalysis";
import AnalysisOverview from "../components/AnalysisOverview";

function Results({ latestAnalysis }) {
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
        documentsChecked={latestAnalysis?.stats.documents ?? 0}
        comparisonsMade={latestAnalysis?.stats.comparisons ?? 0}
        needsReview={latestAnalysis?.stats.needsReview ?? 0}
      />
      {latestAnalysis && <LatestAnalysis data={latestAnalysis} />}
    </>
  );
}

export default Results;

