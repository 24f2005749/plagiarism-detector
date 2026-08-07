"""Load the sentence embedding model used by semantic comparisons."""

from sentence_transformers import SentenceTransformer

from config.settings import SENTENCE_TRANSFORMER_MODEL_NAME


model = SentenceTransformer(SENTENCE_TRANSFORMER_MODEL_NAME)
