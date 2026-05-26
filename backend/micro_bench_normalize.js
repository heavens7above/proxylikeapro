const regexNormalize = (url) => url.replace(/\/$/, '');
const stringNormalize = (url) => url.endsWith('/') ? url.slice(0, -1) : url;

const testUrl1 = 'https://example.com/';
const testUrl2 = 'https://example.com/api/v1';

const iterations = 10000000;

console.time('regex');
for (let i = 0; i < iterations; i++) {
  regexNormalize(testUrl1);
  regexNormalize(testUrl2);
}
console.timeEnd('regex');

console.time('string');
for (let i = 0; i < iterations; i++) {
  stringNormalize(testUrl1);
  stringNormalize(testUrl2);
}
console.timeEnd('string');
