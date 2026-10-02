import LatestAnalysis from "../components/LatestAnalysis";
import AnalysisOverview from "../components/AnalysisOverview";

function Results() {
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
 <AnalysisOverview />
      <LatestAnalysis />
    </>
  );
}

export default Results;

