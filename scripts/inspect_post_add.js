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
  runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/product/submit?plan=free']);
  
  // Fill and click
  const script = `(() => {
    const inp = document.querySelector('input[type="url"]');
    if (inp) {
      inp.value = 'https://www.videotoquiz.com';
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find(b => (b.innerText || '').trim() === 'Add');
    if (addBtn) addBtn.click();
    return 'DONE_ADD';
  })()`;
  runBskArgs(['evaluate', '--session', sid, script]);

  // sleep 6 seconds
  runBskArgs(['evaluate', '--session', sid, `new Promise(r => setTimeout(r, 6000))`]);

  const snap = runBskArgs(['snapshot', '--session', sid]);
  console.log('Post-add snapshot:\n', snap);
} finally {
  runBskArgs(['session', 'stop', sid]);
}
