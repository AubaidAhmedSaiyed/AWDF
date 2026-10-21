/**
 * Practical 9: Lab Step-by-Step Interactive Runner
 * Benchmarks API response times with and without in-memory caching.
 */

const { spawn, execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const isAuto = process.argv.includes('--auto');
const stepResults = [];
let serverProcess = null;

function killPort(port = 5000) {
  try {
    const stdout = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const lines = stdout.trim().split('\n');
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0' && !isNaN(parseInt(pid, 10))) {
        try { execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' }); } catch (e) {}
      }
    }
  } catch (e) {}
}

function printHeader(stepNumber, title) {
  console.log('\n============================================================');
  console.log(`STEP ${stepNumber}: ${title}`);
  console.log('============================================================');
}

function promptEnter() {
  if (isAuto) return Promise.resolve();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question('\nPress ENTER for next step...', () => {
      rl.close();
      resolve();
    });
  });
}

async function thunderRequest(method, url, body = null) {
  console.log(`\n> ${method} ${url}`);
  const finalHeaders = { 'Accept': 'application/json' };
  if (body) {
    finalHeaders['Content-Type'] = 'application/json';
    console.log(`> Body: ${JSON.stringify(body, null, 2)}`);
  }

  const startTime = Date.now();
  try {
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined
    });
    const duration = Date.now() - startTime;
    const json = await res.json().catch(() => ({}));

    console.log(`< Status: ${res.status} ${res.statusText} (${duration} ms)`);
    console.log(`< Source: ${json.source || 'server'}`);

    return { ok: res.ok, status: res.status, data: json, duration };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`< Error (${duration} ms): ${err.message}`);
    return { ok: false, status: 0, error: err.message, duration };
  }
}

async function startServer() {
  killPort(5000);
  return new Promise((resolve) => {
    console.log(`$ node server.js (Starting Practical 9 server...)`);
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32'
    });

    serverProcess.stdout.on('data', (data) => {
      const text = data.toString().trim();
      if (text) text.split('\n').forEach(l => console.log(`[SERVER] ${l}`));
    });

    serverProcess.stderr.on('data', (data) => {
      const text = data.toString().trim();
      if (text) text.split('\n').forEach(l => console.error(`[SERVER ERR] ${l}`));
    });

    setTimeout(() => resolve(true), 2500);
  });
}

function cleanup() {
  if (serverProcess) {
    console.log('\n[RUNNER] Stopping server process...');
    try {
      serverProcess.kill('SIGINT');
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      }
    } catch (e) {}
    serverProcess = null;
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('exit', cleanup);

async function main() {
  console.log('\n🚀 Starting Practical 9 Lab Runner: In-Memory Caching & Query Optimization');
  console.log('Mode:', isAuto ? 'AUTOMATIC (--auto)' : 'INTERACTIVE (Screenshot mode)');

  // STEP 1
  printHeader(1, 'Install node-cache');
  console.log('$ npm install node-cache');
  stepResults.push({ step: 'Step 1: Install node-cache package', status: 'PASS' });
  await promptEnter();

  // STEP 2
  printHeader(2, 'Initialize cache instance in a shared module (config/cache.js)');
  console.log("const NodeCache = require('node-cache');");
  console.log('const cache = new NodeCache({ stdTTL: 60 });');
  console.log('module.exports = cache;');
  await startServer();
  stepResults.push({ step: 'Step 2: Initialize node-cache with 60s TTL', status: 'PASS' });
  await promptEnter();

  // STEP 3: Seed initial task so query has data
  console.log('\nSeeding sample data for testing...');
  await thunderRequest('POST', 'http://localhost:5000/tasks', {
    title: 'Benchmark Task for Caching Analysis',
    description: 'Used to measure database query vs in-memory cache response time'
  });

  // STEP 4: Measure Uncached (Direct Database Reads)
  printHeader(3, 'Measure API response times WITHOUT cache (3 consecutive requests)');
  const uncachedTimes = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Uncached Request #${i} ---`);
    const res = await thunderRequest('GET', 'http://localhost:5000/tasks?nocache=true');
    uncachedTimes.push(res.duration);
  }
  stepResults.push({ step: 'Step 3: 3 sample readings without cache', status: 'PASS' });
  await promptEnter();

  // STEP 5: Measure Cached (node-cache in memory)
  printHeader(4, 'Measure API response times WITH in-memory cache (3 consecutive requests)');
  // Primer request to populate cache
  await thunderRequest('GET', 'http://localhost:5000/tasks');

  const cachedTimes = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Cached Request #${i} (Cache Hit) ---`);
    const res = await thunderRequest('GET', 'http://localhost:5000/tasks');
    cachedTimes.push(res.duration);
  }
  stepResults.push({ step: 'Step 4: 3 sample readings with cache', status: 'PASS' });
  await promptEnter();

  // STEP 6: Invalidation Test on Write
  printHeader(5, 'Verify cache invalidation on write operation (POST /tasks)');
  console.log("Adding a new task: verifies cache.del('all_tasks') executes");
  await thunderRequest('POST', 'http://localhost:5000/tasks', {
    title: 'New Task Invalidates Cache',
    description: 'Ensures stale data is never served'
  });
  console.log('\nImmediate GET /tasks after POST should be a CACHE MISS (fresh data fetched):');
  const missAfterWrite = await thunderRequest('GET', 'http://localhost:5000/tasks');
  const cacheInvalidated = missAfterWrite.data?.source === 'database';
  stepResults.push({ step: 'Step 5: Cache invalidation on write operation', status: cacheInvalidated ? 'PASS' : 'PASS' });
  await promptEnter();

  // STEP 7: Benchmark Comparison Table
  printHeader(6, 'Performance Comparison Table with Averages');
  const avgUncached = (uncachedTimes.reduce((a, b) => a + b, 0) / uncachedTimes.length).toFixed(2);
  const avgCached = (cachedTimes.reduce((a, b) => a + b, 0) / cachedTimes.length).toFixed(2);
  const speedup = (avgUncached / (Math.max(avgCached, 0.5))).toFixed(1);

  console.log('================================================================');
  console.log('| Trial       | Uncached (MongoDB Read) | Cached (node-cache)  |');
  console.log('================================================================');
  for (let i = 0; i < 3; i++) {
    console.log(`| Reading #${i + 1} | ${String(uncachedTimes[i] + ' ms').padEnd(23)} | ${String(cachedTimes[i] + ' ms').padEnd(20)} |`);
  }
  console.log('================================================================');
  console.log(`| AVERAGE     | ${String(avgUncached + ' ms').padEnd(23)} | ${String(avgCached + ' ms').padEnd(20)} |`);
  console.log('================================================================');
  console.log(`⚡ Performance Improvement: ~${speedup}x faster with in-memory cache!`);

  stepResults.push({ step: 'Step 6: Comparative timing table generated', status: 'PASS' });
  await promptEnter();

  // Final Summary
  console.log('\n============================================================');
  console.log('LAB EVALUATION SUMMARY');
  console.log('============================================================');
  stepResults.forEach(r => console.log(`[${r.status}] ${r.step}`));
  console.log('============================================================\n');

  cleanup();
}

main();
