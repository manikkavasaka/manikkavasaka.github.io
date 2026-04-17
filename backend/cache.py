"""
Simple in-memory caching module for frequently accessed data.
Reduces database queries and improves response times.
"""

import functools
import time
import logging
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)


class CacheEntry:
    """Represents a cached value with timestamp."""
    
    def __init__(self, value: Any, ttl_seconds: int):
        self.value = value
        self.created_at = time.time()
        self.ttl_seconds = ttl_seconds
    
    def is_expired(self) -> bool:
        """Check if cache entry has expired."""
        return (time.time() - self.created_at) > self.ttl_seconds
    
    def get(self) -> Optional[Any]:
        """Get value if not expired, otherwise return None."""
        if self.is_expired():
            return None
        return self.value


class InMemoryCache:
    """Simple in-memory cache with TTL support."""
    
    def __init__(self):
        self._cache = {}
    
    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        """Store value in cache with TTL."""
        self._cache[key] = CacheEntry(value, ttl_seconds)
        logger.debug(f"Cache SET: {key} (TTL: {ttl_seconds}s)")
    
    def get(self, key: str) -> Optional[Any]:
        """Retrieve value from cache if not expired."""
        if key not in self._cache:
            logger.debug(f"Cache MISS: {key} (not found)")
            return None
        
        entry = self._cache[key]
        value = entry.get()
        
        if value is None:
            del self._cache[key]
            logger.debug(f"Cache MISS: {key} (expired)")
            return None
        
        logger.debug(f"Cache HIT: {key}")
        return value
    
    def delete(self, key: str):
        """Remove value from cache."""
        if key in self._cache:
            del self._cache[key]
            logger.debug(f"Cache DELETE: {key}")
    
    def clear(self):
        """Clear entire cache."""
        size = len(self._cache)
        self._cache.clear()
        logger.info(f"Cache cleared ({size} entries removed)")
    
    def size(self) -> int:
        """Get number of entries in cache."""
        return len(self._cache)


# Global cache instance
_cache = InMemoryCache()


def cached_for(seconds: int = 300):
    """
    Decorator to cache async function results.
    
    Usage:
        @cached_for(seconds=300)
        async def expensive_operation():
            return await db.query()
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Check if result is in cache
            cached_value = _cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Call function and cache result
            result = await func(*args, **kwargs)
            _cache.set(cache_key, result, seconds)
            return result
        
        return wrapper
    return decorator


def get_cache() -> InMemoryCache:
    """Get the global cache instance."""
    return _cache


def cache_stats() -> dict:
    """Get cache statistics."""
    return {
        "size": _cache.size(),
        "status": "healthy"
    }


# Convenience functions
def cache_set(key: str, value: Any, ttl_seconds: int = 300):
    """Set cache value."""
    _cache.set(key, value, ttl_seconds)


def cache_get(key: str) -> Optional[Any]:
    """Get cache value."""
    return _cache.get(key)


def cache_delete(key: str):
    """Delete cache value."""
    _cache.delete(key)


def cache_clear():
    """Clear entire cache."""
    _cache.clear()
