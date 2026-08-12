# The header of the files must be "files" mentioned in line 13 or the first line of post function in Uploaded file resource 


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

api.add_resource(UploadFile, "/upload") 


if __name__ == "__main__":
    app.run(port=5000, debug=True)