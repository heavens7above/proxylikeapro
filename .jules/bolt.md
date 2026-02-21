## 2026-01-31 - Proxy Middleware Instantiation
**Learning:** Instantiating `http-proxy-middleware` on every request is a major performance anti-pattern. The `router` option allows a single middleware instance to handle dynamic targets efficiently.
**Action:** When using proxy middleware with dynamic targets, always use the `router` function instead of recreating the middleware.
## 2026-01-30 - [Reuse Proxy Middleware]
**Learning:** `http-proxy-middleware` instantiation includes option parsing and regex compilation. Recreating it on every request is a significant performance anti-pattern. The `router` option enables dynamic targeting with a single middleware instance.
**Action:** Always verify if middleware libraries support dynamic configuration via functions (like `router`) to avoid per-request instantiation.
