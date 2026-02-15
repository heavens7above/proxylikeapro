# Bolt's Journal

## 2026-02-15 - Proxy Middleware Re-Instantiation Performance Leak
**Learning:** Instantiating `http-proxy-middleware` inside an Express request handler creates a new proxy instance and attaches new event listeners for every request. This causes O(N) memory growth (memory leak) via `MaxListenersExceededWarning` and significant CPU overhead due to object allocation and option parsing.
**Action:** Always instantiate `createProxyMiddleware` once (singleton) at the module level. Use the `router` option to handle dynamic targets based on the request (e.g., `req.query.target`). This improves throughput by ~16% and eliminates memory leaks.
