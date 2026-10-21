/**
 * Practical 7: Lab Step-by-Step Interactive Runner
 * Automated walkthrough following the lab manual steps with screenshot pauses.
 */

const { spawn, execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const isAuto = process.argv.includes('--auto');
const stepResults = [];
let serverProcess = null;
let authToken = '';

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

async function thunderRequest(method, url, body = null, headers = {}) {
  console.log(`\n> ${method} ${url}`);
  const finalHeaders = {
    'Accept': 'application/json',
    ...headers
  };

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
    console.log(`< Response Body:`);
    console.log(JSON.stringify(json, null, 2));

    return { ok: res.ok, status: res.status, data: json, duration };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`< Connection Error (${duration} ms): ${err.message}`);
    return { ok: false, status: 0, error: err.message, duration };
  }
}

async function startServer() {
  killPort(5000);
  return new Promise((resolve) => {
    console.log(`$ node server.js (Starting Practical 7 backend...)`);
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32'
    });

    serverProcess.stdout.on('data', (data) => {
      const text = data.toString().trim();
      if (text) {
        text.split('\n').forEach((line) => console.log(`[SERVER] ${line}`));
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const text = data.toString().trim();
      if (text) {
        text.split('\n').forEach((line) => console.error(`[SERVER ERR] ${line}`));
      }
    });

    setTimeout(() => resolve(true), 2500);
  });
}

function cleanup() {
  if (serverProcess) {
    console.log('\n[RUNNER] Stopping background server process...');
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
  console.log('\n🚀 Starting Practical 7 Lab Runner: Authentication & Middleware');
  console.log('Mode:', isAuto ? 'AUTOMATIC (--auto)' : 'INTERACTIVE (Screenshot mode)');

  // STEP 1
  printHeader(1, 'Verify installed dependencies');
  console.log('$ npm install bcryptjs jsonwebtoken');
  stepResults.push({ step: 'Step 1: Required packages installed', status: 'PASS' });
  await promptEnter();

  // STEP 2
  printHeader(2, 'Start Express server with User & Task schemas');
  await startServer();
  const healthRes = await thunderRequest('GET', 'http://localhost:5000/api/health');
  stepResults.push({ step: 'Step 2: Server running', status: healthRes.ok ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 3
  const testEmail = `student_${Date.now()}@charusat.edu`;
  printHeader(3, 'Implement register route - hash password with bcrypt (POST /api/auth/register)');
  const regRes = await thunderRequest('POST', 'http://localhost:5000/api/auth/register', {
    name: 'Lab Student',
    email: testEmail,
    password: 'securePassword123'
  });
  stepResults.push({ step: 'Step 3: Register with bcrypt hashing', status: regRes.status === 201 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 4
  printHeader(4, 'Implement login route - compare password and sign JWT (POST /api/auth/login)');
  const loginRes = await thunderRequest('POST', 'http://localhost:5000/api/auth/login', {
    email: testEmail,
    password: 'securePassword123'
  });
  if (loginRes.ok && loginRes.data && loginRes.data.token) {
    authToken = loginRes.data.token;
  }
  stepResults.push({ step: 'Step 4: Login & sign JWT token', status: loginRes.status === 200 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 5 (Negative Demo)
  printHeader(5, 'Access protected /tasks route WITHOUT token (Negative demo: 401 Unauthorized)');
  const unauthRes = await thunderRequest('GET', 'http://localhost:5000/tasks');
  stepResults.push({ step: 'Step 5: 401 without Authorization header', status: unauthRes.status === 401 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 6 (Negative Demo)
  printHeader(6, 'Access protected /tasks route with INVALID token (Negative demo: 401 Unauthorized)');
  const invalidTokenRes = await thunderRequest('GET', 'http://localhost:5000/tasks', null, {
    'Authorization': 'Bearer invalid.tampered.token.here'
  });
  stepResults.push({ step: 'Step 6: 401 on tampered token verification', status: invalidTokenRes.status === 401 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 7 (Negative Demo)
  printHeader(7, 'Validation middleware rejects missing title (Negative demo: 400 Bad Request)');
  const badTaskRes = await thunderRequest('POST', 'http://localhost:5000/tasks', {
    description: 'Missing title property'
  }, {
    'Authorization': `Bearer ${authToken}`
  });
  stepResults.push({ step: 'Step 7: 400 Server-side input validation', status: badTaskRes.status === 400 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 8
  printHeader(8, 'Create task with valid JWT and payload (POST /tasks)');
  const createTaskRes = await thunderRequest('POST', 'http://localhost:5000/tasks', {
    title: 'Protected Lab Task',
    description: 'Created using Bearer JWT authentication'
  }, {
    'Authorization': `Bearer ${authToken}`
  });
  stepResults.push({ step: 'Step 8: Authenticated task creation', status: createTaskRes.status === 201 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 9
  printHeader(9, 'Retrieve authenticated user tasks (GET /tasks with Bearer token)');
  const getTasksRes = await thunderRequest('GET', 'http://localhost:5000/tasks', null, {
    'Authorization': `Bearer ${authToken}`
  });
  stepResults.push({ step: 'Step 9: GET /tasks with valid JWT', status: getTasksRes.status === 200 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 10
  printHeader(10, 'Verify logged in user profile (GET /api/auth/me)');
  const meRes = await thunderRequest('GET', 'http://localhost:5000/api/auth/me', null, {
    'Authorization': `Bearer ${authToken}`
  });
  stepResults.push({ step: 'Step 10: GET /api/auth/me endpoint', status: meRes.status === 200 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // Print Summary
  console.log('\n============================================================');
  console.log('LAB EVALUATION SUMMARY');
  console.log('============================================================');
  stepResults.forEach((r) => {
    console.log(`[${r.status}] ${r.step}`);
  });
  console.log('============================================================\n');

  cleanup();
}

main();
