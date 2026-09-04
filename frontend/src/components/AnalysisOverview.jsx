import { FileStack, GitCompareArrows, AlertCircle } from "lucide-react";
function AnalysisOverview({documentsChecked, comparisonsMade, needsReview}){
     return (
    <section className="overview-stats-card">
      <div className="overview-stat">
        <FileStack size={20} />
        <div className="overview-stat-text">
          <strong>{documentsChecked}</strong>
          <span>Documents Checked</span>
        </div>
      </div>
        <div className="overview-divider" />
      <div className="overview-stat">
        <GitCompareArrows size={20} />
        <div className="overview-stat-text">
          <strong>{comparisonsMade}</strong>
          <span>Comparisons Made</span>
        </div>
      </div>
      <div className="overview-divider" />
      <div className="overview-stat needs-review">
        <AlertCircle size={20} />
        <div className="overview-stat-text">
          <strong>{needsReview}</strong>
          <span>Need Review</span>
        </div>
      </div>
    </section>
  );
}
export default AnalysisOverview;