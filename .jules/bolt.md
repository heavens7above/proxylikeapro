## 2024-05-23 - [Singleton Proxy Middleware]
**Learning:** Instantiating `http-proxy-middleware` inside a request handler is a significant performance anti-pattern. It creates new internal structures (agents, options parsing) for every request, leading to increased CPU usage and potential memory leaks from event listener accumulation.
**Action:** Use a singleton middleware instance with the `router` option to handle dynamic targets. This reuses the internal proxy instance while still allowing per-request target resolution.
