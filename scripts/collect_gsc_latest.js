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
  console.log('--- Starting Latest GSC Data Collection ---');

  // Start Session with Chrome (instance 7dd226e4)
  const sessionOutput = runBsk('session start --browser 7dd226e4');
  const sessionId = sessionOutput.trim().split(/\s+/).pop();
  console.log('Session ID:', sessionId);

  if (!sessionId || sessionId.includes('error')) {
    console.error('Failed to start session');
    return;
  }

  const results = {};
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    // 1. Fetch Performance
    console.log('[1/3] Navigating to Performance...');
    const perfUrl = 'https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:videotoquiz.com&num_of_days=28';
    runBsk(`navigate --session ${sessionId} "${perfUrl}"`);
    await sleep(4000);

    const snapshot1 = runBsk(`snapshot --session ${sessionId}`);
    results.performanceSnapshot = snapshot1;

    // Capture screenshot
    runBsk(`screenshot --session ${sessionId} --out "${path.join(artifactDir, 'gsc_performance_latest_1027.png')}"`);

    // 2. Fetch Pages tab
    console.log('[2/3] Fetching Pages tab...');
    const lines = snapshot1.split('\n');
    let pagesRef = null;
    for (const l of lines) {
      if (l.includes('tab "网页"') || l.includes('tab "Pages"')) {
        const m = l.match(/(@e\d+)/);
        if (m) { pagesRef = m[1]; break; }
      }
    }
    if (pagesRef) {
      runBsk(`click --session ${sessionId} --ref "${pagesRef}"`);
      await sleep(2500);
      results.pagesSnapshot = runBsk(`snapshot --session ${sessionId}`);
    }

    // 3. Fetch Sitemaps
    console.log('[3/3] Navigating to Sitemaps...');
    const sitemapUrl = 'https://search.google.com/search-console/sitemaps?resource_id=sc-domain:videotoquiz.com';
    runBsk(`navigate --session ${sessionId} "${sitemapUrl}"`);
    await sleep(4000);

    results.sitemapsSnapshot = runBsk(`snapshot --session ${sessionId}`);
    runBsk(`screenshot --session ${sessionId} --out "${path.join(artifactDir, 'gsc_sitemaps_latest_1027.png')}"`);

    // Save JSON data
    fs.writeFileSync(
      path.join(artifactDir, 'gsc_raw_latest_1027.json'),
      JSON.stringify(results, null, 2),
      'utf-8'
    );
    console.log('Saved GSC latest data to brain artifact directory.');
  } finally {
    runBsk(`session stop ${sessionId}`);
    console.log('Stopped session:', sessionId);
  }
}

main();
