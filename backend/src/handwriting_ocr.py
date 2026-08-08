"""Lazy TrOCR support for handwritten document pages."""

from __future__ import annotations

from functools import lru_cache


MODEL_NAME = "microsoft/trocr-base-handwritten"


class HandwritingOCRError(RuntimeError):
    """Raised when the handwriting OCR model cannot be used."""


@lru_cache(maxsize=1)
def _load_model() -> tuple[object, object]:
    """Load TrOCR on first use and reuse it for later pages/documents."""
    try:
        from transformers import TrOCRProcessor, VisionEncoderDecoderModel
    except ImportError as error:
        raise HandwritingOCRError(
            "Handwriting OCR requires torch and transformers. Run: pip install -r backend/requirements.txt"
        ) from error

    try:
        processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
        model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)
        model.eval()
        return processor, model
    except Exception as error:
        raise HandwritingOCRError(f"Could not load handwriting OCR model '{MODEL_NAME}': {error}") from error


def recognize_handwriting(image: object) -> str:
    """Recognize handwritten text in one rendered document page."""
    processor, model = _load_model()
    try:
        pixel_values = processor(images=image, return_tensors="pt").pixel_values  # type: ignore[union-attr]
        generated_ids = model.generate(pixel_values)  # type: ignore[union-attr]
        return processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()  # type: ignore[union-attr]
    except Exception as error:
        raise HandwritingOCRError(f"Could not recognize handwritten text: {error}") from error
