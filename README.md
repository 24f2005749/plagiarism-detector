# Plagiarism Detector

A beginner-friendly plagiarism engine that combines lexical, document-level semantic, and sentence-level semantic evidence.

## Project structure

```
backend/
  src/
  run_analysis.py        # local N-document processing runner
  services/              # plagiarism processing boundary
  utils/                 # reusable processing helpers
  config/                # reserved for future application configuration
  routes/                # reserved for a future delivery layer
  models/                # reserved for future persistence models
  parser.py              # text, Word, PDF, and OCR document reading
  preprocessor.py        # normalization and sentence extraction
  decision_engine.py     # heuristic classification and evidence
  embedding_model.py     # sentence-transformer loading
  similarity/            # lexical and semantic comparisons
backend/uploads/         # document input storage and included examples
reports/                 # future generated reports
temporary/               # temporary parser/OCR files
```

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run the example

```bash
PYTHONPATH=backend/src python backend/src/run_analysis.py backend/uploads/sample1.txt backend/uploads/sample2.txt
```

## Run the web app

Start the API server from the repository root:

```bash
PYTHONPATH=backend/src python backend/src/api.py
```

Then, in a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:5000`.
For a deployed frontend, set `VITE_API_BASE_URL` to the API base URL (for
example, `https://api.example.com/api`) before building.

## Supported document formats

`analyze_documents` accepts UTF-8 text files (`.txt`, `.text`, `.md`), Word documents (`.docx`), PDFs,
and image documents (`.png`, `.jpg`, `.jpeg`, `.tif`, `.tiff`, `.bmp`,
`.webp`). PDFs with a text layer are extracted directly. Scanned PDFs and
image documents, including handwritten pages, use Tesseract OCR.

Install the Python dependencies as above, then install the Tesseract runtime:

```bash
brew install tesseract
```

Handwriting recognition quality depends on legibility, scan resolution, and
the installed Tesseract language data; clear, high contrast scans work best.

## Use from Python

```python
from services.plagiarism_service import analyze_documents

result = analyze_documents([
    "backend/uploads/sample1.txt",
    "backend/uploads/sample2.txt",
])
print(result["comparisons"])
```

`analyze_documents` is the processing entry point. It reads all supplied documents, generates every unique pair, and returns the comparison evidence for each pair. Thresholds and weights live in `backend/src/config/settings.py`.
