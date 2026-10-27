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
  
  // Click on the draft product link to enter editor
  const snap = runBskArgs(['snapshot', '--session', sid]);
  const m = snap.match(/(@e\d+)\s+link\s+"YouTube to Quiz AI video quiz generator"/i);
  if (m) {
    runBskArgs(['click', '--session', sid, '--ref', m[1]]);
  } else {
    runBskArgs(['evaluate', '--session', sid, `document.querySelector('a[href*="product"]').click()`]);
  }

  // Sleep 3 seconds
  runBskArgs(['evaluate', '--session', sid, `new Promise(r => setTimeout(r, 3500))`]);

  // Find Publish or Submit button at bottom
  const script = `(() => {
    window.scrollTo(0, document.body.scrollHeight);
    const btns = Array.from(document.querySelectorAll('button'));
    const pub = btns.find(b => {
      const t = (b.innerText || '').toLowerCase().trim();
      return t === 'publish' || t === 'submit' || t === 'submit for review' || t === 'request review' || t === 'save';
    });
    if (pub) {
      pub.click();
      return 'CLICKED_PUBLISH: ' + pub.innerText.trim();
    }
    return 'VISIBLE_BTNS: ' + btns.map(b => (b.innerText || '').trim()).filter(Boolean).join(', ');
  })()`;
  const res = runBskArgs(['evaluate', '--session', sid, script]);
  console.log('Publish result:', res.trim());

  // Sleep 4 seconds
  runBskArgs(['evaluate', '--session', sid, `new Promise(r => setTimeout(r, 4000))`]);

  runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_submit_success.png')]);
} finally {
  runBskArgs(['session', 'stop', sid]);
}
