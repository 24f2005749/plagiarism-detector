
import DocumentCompareForm from "../components/DocumentCompareForm.jsx";
import StartNewAnalysis from "../components/StartNewAnalysis.jsx";

function NewCheck() {
   const handleStart = async () => {
    try {
      setLoading(true);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);   
    }
  };
  return (
    <>
      <div className="NewCheck-Content">
        <div className="header-content">
          <h1>New check</h1>
          <p>Upload or paste two documents to compare for similarity.</p>
        </div>
      </div>

      <StartNewAnalysis />
      <DocumentCompareForm />
    </>
  );
}

export default NewCheck;

