## 2026-02-05 - http-proxy-middleware Instantiation
**Learning:** Instantiating `http-proxy-middleware` inside request handlers is a major performance anti-pattern found in this codebase. It creates new internal HTTP agents and event listeners for every request, leading to memory leaks and high latency.
**Action:** Always refactor to a single middleware instance using the `router` option for dynamic targets.
