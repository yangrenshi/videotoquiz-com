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
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('PitchWall Followup SID:', sid);
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    // Check if the current page has changed
    const script = `
      (() => {
        return {
          url: window.location.href,
          title: document.title,
          text: document.body.innerText.slice(0, 1000)
        };
      })()
    `;
    const res = runBskArgs(['evaluate', '--session', sid, script]);
    console.log('Current state on PitchWall:\n', res);

    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_final_status.png')]);
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
