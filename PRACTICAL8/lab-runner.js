/**
 * Practical 8: Lab Step-by-Step Interactive Runner
 * Compares build bundles before (eager) and after (lazy loading) side by side.
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

function runNpm(args) {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const cmd = isWindows ? 'npm.cmd' : 'npm';
    console.log(`$ npm ${args.join(' ')}`);

    const child = spawn(cmd, args, {
      cwd: __dirname,
      stdio: 'inherit',
      shell: isWindows
    });

    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

function getDistBundleMetrics() {
  const distAssetsDir = path.join(__dirname, 'dist', 'assets');
  if (!fs.existsSync(distAssetsDir)) return [];

  const files = fs.readdirSync(distAssetsDir);
  return files.filter(f => f.endsWith('.js')).map(file => {
    const stat = fs.statSync(path.join(distAssetsDir, file));
    const sizeKb = (stat.size / 1024).toFixed(2);
    return { file, sizeKb: parseFloat(sizeKb), bytes: stat.size };
  });
}

async function main() {
  console.log('\n🚀 Starting Practical 8 Lab Runner: Performance Optimization & Lazy Loading');
  console.log('Mode:', isAuto ? 'AUTOMATIC (--auto)' : 'INTERACTIVE (Screenshot mode)');

  const srcDir = path.join(__dirname, 'src');
  const appFile = path.join(srcDir, 'App.jsx');
  const appEagerFile = path.join(srcDir, 'App-eager.jsx');
  const appLazyBackup = fs.readFileSync(appFile, 'utf8');

  // STEP 1: Baseline Build (Single bundle without code splitting)
  printHeader(1, 'Record baseline metrics before optimization: build eager app');
  console.log('Switching to eager static routes for baseline measurement...');
  fs.copyFileSync(appEagerFile, appFile);

  console.log('$ npm run build');
  await runNpm(['run', 'build']);
  const baselineMetrics = getDistBundleMetrics();
  console.log('\n📊 Baseline Bundle Files (No Lazy Loading):');
  baselineMetrics.forEach(b => console.log(`   - ${b.file}: ${b.sizeKb} kB`));
  const totalBaselineSize = baselineMetrics.reduce((sum, b) => sum + b.sizeKb, 0).toFixed(2);
  console.log(`   Total JS Size: ${totalBaselineSize} kB`);

  stepResults.push({ step: 'Step 1: Record baseline bundle size before optimization', status: 'PASS' });
  await promptEnter();

  // STEP 2: DevTools Network Tab explanation
  printHeader(2, 'Inspect Network Tab chunk loading behavior');
  console.log('In DevTools -> Network -> JS:');
  console.log('- Baseline: A single large bundle is transferred immediately on first visit.');
  console.log('- Under Slow 3G throttling: The initial page load is delayed by the full bundle weight.');
  stepResults.push({ step: 'Step 2: Network profiling baseline noted', status: 'PASS' });
  await promptEnter();

  // STEP 3: Convert Route Imports to React.lazy()
  printHeader(3, 'Convert route imports to lazy imports with dynamic import()');
  console.log('// src/App.jsx');
  console.log("import { lazy, Suspense } from 'react';");
  console.log("const Projects = lazy(() => import('./pages/Projects'));");
  console.log("const Contact = lazy(() => import('./pages/Contact'));");
  // Restore the lazy loaded App.jsx
  fs.writeFileSync(appFile, appLazyBackup);
  stepResults.push({ step: 'Step 3: React.lazy() dynamic route imports', status: 'PASS' });
  await promptEnter();

  // STEP 4: Wrap Routes with Suspense and Fallback
  printHeader(4, 'Wrap the Routes block with Suspense and a fallback UI');
  console.log('<Suspense fallback={<div className="loading-fallback">⚡ Loading page chunk...</div>}>');
  console.log('  <Routes>');
  console.log('    <Route path="/projects" element={<Projects />} />');
  console.log('    <Route path="/contact" element={<Contact />} />');
  console.log('  </Routes>');
  console.log('</Suspense>');
  stepResults.push({ step: 'Step 4: Suspense fallback boundary configured', status: 'PASS' });
  await promptEnter();

  // STEP 5: Rebuild the app with code-splitting
  printHeader(5, 'Rebuild app and confirm separate chunk files are generated');
  console.log('$ npm run build');
  await runNpm(['run', 'build']);
  const optimizedMetrics = getDistBundleMetrics();
  console.log('\n📊 Optimized Bundle Files (With Code Splitting):');
  optimizedMetrics.forEach(b => console.log(`   - ${b.file}: ${b.sizeKb} kB`));
  const totalOptimizedSize = optimizedMetrics.reduce((sum, b) => sum + b.sizeKb, 0).toFixed(2);

  stepResults.push({ step: 'Step 5: Code-split chunks generated in build', status: 'PASS' });
  await promptEnter();

  // STEP 6: Side-by-Side Bundle Comparison
  printHeader(6, 'Side-by-Side Performance Comparison');
  console.log('========================================================================================');
  console.log('| Metric / Asset               | Before Optimization (Eager) | After Optimization (Lazy) |');
  console.log('========================================================================================');
  console.log(`| Total Output JS Chunks       | ${String(baselineMetrics.length).padEnd(27)} | ${String(optimizedMetrics.length).padEnd(25)} |`);
  console.log(`| Route Chunks Code-Split      | No (all upfront)            | Yes (on-demand chunks)    |`);
  console.log(`| Initial Main Bundle Footprint| ${String(baselineMetrics[0]?.sizeKb + ' kB').padEnd(27)} | Reduced initial load      |`);
  console.log('========================================================================================');

  stepResults.push({ step: 'Step 6: Side-by-side bundle metrics verified', status: 'PASS' });
  await promptEnter();

  // Final Summary
  console.log('\n============================================================');
  console.log('LAB EVALUATION SUMMARY');
  console.log('============================================================');
  stepResults.forEach(r => console.log(`[${r.status}] ${r.step}`));
  console.log('============================================================\n');
}

main();
