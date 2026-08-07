"""Small local runner for the plagiarism processing core.

Usage: PYTHONPATH=backend/src python backend/src/run_analysis.py file_a.pdf file_b.docx [...]
"""

from __future__ import annotations

import sys

from services.plagiarism_service import analyze_documents


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit("Usage: python src/run_analysis.py <document> <document> [...]")
    print(analyze_documents(sys.argv[1:]))
