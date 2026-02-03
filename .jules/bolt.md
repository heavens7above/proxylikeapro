## 2026-02-03 - [Proxy Middleware Instantiation]
**Learning:** `http-proxy-middleware` is expensive to instantiate. Doing so per-request (to handle dynamic targets) is a major bottleneck.
**Action:** Always instantiate `createProxyMiddleware` once. Use the `router` option (function) to handle dynamic targets based on request parameters.
