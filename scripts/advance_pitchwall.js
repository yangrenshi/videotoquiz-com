const { execFileSync } = require('child_process');
const path = require('path');

function runBskArgs(args) {
  try {
    return execFileSync('bsk', args, { encoding: 'utf-8', timeout: 45000 });
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
  console.log('=== PitchWall Advancing Form Started ===');
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('SID:', sid);
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    // 1. Click Next
    console.log('Clicking Next on PitchWall...');
    let snap = runBskArgs(['snapshot', '--session', sid]);
    let nextMatch = snap.match(/(@e\d+)\s+button\s+"Next"/i);
    if (nextMatch) {
      console.log('Clicking Next ref:', nextMatch[1]);
      runBskArgs(['click', '--session', sid, '--ref', nextMatch[1]]);
      await sleep(3500);
    } else {
      const clickNextDom = `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const n = btns.find(b => (b.innerText || '').trim() === 'Next');
          if (n) { n.click(); return 'CLICKED_NEXT_DOM'; }
          return 'NO_NEXT_DOM';
        })()
      `;
      const res = runBskArgs(['evaluate', '--session', sid, clickNextDom]);
      console.log('Click Next DOM:', res.trim());
      await sleep(3500);
    }

    // 2. Snapshot of step 2
    snap = runBskArgs(['snapshot', '--session', sid]);
    console.log('Step 2 Snapshot:\n', snap);

    // 3. Look for Next or Submit or Finish
    const clickFinalScript = `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const sub = btns.find(b => {
          const t = (b.innerText || '').toLowerCase().trim();
          return t === 'submit' || t === 'submit product' || t === 'finish' || t === 'publish' || t === 'save' || t === 'next';
        });
        if (sub) {
          sub.click();
          return 'CLICKED_FINAL: ' + sub.innerText.trim();
        }
        return 'NO_FINAL_BTN';
      })()
    `;
    const fRes = runBskArgs(['evaluate', '--session', sid, clickFinalScript]);
    console.log('Final Click Result:', fRes.trim());
    await sleep(4000);

    // Check again
    snap = runBskArgs(['snapshot', '--session', sid]);
    const lines = snap.split('\n');
    for (const l of lines) {
      if (l.includes('button') || l.includes('Review') || l.includes('Success') || l.includes('Submitted')) {
        console.log('  ' + l.trim());
      }
    }

    // 4. Save screenshot
    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_submit_success.png')]);
    console.log('PitchWall Final Screenshot Saved!');
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
