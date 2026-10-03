import json
import shutil
import uuid
from pathlib import Path

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename

from services.plagiarism_service import analyze_documents


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)

UPLOAD_FOLDER = Path(__file__).resolve().parents[2] / "uploads"



# Helper: get job folder


def get_job_folder(job_id):
    return UPLOAD_FOLDER / job_id



# Helper: get original filename


def get_original_filename(file_path):
    """
    Extract original filename from:
    <document_uuid>_<original_filename>
    """
    return file_path.name.split("_", 1)[1]



# Helper: load saved analysis


def load_analysis(job_id):
    job_folder = get_job_folder(job_id)

    if not job_folder.exists():
        return None, {"error": "Job not found"}, 404

    analysis_file = job_folder / "analysis.json"

    if not analysis_file.exists():
        return None, {"error": "Analysis has not been run yet"}, 404

    with open(analysis_file, "r", encoding="utf-8") as file:
        analysis = json.load(file)

    return analysis, None, None



# Document upload


class Document(Resource):

    # create job id of given documents

    def post(self):
        files = request.files.getlist("files")

        if len(files) < 2:
            return {
                "error": "At least two documents are required."
            }, 400

        job_id = str(uuid.uuid4())
        job_folder = get_job_folder(job_id)

        job_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        uploaded_documents = []

        for file in files:

            if not file.filename:
                continue

            filename = secure_filename(file.filename)

            if not filename:
                continue

            document_id = str(uuid.uuid4())

            saved_filename = f"{document_id}_{filename}"
            file_path = job_folder / saved_filename

            file.save(file_path)

            uploaded_documents.append({
                "document_id": document_id,
                "filename": filename
            })

        if len(uploaded_documents) < 2:
            shutil.rmtree(job_folder)

            return {
                "error": "At least two valid documents are required."
            }, 400

        return {
            "job_id": job_id,
            "documents": uploaded_documents
        }, 201



# Job


class JobWork(Resource):

    # returns the info of documents in the given job id

    def get(self, job_id):

        job_folder = get_job_folder(job_id)

        if not job_folder.exists():
            return {
                "error": "Job not found"
            }, 404

        documents = []

        for file_path in job_folder.iterdir():

            if file_path.name == "analysis.json":
                continue

            if file_path.is_file():
                documents.append(
                    get_original_filename(file_path)
                )

        return {
            "job_id": job_id,
            "documents": documents
        }, 200

    def post(self, job_id):

        job_folder = get_job_folder(job_id)

        if not job_folder.exists():
            return {
                "error": "Job not found"
            }, 404

        files = [
            file_path
            for file_path in job_folder.iterdir()
            if file_path.is_file()
            and file_path.name != "analysis.json"
        ]

        if len(files) < 2:
            return {
                "error": "At least two documents are required."
            }, 400

        
        # Run the complete analysis once
        

        analysis = analyze_documents(
            [str(file_path) for file_path in files]
        )

        
        # Replace UUID-prefixed filenames
        # with original filenames
        

        for comparison in analysis["comparisons"]:

            comparison["document_1"]["filename"] = (
                get_original_filename(
                    Path(comparison["document_1"]["filename"])
                )
            )

            comparison["document_2"]["filename"] = (
                get_original_filename(
                    Path(comparison["document_2"]["filename"])
                )
            )

        
        # Save complete analysis
        

        analysis_file = job_folder / "analysis.json"

        with open(
            analysis_file,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                analysis,
                file,
                indent=4,
                ensure_ascii=False
            )

        
        # Return final decision for every pair
        

        results = []

        for comparison in analysis["comparisons"]:

            results.append({
                "document_1": comparison["document_1"]["filename"],
                "document_2": comparison["document_2"]["filename"],
                "decision": comparison["result"]["decision"]
            })

        return {
            "message" : "Documents uploaded successfully."
        }, 200

    def delete(self, job_id):

        job_folder = get_job_folder(job_id)

        if not job_folder.exists():
            return {
                "error": "Job not found"
            }, 404

        shutil.rmtree(job_folder)

        return {
            "message": "Job deleted successfully",
            "job_id": job_id
        }, 200



# Lexical result


class LexicalResult(Resource):

    def get(self, job_id):

        analysis, error, status = load_analysis(job_id)

        if error:
            return error, status

        results = []

        for comparison in analysis["comparisons"]:

            decision = comparison["result"]["decision"]

            results.append({
                "document_1": comparison["document_1"]["filename"],
                "document_2": comparison["document_2"]["filename"],
                "lexical_similarity": decision["lexical_evidence"]
            })

        return {
            "job_id": job_id,
            "results": results
        }, 200



# Semantic result


class SemanticResult(Resource):

    def get(self, job_id):

        analysis, error, status = load_analysis(job_id)

        if error:
            return error, status

        results = []

        for comparison in analysis["comparisons"]:

            decision = comparison["result"]["decision"]

            results.append({
                "document_1": comparison["document_1"]["filename"],
                "document_2": comparison["document_2"]["filename"],
                "semantic_similarity": decision["semantic_evidence"]
            })

        return {
            "job_id": job_id,
            "results": results
        }, 200



# Sentence matching result


class SentenceResult(Resource):

    def get(self, job_id):

        analysis, error, status = load_analysis(job_id)

        if error:
            return error, status

        results = []

        for comparison in analysis["comparisons"]:

            decision = comparison["result"]["decision"]
            sentence_matches = comparison["result"]["sentence_matches"]

            results.append({
                "document_1": comparison["document_1"]["filename"],
                "document_2": comparison["document_2"]["filename"],
                "matched_sentences": decision["matched_sentences"],
                "total_sentences": decision["total_sentences"],
                "coverage": decision["coverage"],
                "highest_similarity": sentence_matches["highest_similarity"],
                "average_similarity": sentence_matches["average_similarity"],
                "matches": sentence_matches["matches"]
            })

        return {
            "job_id": job_id,
            "results": results
        }, 200



# Decision result


class DecisionResult(Resource):

    def get(self, job_id):

        analysis, error, status = load_analysis(job_id)

        if error:
            return error, status

        results = []

        for comparison in analysis["comparisons"]:

            decision = comparison["result"]["decision"]

            results.append({
                "document_1": comparison["document_1"]["filename"],
                "document_2": comparison["document_2"]["filename"],
                "overall": decision["overall"],
                "risk": decision["risk"],
                "type": decision["type"],
                "confidence": decision["confidence"],
                "coverage": decision["coverage"],
                "matched_sentences": decision["matched_sentences"],
                "total_sentences": decision["total_sentences"],
                "semantic_evidence": decision["semantic_evidence"],
                "lexical_evidence": decision["lexical_evidence"],
                "reason": decision["reason"]
            })

        return {
            "job_id": job_id,
            "total_documents": analysis["document_count"],
            "total_comparisons": analysis["total_pairs"],
            "results": results
        }, 200



# Heatmap result

class HeatmapResult(Resource):

    def get(self, job_id):

        analysis, error, status = load_analysis(job_id)

        if error:
            return error, status

        documents = {}
        
        # Collect documents and their IDs
        for comparison in analysis["comparisons"]:
            for key in ("document_1", "document_2"):
                doc = comparison[key]
                documents[doc["document_id"]] = {
                    "document_id": doc["document_id"],
                    "filename": doc["filename"]
                }

        docs = list(documents.values())

        # Create document ID to matrix index mapping
        index = {
            doc["document_id"]: i
            for i, doc in enumerate(docs)
        }

        n = len(docs)

        # Initialize matrix
        matrix = [
            [None for _ in range(n)]
            for _ in range(n)
        ]

        # Set diagonal to 100
        for i in range(n):
            matrix[i][i] = 100.0

        # Fill pairwise similarity values
        for comparison in analysis["comparisons"]:

            doc1 = comparison["document_1"]["document_id"]
            doc2 = comparison["document_2"]["document_id"]

            i = index[doc1]
            j = index[doc2]

            score = comparison["result"]["decision"]["overall"]

            matrix[i][j] = score
            matrix[j][i] = score

        return {
            "job_id": job_id,
            "document_count": n,
            "documents": docs,
            "matrix": matrix
        }, 200


# Routes


api.add_resource(
    Document,
    "/api/documents/upload"
)

api.add_resource(
    JobWork,
    "/api/jobs/<string:job_id>" 
)

api.add_resource(
    LexicalResult,
    "/api/jobs/lexical/<string:job_id>"
)

api.add_resource(
    SemanticResult,
    "/api/jobs/semantic/<string:job_id>"
)

api.add_resource(
    SentenceResult,
    "/api/jobs/sentences/<string:job_id>"
)

api.add_resource(
    DecisionResult,
    "/api/jobs/decision/<string:job_id>"
)

api.add_resource(
    HeatmapResult,
    "/api/jobs/heatmap/<string:job_id>"
)


# Run server


if __name__ == "__main__":
    app.run(
        port=5000,
        debug=True
    )
