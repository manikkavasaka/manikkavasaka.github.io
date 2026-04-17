"""
Performance metrics collection and reporting.
Tracks request latency, database query times, and API call durations.
"""

import time
import logging
from typing import Dict, List
from datetime import datetime, timedelta
from statistics import mean, median, stdev

logger = logging.getLogger(__name__)


class MetricsCollector:
    """Collect and aggregate performance metrics."""
    
    def __init__(self, window_size: int = 1000):
        """
        Initialize metrics collector.
        
        Args:
            window_size: Number of metrics to keep (rolling window)
        """
        self.window_size = window_size
        self.request_times: List[float] = []
        self.db_query_times: List[float] = []
        self.api_call_times: List[float] = []
        self.error_count = 0
        self.total_requests = 0
    
    def record_request(self, duration_ms: float, error: bool = False):
        """Record HTTP request duration."""
        self.request_times.append(duration_ms)
        self.total_requests += 1
        if error:
            self.error_count += 1
        
        # Keep rolling window of metrics
        if len(self.request_times) > self.window_size:
            self.request_times.pop(0)
        
        # Log slow requests
        if duration_ms > 1000:  # >1 second
            logger.warning(
                f"Slow request detected: {duration_ms:.1f}ms",
                extra={"extra_fields": {"duration_ms": duration_ms}}
            )
    
    def record_db_query(self, duration_ms: float):
        """Record database query duration."""
        self.db_query_times.append(duration_ms)
        
        if len(self.db_query_times) > self.window_size:
            self.db_query_times.pop(0)
        
        # Log slow queries
        if duration_ms > 500:  # >500ms
            logger.warning(
                f"Slow database query: {duration_ms:.1f}ms",
                extra={"extra_fields": {"duration_ms": duration_ms}}
            )
    
    def record_api_call(self, duration_ms: float, provider: str):
        """Record external API call duration."""
        self.api_call_times.append((duration_ms, provider))
        
        if len(self.api_call_times) > self.window_size:
            self.api_call_times.pop(0)
        
        # Log slow API calls
        if duration_ms > 3000:  # >3 seconds
            logger.warning(
                f"Slow API call to {provider}: {duration_ms:.1f}ms",
                extra={"extra_fields": {
                    "provider": provider,
                    "duration_ms": duration_ms
                }}
            )
    
    def get_request_stats(self) -> Dict[str, float]:
        """Get HTTP request performance statistics."""
        if not self.request_times:
            return {}
        
        times = self.request_times
        return {
            "min_ms": min(times),
            "max_ms": max(times),
            "mean_ms": mean(times),
            "median_ms": median(times),
            "stddev_ms": stdev(times) if len(times) > 1 else 0,
            "p95_ms": sorted(times)[int(len(times) * 0.95)],
            "p99_ms": sorted(times)[int(len(times) * 0.99)] if len(times) > 100 else sorted(times)[-1],
        }
    
    def get_db_stats(self) -> Dict[str, float]:
        """Get database query performance statistics."""
        if not self.db_query_times:
            return {}
        
        times = self.db_query_times
        return {
            "min_ms": min(times),
            "max_ms": max(times),
            "mean_ms": mean(times),
            "median_ms": median(times),
            "stddev_ms": stdev(times) if len(times) > 1 else 0,
        }
    
    def get_error_rate(self) -> float:
        """Get error rate as percentage."""
        if self.total_requests == 0:
            return 0.0
        return (self.error_count / self.total_requests) * 100
    
    def get_summary(self) -> Dict:
        """Get complete metrics summary."""
        return {
            "requests": {
                "total": self.total_requests,
                "errors": self.error_count,
                "error_rate_percent": self.get_error_rate(),
                "stats": self.get_request_stats(),
            },
            "database": {
                "queries": len(self.db_query_times),
                "stats": self.get_db_stats(),
            },
            "api_calls": {
                "total": len(self.api_call_times),
                "by_provider": self._group_by_provider(),
            }
        }
    
    def _group_by_provider(self) -> Dict[str, int]:
        """Group API calls by provider."""
        providers = {}
        for duration, provider in self.api_call_times:
            providers[provider] = providers.get(provider, 0) + 1
        return providers
    
    def reset(self):
        """Reset all metrics."""
        self.request_times.clear()
        self.db_query_times.clear()
        self.api_call_times.clear()
        self.error_count = 0
        self.total_requests = 0
        logger.info("Metrics reset")


# Global metrics instance
_metrics = MetricsCollector()


def record_request(duration_ms: float, error: bool = False):
    """Record HTTP request timing."""
    _metrics.record_request(duration_ms, error)


def record_db_query(duration_ms: float):
    """Record database query timing."""
    _metrics.record_db_query(duration_ms)


def record_api_call(duration_ms: float, provider: str):
    """Record external API call timing."""
    _metrics.record_api_call(duration_ms, provider)


def get_metrics_summary() -> Dict:
    """Get complete metrics summary."""
    return _metrics.get_summary()


class Timer:
    """Context manager for timing operations."""
    
    def __init__(self, metric_type: str = "request"):
        """
        Initialize timer.
        
        Args:
            metric_type: Type of metric (request, db_query, api_call)
        """
        self.metric_type = metric_type
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        duration_ms = (time.time() - self.start_time) * 1000
        
        if self.metric_type == "request":
            record_request(duration_ms, error=(exc_type is not None))
        elif self.metric_type == "db_query":
            record_db_query(duration_ms)
        elif self.metric_type == "api_call":
            record_api_call(duration_ms, "unknown")


# Async timer
class AsyncTimer:
    """Async context manager for timing operations."""
    
    def __init__(self, metric_type: str = "request", provider: str = None):
        """Initialize async timer."""
        self.metric_type = metric_type
        self.provider = provider
        self.start_time = None
    
    async def __aenter__(self):
        self.start_time = time.time()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        duration_ms = (time.time() - self.start_time) * 1000
        
        if self.metric_type == "request":
            record_request(duration_ms, error=(exc_type is not None))
        elif self.metric_type == "db_query":
            record_db_query(duration_ms)
        elif self.metric_type == "api_call":
            provider = self.provider or "unknown"
            record_api_call(duration_ms, provider)
