const crypto = require('crypto');

let cachedPassword = 'mysecretpassword';
let cachedPasswordBuffer = Buffer.from(cachedPassword);

// Original
const safeCompare = (a, targetBuffer) => {
  const bufferA = Buffer.from(a);

  if (!targetBuffer || bufferA.length !== targetBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, targetBuffer);
};

// Optimized
let cachedInput = null;
let cachedInputBuffer = null;

const safeCompareOptimized = (a, targetBuffer) => {
  let bufferA;
  if (a === cachedInput) {
    bufferA = cachedInputBuffer;
  } else {
    bufferA = Buffer.from(a);
    cachedInput = a;
    cachedInputBuffer = bufferA;
  }

  if (!targetBuffer || bufferA.length !== targetBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, targetBuffer);
};

const NUM_ITERATIONS = 5000000;

console.log('Benchmarking safeCompare...');
const start1 = performance.now();
for (let i = 0; i < NUM_ITERATIONS; i++) {
  safeCompare('mysecretpassword', cachedPasswordBuffer);
}
const end1 = performance.now();
console.log(`Original: ${end1 - start1} ms`);

console.log('Benchmarking safeCompareOptimized...');
const start2 = performance.now();
for (let i = 0; i < NUM_ITERATIONS; i++) {
  safeCompareOptimized('mysecretpassword', cachedPasswordBuffer);
}
const end2 = performance.now();
console.log(`Optimized: ${end2 - start2} ms`);

console.log(`Improvement: ${((end1 - start1 - (end2 - start2)) / (end1 - start1) * 100).toFixed(2)}%`);
