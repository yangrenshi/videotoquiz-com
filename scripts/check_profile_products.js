const { execFileSync } = require('child_process');
const path = require('path');

function runBskArgs(args) {
  try {
    return execFileSync('bsk', args, { encoding: 'utf-8', timeout: 35000 });
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

const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
const sid = getSessionId(sOut);
const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

try {
  runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/profile/products']);
  const snap = runBskArgs(['snapshot', '--session', sid]);
  console.log('PitchWall My Products (profile/products):');
  const lines = snap.split('\n');
  for (const l of lines) {
    console.log('  ' + l.trim());
  }
  runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_my_products.png')]);
} finally {
  runBskArgs(['session', 'stop', sid]);
}
