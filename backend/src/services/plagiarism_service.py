"""Document-collection plagiarism analysis.

This module is the public processing boundary for a future web application.
It deliberately has no Flask, HTTP, database, or storage dependencies.
"""

from __future__ import annotations

from pathlib import Path

from sklearn.metrics.pairwise import cosine_similarity

from config.settings import PERCENTAGE_MULTIPLIER, ROUNDING_PRECISION, SENTENCE_MATCH_THRESHOLD
from decision_engine import decision_engine
from embedding_model import model
from parser import read_file
from preprocessor import preprocess
from similarity import rf_similarity, sentence_matches, sentence_transformers, tfidf_similarity
from utils.pairing import unique_pairs


def analyze_text_pair(source_text: str, target_text: str) -> dict[str, object]:
    """Analyze two document strings and return their complete evidence report."""
    source = preprocess(source_text)
    target = preprocess(target_text)
    rapidfuzz = rf_similarity(source["clean_text"], target["clean_text"])
    tfidf = tfidf_similarity(source["clean_text"], target["clean_text"])
    semantic = sentence_transformers(source["clean_text"], target["clean_text"])
    matches = sentence_matches(source["raw_sentences"], target["raw_sentences"])
    decision = decision_engine(
        rapid=rapidfuzz["token_set"],
        tfidf=tfidf,
        semantic=semantic,
        matched_sentences=matches["matched_sentences"],
        total_sentences=matches["total_sentences"],
        average_sentence_similarity=matches["average_similarity"],
        highest_sentence_similarity=matches["highest_similarity"],
        best_scores=matches["best_scores"],
    )
    return {
        "rapidfuzz": rapidfuzz,
        "tfidf": tfidf,
        "sentence_transformer": semantic,
        "sentence_matches": matches,
        "decision": decision,
        "documents": {"source": source_text, "target": target_text},
    }


def analyze_documents(document_paths: list[str | Path]) -> dict[str, object]:
    """Compare every unique pair in a collection of supported documents.

    A document is never compared with itself, and ``(A, B)`` is calculated only
    once rather than repeated as ``(B, A)``.
    """
    if len(document_paths) < 2:
        raise ValueError("At least two documents are required for comparison.")

    documents = _prepare_documents(document_paths)
    comparisons = []
    for first, second in unique_pairs(documents):
        result = _analyze_prepared_pair(first, second)
        comparisons.append(
            {
                "document_1": {"document_id": first["document_id"], "filename": first["path"].name},
                "document_2": {"document_id": second["document_id"], "filename": second["path"].name},
                "result": result,
            }
        )

    return {
        "document_count": len(documents),
        "total_pairs": len(comparisons),
        "comparisons": comparisons,
    }


def _prepare_documents(document_paths: list[str | Path]) -> list[dict[str, object]]:
    """Parse and embed every document once before pairwise comparison."""
    documents = []
    for index, path in enumerate(document_paths):
        document_path = Path(path)
        processed = preprocess(read_file(document_path))
        documents.append(
            {
                "document_id": f"document_{index + 1}",
                "path": document_path,
                "text": processed["raw"],
                "processed": processed,
            }
        )

    document_embeddings = model.encode([document["processed"]["clean_text"] for document in documents])
    all_sentences = [sentence for document in documents for sentence in document["processed"]["raw_sentences"]]
    all_sentence_embeddings = model.encode(all_sentences) if all_sentences else []
    offset = 0
    for document, document_embedding in zip(documents, document_embeddings):
        sentence_count = len(document["processed"]["raw_sentences"])
        document["embedding"] = document_embedding
        document["sentence_embeddings"] = all_sentence_embeddings[offset : offset + sentence_count]
        offset += sentence_count
    return documents


def _analyze_prepared_pair(source: dict[str, object], target: dict[str, object]) -> dict[str, object]:
    """Compare prepared documents using their cached embeddings."""
    source_processed = source["processed"]
    target_processed = target["processed"]
    rapidfuzz = rf_similarity(source_processed["clean_text"], target_processed["clean_text"])
    tfidf = tfidf_similarity(source_processed["clean_text"], target_processed["clean_text"])
    semantic = float(cosine_similarity([source["embedding"]], [target["embedding"]])[0][0] * PERCENTAGE_MULTIPLIER)
    matches = _sentence_matches(
        source_processed["raw_sentences"],
        target_processed["raw_sentences"],
        source["sentence_embeddings"],
        target["sentence_embeddings"],
    )
    decision = decision_engine(
        rapid=rapidfuzz["token_set"],
        tfidf=tfidf,
        semantic=semantic,
        matched_sentences=matches["matched_sentences"],
        total_sentences=matches["total_sentences"],
        average_sentence_similarity=matches["average_similarity"],
        highest_sentence_similarity=matches["highest_similarity"],
        best_scores=matches["best_scores"],
    )
    return {
        "rapidfuzz": rapidfuzz,
        "tfidf": tfidf,
        "sentence_transformer": semantic,
        "sentence_matches": matches,
        "decision": decision,
        "documents": {"source": source["text"], "target": target["text"]},
    }


def _sentence_matches(source_sentences, target_sentences, source_embeddings, target_embeddings) -> dict[str, object]:
    """Find best sentence matches without recalculating embeddings."""
    if not source_sentences or not target_sentences:
        return {"matched_sentences": 0, "total_sentences": len(source_sentences), "highest_similarity": 0.0, "average_similarity": 0.0, "best_scores": [], "matches": []}

    matrix = cosine_similarity(source_embeddings, target_embeddings)
    best_scores = []
    matches = []
    for index, similarities in enumerate(matrix):
        best_index = int(similarities.argmax())
        raw_score = float(similarities[best_index] * PERCENTAGE_MULTIPLIER)
        score = round(raw_score, ROUNDING_PRECISION)
        best_scores.append(score)
        if raw_score >= SENTENCE_MATCH_THRESHOLD:
            matches.append({"sentence1": source_sentences[index], "sentence2": target_sentences[best_index], "score": score})
    return {
        "matched_sentences": len(matches),
        "total_sentences": len(source_sentences),
        "highest_similarity": max(best_scores),
        "average_similarity": round(sum(best_scores) / len(best_scores), ROUNDING_PRECISION),
        "best_scores": best_scores,
        "matches": matches,
    }
