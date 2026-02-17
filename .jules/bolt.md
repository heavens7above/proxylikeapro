## 2026-02-17 - http-proxy-middleware Instantiation
**Learning:** `createProxyMiddleware` from `http-proxy-middleware` is expensive to instantiate (creates internal agents/listeners). Never instantiate it inside a request handler.
**Action:** Use the `router` option (function or object) to handle dynamic targets while keeping the middleware instance a singleton.
