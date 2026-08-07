"""Pair-generation helpers for collection comparisons."""

from itertools import combinations
from collections.abc import Iterator
from typing import TypeVar


Item = TypeVar("Item")


def unique_pairs(items: list[Item]) -> Iterator[tuple[Item, Item]]:
    """Yield each unordered pair once, excluding self-comparisons."""
    yield from combinations(items, 2)
