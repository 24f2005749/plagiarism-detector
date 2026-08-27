import shutil
import uuid
from pathlib import Path
from flask import Flask, request
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename

app = Flask(__name__)
api = Api(app)

UPLOAD_FOLDER = Path("backend/uploads")


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

    # def get(self, documentID):
    #     for job_folder in UPLOAD_FOLDER.iterdir():
    #         if not job_folder.is_dir():
    #             continue

    #         for file_path in job_folder.iterdir():
    #             document_id, filename = file_path.name.split("_", 1)
    #             if (document_id == documentID):
    #                 return {
    #                     "filename": filename,
    #                     "job_id": job_folder.name,
    #                     "size": file_path.stat().st_size,
    #                     "type":file_path.suffix
    #                 },200
    
            

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
    
    def delete(self,job_id):
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