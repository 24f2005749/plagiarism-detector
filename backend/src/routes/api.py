import shutil
import uuid
from pathlib import Path
from itertools import combinations

from flask import Flask, request
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from services.plagiarism_service import analyze_documents


app = Flask(__name__)
api = Api(app)

UPLOAD_FOLDER = Path(__file__).resolve().parents[2] / "uploads"


class Document(Resource):

    def post(self):

        files = request.files.getlist("files")

        if not files:
            return {
                "error": "No files uploaded"
            }, 400

        # One job ID for this upload
        job_id = str(uuid.uuid4())

        # Create:
        # uploads/<job_id>/
        job_folder = UPLOAD_FOLDER / job_id
        job_folder.mkdir(parents=True)

        uploaded = []

        for file in files:

            if not file.filename:
                continue

            filename = secure_filename(file.filename)

            # Unique ID for individual document
            document_id = str(uuid.uuid4())

            stored_filename = f"{document_id}_{filename}"

            file_path = job_folder / stored_filename

            file.save(file_path)

            uploaded.append({
                "document_id": document_id,
                "filename": filename,
                "stored_filename": stored_filename
            })

        return {
            "message": "Files uploaded successfully",
            "job_id": job_id,
            "documents": uploaded
        }, 201


class JobWork(Resource):

    def get(self, job_id):

        job_folder = UPLOAD_FOLDER / job_id

        if not job_folder.exists():
            return {
                "error": "Job not found"
            }, 404

        files = []

        for file_path in job_folder.iterdir():

            if not file_path.is_file():
                continue

            files.append(file_path.name)

        return {
            "files": files
        }, 200


    def post(self, job_id):

        job_folder = UPLOAD_FOLDER / job_id

        if not job_folder.exists():
            return {
                "error": "Job not found"
            }, 404

        files = [
            file_path
            for file_path in job_folder.iterdir()
            if file_path.is_file()
        ]

        if len(files) < 2:
            return {
                "error": "At least two documents are required"
            }, 400

        results = []

        # Compare every possible pair
        for file1, file2 in combinations(files, 2):

            result = analyze_documents([
                str(file1),
        
                str(file2)
            ])

            results.append({
                "document_1": file1.name,
                "document_2": file2.name,
                "result": result
            })

        return {
            "job_id": job_id,
            "total_documents": len(files),
            "total_comparisons": len(results),
            "results": results
        }, 200


    def delete(self, job_id):

        job_folder = UPLOAD_FOLDER / job_id

        if not job_folder.exists():
            return {
                "error": "Job not found"
            }, 404

        shutil.rmtree(job_folder)

        return {
            "message": "Job deleted successfully",
            "job_id": job_id
        }, 410


api.add_resource(
    Document,
    "/api/documents/upload",
    "/api/documents/<string:documentID>"
)

api.add_resource(
    JobWork,
    "/api/jobs/<string:job_id>"
)


if __name__ == "__main__":
    app.run(port=5000, debug=True)