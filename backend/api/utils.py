from typing import Callable, TypeVar
from django.core.cache import cache

T = TypeVar("T")


def cache_response(
    cache_key: str, fetch_fn: Callable[[], T], timeout: int = 5 * 60
) -> T:
    if cached := cache.get(cache_key):
        return cached

    result = fetch_fn()
    cache.set(cache_key, result, timeout)
    return result
