"""Sentence-level semantic evidence extraction."""

from typing import TypedDict

from sklearn.metrics.pairwise import cosine_similarity

from config.settings import PERCENTAGE_MULTIPLIER, ROUNDING_PRECISION, SENTENCE_MATCH_THRESHOLD
from embedding_model import model


class SentenceMatch(TypedDict):
    sentence1: str
    sentence2: str
    score: float


class SentenceMatchResult(TypedDict):
    matched_sentences: int
    total_sentences: int
    highest_similarity: float
    average_similarity: float
    best_scores: list[float]
    matches: list[SentenceMatch]


def sentence_matches(
    sentences1: list[str],
    sentences2: list[str],
    threshold: float = SENTENCE_MATCH_THRESHOLD,
) -> SentenceMatchResult:
    """Match every source sentence with its best semantic partner."""
    if not sentences1 or not sentences2:
        return {
            "matched_sentences": 0,
            "total_sentences": len(sentences1),
            "highest_similarity": 0.0,
            "average_similarity": 0.0,
            "best_scores": [],
            "matches": [],
        }

    embeddings1 = model.encode(sentences1)
    embeddings2 = model.encode(sentences2)
    similarity_matrix = cosine_similarity(embeddings1, embeddings2)

    best_scores: list[float] = []
    matches: list[SentenceMatch] = []
    for index, similarities in enumerate(similarity_matrix):
        best_index = int(similarities.argmax())
        raw_best_score = float(similarities[best_index] * PERCENTAGE_MULTIPLIER)
        best_score = round(raw_best_score, ROUNDING_PRECISION)
        best_scores.append(best_score)
        if raw_best_score >= threshold:
            matches.append(
                {
                    "sentence1": sentences1[index],
                    "sentence2": sentences2[best_index],
                    "score": best_score,
                }
            )

    average_similarity = sum(best_scores) / len(best_scores)
    return {
        "matched_sentences": len(matches),
        "total_sentences": len(sentences1),
        "highest_similarity": max(best_scores),
        "average_similarity": round(average_similarity, ROUNDING_PRECISION),
        "best_scores": best_scores,
        "matches": matches,
    }
