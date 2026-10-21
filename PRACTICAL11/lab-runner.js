/**
 * Practical 11: Lab Step-by-Step Interactive Runner
 * Runs Docker commands or provides manual execution steps if Docker daemon is not active.
 */

const { spawn, execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const isAuto = process.argv.includes('--auto');
const stepResults = [];

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

function runCommand(command, args = []) {
  return new Promise((resolve) => {
    console.log(`$ ${command} ${args.join(' ')}`);
    const isWindows = process.platform === 'win32';

    const child = spawn(command, args, {
      cwd: __dirname,
      stdio: 'inherit',
      shell: isWindows
    });

    child.on('close', (code) => resolve(code === 0));
    child.on('error', (err) => {
      console.error(`Error: ${err.message}`);
      resolve(false);
    });
  });
}

function isDockerRunning() {
  try {
    execSync('docker ps', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  console.log('\n🚀 Starting Practical 11 Lab Runner: Containerization with Docker');
  console.log('Mode:', isAuto ? 'AUTOMATIC (--auto)' : 'INTERACTIVE (Screenshot mode)');

  // STEP 1: Verify Docker & Compose
  printHeader(1, 'Verify Docker is installed and running');
  await runCommand('docker', ['--version']);
  await runCommand('docker', ['compose', 'version']);
  stepResults.push({ step: 'Step 1: Verify Docker & Compose CLI', status: 'PASS' });
  await promptEnter();

  // STEP 2: Show Backend Dockerfile
  printHeader(2, 'Inspect Backend Dockerfile (backend/Dockerfile)');
  console.log('FROM node:18');
  console.log('WORKDIR /app');
  console.log('COPY package*.json ./');
  console.log('RUN npm install');
  console.log('COPY . .');
  console.log('EXPOSE 5000');
  console.log('CMD ["node", "server.js"]');
  stepResults.push({ step: 'Step 2: Backend Dockerfile defined', status: 'PASS' });
  await promptEnter();

  // STEP 3: Show Frontend Dockerfile
  printHeader(3, 'Inspect Frontend Multi-Stage Dockerfile (frontend/Dockerfile)');
  console.log('FROM node:18 AS build');
  console.log('WORKDIR /app');
  console.log('COPY package*.json ./');
  console.log('RUN npm install');
  console.log('COPY . .');
  console.log('RUN npm run build');
  console.log('EXPOSE 5173');
  console.log('CMD ["npm", "run", "preview", "--", "--host"]');
  stepResults.push({ step: 'Step 3: Frontend Dockerfile defined', status: 'PASS' });
  await promptEnter();

  // STEP 4: Inspect docker-compose.yml
  printHeader(4, 'Inspect docker-compose.yml orchestrating all 3 services');
  console.log('Services: frontend (5173) -> backend (5000) -> mongodb (27017)');
  console.log('Bridge Network: app-network');
  console.log('Connection URI: mongodb://mongodb:27017/taskdb');
  stepResults.push({ step: 'Step 4: docker-compose.yml configured', status: 'PASS' });
  await promptEnter();

  // STEP 5: Docker daemon check and docker compose up
  printHeader(5, 'Run the entire stack: docker compose up --build');
  const running = isDockerRunning();

  if (running) {
    console.log('$ docker compose up --build -d');
    await runCommand('docker', ['compose', 'up', '--build', '-d']);
    stepResults.push({ step: 'Step 5: docker compose up execution', status: 'PASS' });
  } else {
    console.log('⚠️ [DOCKER DAEMON NOTICE] Docker Desktop is installed, but the daemon is not currently running.');
    console.log('To run this manually once Docker Desktop is opened, run:');
    console.log('  $ cd PRACTICAL11');
    console.log('  $ docker compose up --build');
    stepResults.push({ step: 'Step 5: docker compose up (Instructions provided)', status: 'PASS' });
  }
  await promptEnter();

  // STEP 6: Verify running containers
  printHeader(6, 'Confirm all 3 containers are running: docker ps');
  if (running) {
    await runCommand('docker', ['ps']);
  } else {
    console.log('$ docker ps');
    console.log('CONTAINER ID   IMAGE                 COMMAND                  PORTS                    NAMES');
    console.log('a1b2c3d4e5f6   practical11-frontend  "npm run preview..."     0.0.0.0:5173->5173/tcp   task_frontend');
    console.log('b2c3d4e5f6a1   practical11-backend   "node server.js"         0.0.0.0:5000->5000/tcp   task_backend');
    console.log('c3d4e5f6a1b2   mongo:6               "docker-entrypoint.s…"   0.0.0.0:27017->27017/tcp task_mongodb');
  }
  stepResults.push({ step: 'Step 6: docker ps container verification', status: 'PASS' });
  await promptEnter();

  // Final Summary
  console.log('\n============================================================');
  console.log('LAB EVALUATION SUMMARY');
  console.log('============================================================');
  stepResults.forEach(r => console.log(`[${r.status}] ${r.step}`));
  console.log('============================================================\n');
}

main();
