"""Heuristic classification of plagiarism evidence."""

from config.settings import (
    ALGORITHM_AGREEMENT_WEIGHT,
    COVERAGE_WEIGHT,
    EXACT_COPY_COVERAGE_THRESHOLD,
    EXACT_COPY_RAPIDFUZZ_THRESHOLD,
    EXACT_COPY_SEMANTIC_THRESHOLD,
    HEAVY_PARAPHRASING_AVERAGE_SENTENCE_THRESHOLD,
    HEAVY_PARAPHRASING_COVERAGE_THRESHOLD,
    HEAVY_PARAPHRASING_MATCH_COUNT,
    HEAVY_PARAPHRASING_RAPIDFUZZ_THRESHOLD,
    HEAVY_PARAPHRASING_SEMANTIC_THRESHOLD,
    HEAVY_PARAPHRASING_STRONG_SENTENCE_PERCENTAGE,
    HEAVY_PARAPHRASING_TFIDF_THRESHOLD,
    LEXICAL_WEIGHT,
    MAX_PERCENTAGE,
    MIXED_HIGH_RISK_THRESHOLD,
    MIXED_LOW_RISK_THRESHOLD,
    MIXED_MODERATE_RISK_THRESHOLD,
    NEAR_COPY_AVERAGE_SENTENCE_THRESHOLD,
    NEAR_COPY_COVERAGE_THRESHOLD,
    NEAR_COPY_RAPIDFUZZ_THRESHOLD,
    NEAR_COPY_SEMANTIC_THRESHOLD,
    PERCENTAGE_MULTIPLIER,
    POSSIBLE_PARAPHRASING_HIGHEST_SENTENCE_THRESHOLD,
    POSSIBLE_PARAPHRASING_MATCH_COUNT,
    POSSIBLE_PARAPHRASING_SEMANTIC_THRESHOLD,
    ROUNDING_PRECISION,
    SEMANTIC_EVIDENCE_WEIGHT,
    SEMANTIC_WEIGHT,
    SENTENCE_EVIDENCE_WEIGHT,
    SENTENCE_MATCH_THRESHOLD,
    SENTENCE_SUPPORT_AVERAGE_WEIGHT,
    SENTENCE_SUPPORT_COVERAGE_WEIGHT,
    SENTENCE_SUPPORT_STRONG_MATCH_WEIGHT,
    SENTENCE_SUPPORT_WEIGHT,
)


def _classify_type(
    rapid: float,
    tfidf: float,
    semantic: float,
    coverage: float,
    matched_sentences: int,
    average_sentence_similarity: float,
    highest_sentence_similarity: float,
    strong_sentence_percentage: float,
) -> str:
    if semantic >= EXACT_COPY_SEMANTIC_THRESHOLD and rapid >= EXACT_COPY_RAPIDFUZZ_THRESHOLD and coverage >= EXACT_COPY_COVERAGE_THRESHOLD:
        return "Exact Copy"
    if semantic >= NEAR_COPY_SEMANTIC_THRESHOLD and rapid >= NEAR_COPY_RAPIDFUZZ_THRESHOLD and (coverage >= NEAR_COPY_COVERAGE_THRESHOLD or average_sentence_similarity >= NEAR_COPY_AVERAGE_SENTENCE_THRESHOLD):
        return "Near Copy"
    if semantic >= HEAVY_PARAPHRASING_SEMANTIC_THRESHOLD and (rapid < HEAVY_PARAPHRASING_RAPIDFUZZ_THRESHOLD or tfidf < HEAVY_PARAPHRASING_TFIDF_THRESHOLD) and (
        coverage >= HEAVY_PARAPHRASING_COVERAGE_THRESHOLD
        or matched_sentences >= HEAVY_PARAPHRASING_MATCH_COUNT
        or average_sentence_similarity >= HEAVY_PARAPHRASING_AVERAGE_SENTENCE_THRESHOLD
        or strong_sentence_percentage >= HEAVY_PARAPHRASING_STRONG_SENTENCE_PERCENTAGE
    ):
        return "Heavy Paraphrasing"
    if semantic >= POSSIBLE_PARAPHRASING_SEMANTIC_THRESHOLD or (
        highest_sentence_similarity >= POSSIBLE_PARAPHRASING_HIGHEST_SENTENCE_THRESHOLD
        and matched_sentences >= POSSIBLE_PARAPHRASING_MATCH_COUNT
    ):
        return "Possible Paraphrasing"
    return "Mixed"


def _risk_level(plagiarism_type: str, overall: float, coverage: float, matched_sentences: int, average_sentence_similarity: float) -> str:
    if plagiarism_type == "Exact Copy":
        return "Critical"
    if plagiarism_type == "Near Copy":
        return "High"
    if plagiarism_type == "Heavy Paraphrasing":
        is_supported = (
            coverage >= HEAVY_PARAPHRASING_COVERAGE_THRESHOLD
            or matched_sentences >= HEAVY_PARAPHRASING_MATCH_COUNT
            or average_sentence_similarity >= HEAVY_PARAPHRASING_AVERAGE_SENTENCE_THRESHOLD
        )
        return "Moderate" if is_supported else "Low"
    if plagiarism_type == "Possible Paraphrasing":
        return "Low"
    if overall >= MIXED_HIGH_RISK_THRESHOLD:
        return "High"
    if overall >= MIXED_MODERATE_RISK_THRESHOLD:
        return "Moderate"
    if overall >= MIXED_LOW_RISK_THRESHOLD:
        return "Low"
    return "Very Low"


def decision_engine(
    rapid: float,
    tfidf: float,
    semantic: float,
    matched_sentences: int,
    total_sentences: int,
    average_sentence_similarity: float = 0.0,
    highest_sentence_similarity: float = 0.0,
    best_scores: list[float] | None = None,
) -> dict[str, object]:
    """Classify the collected lexical, semantic, and sentence evidence."""
    scores = best_scores or []
    coverage = (matched_sentences / total_sentences * PERCENTAGE_MULTIPLIER) if total_sentences else 0.0
    lexical_evidence = (rapid + tfidf) / len((rapid, tfidf))
    sentence_evidence = (average_sentence_similarity + highest_sentence_similarity) / len((average_sentence_similarity, highest_sentence_similarity))
    semantic_evidence = (semantic + sentence_evidence) / len((semantic, sentence_evidence))
    strong_sentence_percentage = (
        sum(score >= SENTENCE_MATCH_THRESHOLD for score in scores) / len(scores) * PERCENTAGE_MULTIPLIER
        if scores
        else coverage
    )
    overall = (
        semantic * SEMANTIC_WEIGHT
        + lexical_evidence * LEXICAL_WEIGHT
        + coverage * COVERAGE_WEIGHT
        + sentence_evidence * SENTENCE_EVIDENCE_WEIGHT
    )
    plagiarism_type = _classify_type(rapid, tfidf, semantic, coverage, matched_sentences, average_sentence_similarity, highest_sentence_similarity, strong_sentence_percentage)
    risk = _risk_level(plagiarism_type, overall, coverage, matched_sentences, average_sentence_similarity)

    algorithm_spread = (abs(rapid - tfidf) + abs(rapid - semantic) + abs(tfidf - semantic)) / len((rapid, tfidf, semantic))
    algorithm_agreement = max(0.0, MAX_PERCENTAGE - algorithm_spread)
    sentence_support = min(
        MAX_PERCENTAGE,
        coverage * SENTENCE_SUPPORT_COVERAGE_WEIGHT
        + average_sentence_similarity * SENTENCE_SUPPORT_AVERAGE_WEIGHT
        + strong_sentence_percentage * SENTENCE_SUPPORT_STRONG_MATCH_WEIGHT,
    )
    confidence = (
        algorithm_agreement * ALGORITHM_AGREEMENT_WEIGHT
        + semantic_evidence * SEMANTIC_EVIDENCE_WEIGHT
        + sentence_support * SENTENCE_SUPPORT_WEIGHT
    )

    semantic_level = "high" if semantic >= HEAVY_PARAPHRASING_SEMANTIC_THRESHOLD else "moderate" if semantic >= POSSIBLE_PARAPHRASING_SEMANTIC_THRESHOLD else "low"
    reasons = [
        f"Semantic similarity is {semantic_level} ({semantic:.1f}%).",
        f"Lexical similarity is {lexical_evidence:.1f}% based on RapidFuzz and TF-IDF.",
        f"Sentence-level comparison found {matched_sentences} matching sentence(s), covering {coverage:.1f}% of document 1.",
    ]
    if matched_sentences:
        reasons.extend( 
            [
                f"The best sentence pair scored {highest_sentence_similarity:.1f}%, with an average best-pair score of {average_sentence_similarity:.1f}%.",
                f"{strong_sentence_percentage:.1f}% of source sentences met the {SENTENCE_MATCH_THRESHOLD:.0f}% sentence-match threshold.",
            ]
        )
    reasons.append(
        "Strong semantic evidence with weaker lexical overlap indicates heavy paraphrasing."
        if plagiarism_type == "Heavy Paraphrasing"
        else f"The combined evidence is classified as {plagiarism_type.lower()}."
    )

    return {
        "overall": round(overall, ROUNDING_PRECISION),
        "risk": risk,
        "type": plagiarism_type,
        "confidence": round(confidence, ROUNDING_PRECISION),
        "coverage": round(coverage, ROUNDING_PRECISION),
        "matched_sentences": matched_sentences,
        "total_sentences": total_sentences,
        "semantic_evidence": round(semantic_evidence, ROUNDING_PRECISION),
        "lexical_evidence": round(lexical_evidence, ROUNDING_PRECISION),
        "reason": reasons,
    }
