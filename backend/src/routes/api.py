# The header of the files must be "files" mentioned in line 13 or the first line of post function in Uploaded file resource 

import shutil
from flask import Flask, request
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename
import uuid
from  pathlib import Path

app = Flask(__name__)
api = Api(app)

UPLOAD_FOLDER = Path("uploads") # Crazy stuff I discovered

class UploadFile(Resource):
    def post(self):
        files = request.files.getlist("files")

        uploaded = []

        for file in files:
            if not file.filename:
                continue

            filename = secure_filename(file.filename)
            document_id = str(uuid.uuid4())
            stored_filename = f"{document_id}_{filename}"
            file_path = UPLOAD_FOLDER / stored_filename
            file.save(file_path)

            #  Update my list for the files that are uploaded
            uploaded.append({
                "document_id": document_id,
                "filename": filename,
                "stored_filename": stored_filename
            })

        return {
            "message": "Files uploaded successfully",
            "documents": uploaded
        }, 201 # 201 Created success  

class Documents(Resource):

    def get(self):
        jobs = {}

    #Agar upload folder hi nahi hai 
        if not UPLOAD_FOLDER.exists():
            return jobs, 200
        for job_folder in UPLOAD_FOLDER.iterdir(): # Upload folder ke trees ko iterate krra hu
            if not job_folder.is_dir(): # Fallback if a file is there instead of all folders
                continue
            job_id = job_folder.name
            files = []
            for file_path in job_folder.iterdir():
                stored_filename = file_path.name
                # Stored filename:
                # UUID_originalfilename.pdf - Split after _, pehle wala part hai Doc_ID and 2nd wala part hai filename
                document_id, filename = stored_filename.split("_", 1)
                files.append({
                    "document_id": document_id,
                    "filename": filename
                })
                jobs[job_id] = {
                "files": files
            }
            return jobs, 200

class DeleteJob(Resource):

    def delete(self, job_id):

        job_folder = UPLOAD_FOLDER / job_id

        # Agar na mile
        if not job_folder.exists():
            return {
                "error": "Job not found"
            }, 404
        # Agar mil jaye
        shutil.rmtree(job_folder)

        return {
            "message": "Job deleted successfully",
            "job_id": job_id
        }, 200   

api.add_resource(UploadFile, "/upload") 
api.add_resource(
    DeleteJob,
    "/api/plagiarism/jobs/<string:job_id>"
    # Please send the job id as string and not as list, I will create some fallback for it
)
api.add_resource(
    Documents,
    "/api/documents"
)


if __name__ == "__main__":
    app.run(port=5000, debug=True)