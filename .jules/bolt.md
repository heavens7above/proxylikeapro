## 2026-02-22 - HTTP Proxy Middleware Path Handling
**Learning:** When using `http-proxy-middleware` inside an Express router (e.g., `router.use('/proxy', ...)`), the middleware still sees and uses the full path (including the prefix). To proxy correctly to the target root, explicit `pathRewrite: {'^/proxy': ''}` is required, even if Express strips the prefix for its own routing.
**Action:** Always verify `pathRewrite` configuration when mounting proxy middleware on sub-paths, and use debug logging to confirm the actual path being requested from the target.

## 2026-02-22 - Codebase Corruption Recovery
**Learning:** Encountered files (`app.js`, `logger.js`, `proxy.controller.js`) containing duplicate code blocks and syntax errors, characteristic of unresolved merge conflicts or copy-paste errors.
**Action:** When tests fail with syntax errors, inspect the file content immediately for duplicate declarations or blocks before attempting logic fixes.
