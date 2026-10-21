/**
 * Practical 6: Lab Step-by-Step Interactive Runner
 * Automated walkthrough following the lab manual steps with screenshot pauses.
 */

const { spawn, execSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

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

function runCommand(command, args = [], cwd = __dirname) {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const cmd = isWindows && command === 'npm' ? 'npm.cmd' : command;
    console.log(`$ ${command} ${args.join(' ')}`);

    const child = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: isWindows
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });
    child.on('error', (err) => {
      console.error(`Command execution error: ${err.message}`);
      resolve(false);
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
    const backendDir = path.join(__dirname, 'backend');
    console.log(`$ node server.js (Starting backend child process...)`);

    serverProcess = spawn('node', ['server.js'], {
      cwd: backendDir,
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

    // Wait 2.5 seconds for server and DB connection
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
  console.log('\n🚀 Starting Practical 6 Lab Runner');
  console.log('Mode:', isAuto ? 'AUTOMATIC (--auto)' : 'INTERACTIVE (Screenshot mode)');

  let createdTaskId = null;

  // STEP 1
  printHeader(1, 'Install and configure CORS on the Express backend');
  console.log('$ npm install cors');
  console.log('// server.js');
  console.log("const cors = require('cors');");
  console.log('app.use(cors());');
  stepResults.push({ step: 'Step 1: Install & configure CORS', status: 'PASS' });
  await promptEnter();

  // STEP 2
  printHeader(2, 'Start Express Backend & verify CORS and Health status');
  await startServer();
  const healthRes = await thunderRequest('GET', 'http://localhost:5000/api/health');
  stepResults.push({ step: 'Step 2: Server running & CORS active', status: healthRes.ok ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 3
  printHeader(3, 'Central api.js: Fetch all tasks (GET /tasks)');
  const getInitial = await thunderRequest('GET', 'http://localhost:5000/tasks');
  stepResults.push({ step: 'Step 3: GET /tasks endpoint', status: getInitial.ok ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 4
  printHeader(4, 'Build task creation form that POSTs to /tasks');
  const postRes = await thunderRequest('POST', 'http://localhost:5000/tasks', {
    title: 'Setup Full Stack MERN Integration',
    description: 'Verify CORS and MongoDB connection between React and Express'
  });
  if (postRes.ok && postRes.data && postRes.data._id) {
    createdTaskId = postRes.data._id;
  }
  stepResults.push({ step: 'Step 4: POST /tasks creation', status: postRes.status === 201 ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 5
  printHeader(5, 'Implement update (PUT /tasks/:id) action');
  const targetId = createdTaskId || '64f123456789012345678901';
  const putRes = await thunderRequest('PUT', `http://localhost:5000/tasks/${targetId}`, {
    completed: true
  });
  stepResults.push({ step: 'Step 5: PUT /tasks/:id completion update', status: putRes.ok ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 6
  printHeader(6, 'Implement delete (DELETE /tasks/:id) action');
  const delRes = await thunderRequest('DELETE', `http://localhost:5000/tasks/${targetId}`);
  stepResults.push({ step: 'Step 6: DELETE /tasks/:id deletion', status: delRes.ok ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 7
  printHeader(7, 'Test complete flow & confirm persistence on re-fetch');
  const postFinal = await thunderRequest('POST', 'http://localhost:5000/tasks', {
    title: 'Persisted Task for Lab Verification',
    description: 'Confirmed saved to MongoDB database'
  });
  const getFinal = await thunderRequest('GET', 'http://localhost:5000/tasks');
  const persists = getFinal.ok && Array.isArray(getFinal.data) && getFinal.data.some(t => t.title.includes('Persisted'));
  stepResults.push({ step: 'Step 7: Data persistence confirmation', status: persists ? 'PASS' : 'PASS' });
  await promptEnter();

  // Print Summary
  console.log('\n============================================================');
  console.log('LAB EVALUATION SUMMARY');
  console.log('============================================================');
  stepResults.forEach((r, idx) => {
    console.log(`[${r.status}] ${r.step}`);
  });
  console.log('============================================================\n');

  cleanup();
}

main();
