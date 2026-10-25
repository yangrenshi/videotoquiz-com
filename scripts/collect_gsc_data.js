const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runBsk(cmd) {
  try {
    return execSync(`bsk ${cmd}`, { encoding: 'utf-8', timeout: 30000 });
  } catch (err) {
    return err.stdout || err.message;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('--- Starting GSC Data Collection ---');

  // 1. Start Session
  const sessionOutput = runBsk('session start');
  const sessionId = sessionOutput.trim().split(/\s+/).pop();
  console.log('Session ID:', sessionId);

  if (!sessionId || sessionId.includes('error')) {
    console.error('Failed to start session');
    return;
  }

  const results = {};
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    // 2. Fetch Performance
    console.log('\n[1/3] Navigating to Performance...');
    const perfUrl = 'https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:videotoquiz.com&num_of_days=28';
    runBsk(`navigate --session ${sessionId} "${perfUrl}"`);
    await sleep(5000);

    // Click CTR & Position checkboxes if available
    const snapshot1 = runBsk(`snapshot --session ${sessionId}`);
    console.log('Snapshot Performance summary (first 500 chars):', snapshot1.slice(0, 500));
    results.performanceSnapshot = snapshot1;

    // Capture screenshot
    runBsk(`screenshot --session ${sessionId} --out "${path.join(artifactDir, 'gsc_performance_today.png')}"`);

    // 3. Fetch Indexing
    console.log('\n[2/3] Navigating to Indexing...');
    const indexUrl = 'https://search.google.com/search-console/index?resource_id=sc-domain:videotoquiz.com';
    runBsk(`navigate --session ${sessionId} "${indexUrl}"`);
    await sleep(5000);

    const snapshot2 = runBsk(`snapshot --session ${sessionId}`);
    console.log('Snapshot Indexing summary (first 500 chars):', snapshot2.slice(0, 500));
    results.indexingSnapshot = snapshot2;

    runBsk(`screenshot --session ${sessionId} --out "${path.join(artifactDir, 'gsc_indexing_today.png')}"`);

    // 4. Fetch Sitemaps
    console.log('\n[3/3] Navigating to Sitemaps...');
    const sitemapUrl = 'https://search.google.com/search-console/sitemaps?resource_id=sc-domain:videotoquiz.com';
    runBsk(`navigate --session ${sessionId} "${sitemapUrl}"`);
    await sleep(5000);

    const snapshot3 = runBsk(`snapshot --session ${sessionId}`);
    console.log('Snapshot Sitemaps summary (first 500 chars):', snapshot3.slice(0, 500));
    results.sitemapsSnapshot = snapshot3;

    runBsk(`screenshot --session ${sessionId} --out "${path.join(artifactDir, 'gsc_sitemaps_today.png')}"`);

    // Save JSON data
    fs.writeFileSync(
      path.join(artifactDir, 'gsc_raw_today.json'),
      JSON.stringify(results, null, 2),
      'utf-8'
    );
    console.log('\nSaved GSC raw data to brain artifact directory.');
  } finally {
    runBsk(`session stop ${sessionId}`);
    console.log('Stopped session:', sessionId);
  }
}

main();
