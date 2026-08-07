"""Text normalization used before similarity comparison."""

import re
from typing import TypedDict

import spacy

from config.settings import SPACY_MODEL_NAME


class ProcessedDocument(TypedDict):
    """The raw and normalized forms of one document."""

    raw: str
    clean_text: str
    tokens: list[str]
    sentences: list[str]
    raw_sentences: list[str]


nlp = spacy.load(SPACY_MODEL_NAME)


def _keep_token(token: spacy.tokens.Token) -> bool:
    """Return whether a token contributes to normalized comparison text."""
    return not (token.is_stop or token.is_punct or token.is_space or token.like_num)


def preprocess(text: str) -> ProcessedDocument:
    """Lowercase, normalize whitespace, and prepare document and sentence text."""
    normalized_text = re.sub(r"\s+", " ", text.lower()).strip()
    document = nlp(normalized_text)

    tokens = [token.lemma_ for token in document if _keep_token(token)]
    raw_sentences = [sentence.text.strip() for sentence in document.sents]
    clean_sentences = [
        " ".join(token.lemma_ for token in sentence if _keep_token(token))
        for sentence in document.sents
    ]

    return {
        "raw": normalized_text,
        "clean_text": " ".join(tokens),
        "tokens": tokens,
        "sentences": clean_sentences,
        "raw_sentences": raw_sentences,
    }
