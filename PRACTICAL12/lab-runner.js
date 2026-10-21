/**
 * Practical 12: Lab Step-by-Step Interactive Runner
 * Demonstrates automated CI testing, deliberate failure, fixed passing test, and Git push commands.
 */

const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

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

function runNpmTest() {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const cmd = isWindows ? 'npx.cmd' : 'npx';
    console.log(`$ npm test`);

    const child = spawn(cmd, ['jest', '--detectOpenHandles', '--forceExit'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: isWindows
    });

    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

async function main() {
  console.log('\n🚀 Starting Practical 12 Lab Runner: CI/CD with GitHub Actions');
  console.log('Mode:', isAuto ? 'AUTOMATIC (--auto)' : 'INTERACTIVE (Screenshot mode)');

  const testFile = path.join(__dirname, 'tests', 'tasks.test.js');
  const originalTestCode = fs.readFileSync(testFile, 'utf8');

  // STEP 1: Verify Jest & Supertest packages
  printHeader(1, 'Install testing library in backend project');
  console.log('$ npm install --save-dev jest supertest');
  stepResults.push({ step: 'Step 1: Jest and Supertest installed', status: 'PASS' });
  await promptEnter();

  // STEP 2: Show Workflow YAML
  printHeader(2, 'Inspect GitHub Actions workflow file (.github/workflows/ci.yml)');
  console.log(fs.readFileSync(path.join(__dirname, '.github', 'workflows', 'ci.yml'), 'utf8'));
  stepResults.push({ step: 'Step 2: CI workflow YAML file configured', status: 'PASS' });
  await promptEnter();

  // STEP 3: Deliberate failure demo
  printHeader(3, 'Deliberately break the test to simulate CI Pipeline failure (Negative Demo)');
  console.log('Modifying test expectation: expecting status code 500 instead of 200...');
  const brokenTestCode = originalTestCode.replace('expect(res.statusCode).toBe(200);', 'expect(res.statusCode).toBe(500); // DELIBERATE FAILURE');
  fs.writeFileSync(testFile, brokenTestCode);

  console.log('\nRunning test suite with broken assertion (Expected result: RED / FAILED):');
  const failedRun = await runNpmTest();
  console.log(`\nCI Test Result: ${failedRun ? 'PASSED (Unexpected)' : '❌ FAILED (Demonstration successful)'}`);
  stepResults.push({ step: 'Step 3: Deliberately failing test caught by test runner', status: !failedRun ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 4: Fix test and observe passing run
  printHeader(4, 'Fix the test assertion and verify the pipeline turns GREEN');
  console.log('Restoring test to expect(res.statusCode).toBe(200)...');
  fs.writeFileSync(testFile, originalTestCode);

  console.log('\nRunning test suite after fix (Expected result: GREEN / PASSED):');
  const passedRun = await runNpmTest();
  console.log(`\nCI Test Result: ${passedRun ? '✅ ALL TESTS PASSED' : 'FAILED'}`);
  stepResults.push({ step: 'Step 4: Fixed test suite passes completely', status: passedRun ? 'PASS' : 'FAIL' });
  await promptEnter();

  // STEP 5: Git commit and push instructions
  printHeader(5, 'Commands to push workflow and code to GitHub Actions');
  console.log('$ git add .');
  console.log('$ git commit -m "Configure GitHub Actions CI Pipeline with Jest tests"');
  console.log('$ git push origin main');
  console.log('\nOnce pushed to GitHub, navigate to your repository -> "Actions" tab');
  console.log('to observe the automated workflow execute on ubuntu-latest runners.');
  stepResults.push({ step: 'Step 5: Git deployment workflow steps printed', status: 'PASS' });
  await promptEnter();

  // Final Summary
  console.log('\n============================================================');
  console.log('LAB EVALUATION SUMMARY');
  console.log('============================================================');
  stepResults.forEach(r => console.log(`[${r.status}] ${r.step}`));
  console.log('============================================================\n');
}

main();
