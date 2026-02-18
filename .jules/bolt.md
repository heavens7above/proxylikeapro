## 2024-05-23 - Middleware Instantiation Anti-Pattern
**Learning:** Instantiating `http-proxy-middleware` inside a request handler creates a new proxy instance (and associated event listeners) for every request. This causes memory leaks and significant performance overhead.
**Action:** Always instantiate middleware at the module level. Use the `router` option for dynamic targets instead of creating new instances.
