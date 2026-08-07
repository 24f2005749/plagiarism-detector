"""Document-level semantic similarity calculation."""

from sklearn.metrics.pairwise import cosine_similarity

from config.settings import PERCENTAGE_MULTIPLIER
from embedding_model import model


def sentence_transformers(text1: str, text2: str) -> float:
    """Return semantic cosine similarity for two complete documents."""
    embeddings = model.encode([text1, text2])
    score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return float(score * PERCENTAGE_MULTIPLIER)
