## 2024-02-16 - Reusing Proxy Middleware
**Learning:** `http-proxy-middleware` should be instantiated once, not per request. Using the `router` option allows dynamic targeting without re-instantiation.
**Action:** When using proxy middleware with dynamic targets, use the `router` option instead of creating new instances inside the handler.
