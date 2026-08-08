from __future__ import annotations

import handwriting_ocr
import parser


class FakePixmap:
    width = 1
    height = 1
    samples = b"\xff\xff\xff"


class FakePage:
    def get_pixmap(self, **kwargs):
        assert kwargs == {"dpi": 400, "alpha": False}
        return FakePixmap()


def test_pdf_uses_handwriting_ocr_after_empty_tesseract(monkeypatch):
    monkeypatch.setattr(parser, "_preprocess_tesseract_image", lambda image, *_: image)
    monkeypatch.setattr("pytesseract.image_to_string", lambda *_args, **_kwargs: "   ")
    monkeypatch.setattr(parser, "_ocr_handwritten_pages", lambda pages, filename: "recognised handwriting")

    assert parser._ocr_pdf([FakePage()], "note.pdf") == "recognised handwriting"


def test_pdf_does_not_use_handwriting_ocr_when_tesseract_succeeds(monkeypatch):
    monkeypatch.setattr(parser, "_preprocess_tesseract_image", lambda image, *_: image)
    monkeypatch.setattr("pytesseract.image_to_string", lambda *_args, **_kwargs: "printed text")
    monkeypatch.setattr(parser, "_ocr_handwritten_pages", lambda *_: (_ for _ in ()).throw(AssertionError("unexpected fallback")))

    assert parser._ocr_pdf([FakePage()], "scan.pdf") == "printed text"


def test_has_meaningful_text_rejects_only_symbols():
    assert parser.has_meaningful_text("  ---  ") is False
    assert parser.has_meaningful_text("handwritten") is True


def test_handwriting_ocr_uses_cached_model_loader(monkeypatch):
    class FakeProcessor:
        pixel_values = "pixels"

        def __call__(self, **_kwargs):
            return self

        def batch_decode(self, generated_ids, **_kwargs):
            assert generated_ids == ["ids"]
            return ["handwritten text"]

    class FakeModel:
        def generate(self, pixel_values):
            assert pixel_values == "pixels"
            return ["ids"]

    monkeypatch.setattr(handwriting_ocr, "_load_model", lambda: (FakeProcessor(), FakeModel()))

    assert handwriting_ocr.recognize_handwriting(object()) == "handwritten text"
