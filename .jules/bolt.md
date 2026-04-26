## 2026-04-26 - [Syntax Error in Reusing Proxy Middleware & Logger Format]
**Learning:** The proxy middleware was incorrectly duplicated multiple times in the controller, and Morgan format configuration failed due to redundant `const` declaration inside object parsing. Passing an object to Winston logger instead of a string directly improves performance.
**Action:** Removed redundant configurations and fixed Morgan logging to correctly pass structured objects directly to the Winston logger.
