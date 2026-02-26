const { createProxyMiddleware } = require('http-proxy-middleware');

const iterations = 10000;

console.log(`Running ${iterations} iterations for middleware creation vs reuse.`);

console.time('Re-creation');
for (let i = 0; i < iterations; i++) {
    createProxyMiddleware({
        target: 'http://example.com',
        changeOrigin: true,
        pathRewrite: { '^/proxy': '' },
    });
}
console.timeEnd('Re-creation');

const proxy = createProxyMiddleware({
    target: 'http://example.com',
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
    router: (req) => 'http://example.com'
});

console.time('Reuse');
for (let i = 0; i < iterations; i++) {
    // accessing the middleware instance is free
    // effectively we are testing creation time vs 0 (lookup time)
}
console.timeEnd('Reuse');
