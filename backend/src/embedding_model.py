"""Load the sentence embedding model used by semantic comparisons."""

from sentence_transformers import SentenceTransformer

from config.settings import SENTENCE_TRANSFORMER_MODEL_NAME


def load_embedding_model() -> SentenceTransformer:
    """Prefer the cached model so starting the API does not require the network."""
    try:
        return SentenceTransformer(SENTENCE_TRANSFORMER_MODEL_NAME, local_files_only=True)
    except OSError:
        # The first run downloads the model. Later starts use the cached copy above.
        return SentenceTransformer(SENTENCE_TRANSFORMER_MODEL_NAME)


model = load_embedding_model()
