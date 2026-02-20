## 2026-02-20 - [http-proxy-middleware Instantiation]
**Learning:** Instantiating `createProxyMiddleware` inside a request handler creates a new proxy instance and attaches new event listeners for every request, leading to memory leaks and high CPU usage.
**Action:** Always instantiate `createProxyMiddleware` at the module level (singleton) and use the `router` option to handle dynamic targets based on the request.
