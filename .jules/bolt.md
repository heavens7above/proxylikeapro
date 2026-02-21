## 2026-01-30 - [Reuse Proxy Middleware]
**Learning:** `http-proxy-middleware` instantiation includes option parsing and regex compilation. Recreating it on every request is a significant performance anti-pattern. The `router` option enables dynamic targeting with a single middleware instance.
**Action:** Always verify if middleware libraries support dynamic configuration via functions (like `router`) to avoid per-request instantiation.
