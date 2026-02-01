## Bolt's Journal

## 2026-02-01 - Reusing Proxy Middleware
**Learning:** `http-proxy-middleware` v2 allows dynamic targeting via the `router` option. Instantiating the middleware once and using `router` avoids the overhead of creating new `HttpProxy` instances and parsing options on every request.
**Action:** When using `http-proxy-middleware` with dynamic targets, always favor the `router` option over recreating the middleware.
