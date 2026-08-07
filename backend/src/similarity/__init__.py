"""Public similarity functions for plagiarism analysis."""

from .lexical import rf_similarity, tfidf_similarity
from .semantic import sentence_transformers
from .sentence_matching import sentence_matches

__all__ = [
    "rf_similarity",
    "tfidf_similarity",
    "sentence_matches",
    "sentence_transformers",
]
