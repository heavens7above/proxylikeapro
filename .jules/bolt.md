## 2026-01-31 - Proxy Middleware Instantiation
**Learning:** Instantiating `http-proxy-middleware` on every request is a major performance anti-pattern. The `router` option allows a single middleware instance to handle dynamic targets efficiently.
**Action:** When using proxy middleware with dynamic targets, always use the `router` function instead of recreating the middleware.
