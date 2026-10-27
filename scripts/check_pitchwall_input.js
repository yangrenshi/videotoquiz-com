const { execSync } = require('child_process');

function runBsk(cmd) {
  try {
    return execSync(`bsk ${cmd}`, { encoding: 'utf-8', timeout: 35000 });
  } catch (e) {
    return (e.stdout ? e.stdout.toString() : '') + ' ' + (e.stderr ? e.stderr.toString() : e.message);
  }
}

function getSessionId(sOut) {
  const lines = sOut.trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (/^[a-z0-9]{4}$/.test(trimmed)) {
      return trimmed;
    }
  }
  return null;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const sOut = runBsk('session start --browser 7dd226e4');
  const sid = getSessionId(sOut);
  console.log('PitchWall SID:', sid);
  try {
    runBsk(`navigate --session ${sid} "https://pitchwall.co/product/submit?plan=free"`);
    await sleep(3500);

    const snap = runBsk(`snapshot --session ${sid}`);
    const lines = snap.split('\n');
    console.log('Searching for main area inputs:');
    let inMain = false;
    for (const l of lines) {
      if (l.includes('main "Enter Your Product URL"')) inMain = true;
      if (l.includes('separator')) inMain = false;
      if (inMain) console.log('  ' + l);
    }
  } finally {
    runBsk(`session stop ${sid}`);
  }
}

main();
