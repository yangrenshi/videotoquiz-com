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
  runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/']);
  const script = `(() => {
    const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href }));
    return JSON.stringify(links.filter(l => l.text.includes('Product') || l.text.includes('My')));
  })()`;
  const res = runBskArgs(['evaluate', '--session', sid, script]);
  console.log('Links on pitchwall:', res);
} finally {
  runBskArgs(['session', 'stop', sid]);
}
