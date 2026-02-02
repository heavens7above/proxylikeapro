## 2024-05-22 - [Middleware Instantiation Overhead]
**Learning:** Instantiating `http-proxy-middleware` inside the request handler adds significant overhead (parsing options, internal setup) per request.
**Action:** Always instantiate middleware at the module level. Use the `router` option for dynamic targets.
