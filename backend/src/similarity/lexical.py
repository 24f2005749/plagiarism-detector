"""Wording-based similarity calculations."""

from rapidfuzz import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config.settings import PERCENTAGE_MULTIPLIER


def rf_similarity(text1: str, text2: str) -> dict[str, float]:
    """Return RapidFuzz character and token similarity scores."""
    return {
        "ratio": float(fuzz.ratio(text1, text2)),
        "partial": float(fuzz.partial_ratio(text1, text2)),
        "token_sort": float(fuzz.token_sort_ratio(text1, text2)),
        "token_set": float(fuzz.token_set_ratio(text1, text2)),
    }


def tfidf_similarity(text1: str, text2: str) -> float:
    """Return the cosine similarity of the two TF-IDF document vectors."""
    matrix = TfidfVectorizer().fit_transform([text1, text2])
    score = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
    return float(score * PERCENTAGE_MULTIPLIER)
