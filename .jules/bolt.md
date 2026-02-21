## 2026-02-03 - [Proxy Middleware Instantiation]
**Learning:** `http-proxy-middleware` is expensive to instantiate. Doing so per-request (to handle dynamic targets) is a major bottleneck.
**Action:** Always instantiate `createProxyMiddleware` once. Use the `router` option (function) to handle dynamic targets based on request parameters.
## 2024-05-22 - [Middleware Instantiation Overhead]
**Learning:** Instantiating `http-proxy-middleware` inside the request handler adds significant overhead (parsing options, internal setup) per request.
**Action:** Always instantiate middleware at the module level. Use the `router` option for dynamic targets.
## Bolt's Journal

## 2026-02-01 - Reusing Proxy Middleware
**Learning:** `http-proxy-middleware` v2 allows dynamic targeting via the `router` option. Instantiating the middleware once and using `router` avoids the overhead of creating new `HttpProxy` instances and parsing options on every request.
**Action:** When using `http-proxy-middleware` with dynamic targets, always favor the `router` option over recreating the middleware.
## 2026-01-31 - Proxy Middleware Instantiation
**Learning:** Instantiating `http-proxy-middleware` on every request is a major performance anti-pattern. The `router` option allows a single middleware instance to handle dynamic targets efficiently.
**Action:** When using proxy middleware with dynamic targets, always use the `router` function instead of recreating the middleware.
## 2026-01-30 - [Reuse Proxy Middleware]
**Learning:** `http-proxy-middleware` instantiation includes option parsing and regex compilation. Recreating it on every request is a significant performance anti-pattern. The `router` option enables dynamic targeting with a single middleware instance.
**Action:** Always verify if middleware libraries support dynamic configuration via functions (like `router`) to avoid per-request instantiation.
