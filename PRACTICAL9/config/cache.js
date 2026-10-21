const NodeCache = require('node-cache');

// Step 2: Initialize a cache instance in a shared module with 60-second TTL
const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120
});

module.exports = cache;
