const { execFileSync } = require('child_process');

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

try {
  runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/my-products']);
  const snap = runBskArgs(['snapshot', '--session', sid]);
  console.log('PitchWall My Products:');
  const lines = snap.split('\n');
  for (const l of lines) {
    if (l.includes('YouTube') || l.includes('Quiz') || l.includes('videotoquiz') || l.includes('Tarot') || l.includes('product')) {
      console.log('  ' + l.trim());
    }
  }
} finally {
  runBskArgs(['session', 'stop', sid]);
}
