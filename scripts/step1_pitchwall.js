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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('PitchWall SID:', sid);
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/product/submit?plan=free']);
    await sleep(3500);

    // 1. Fill input url
    const fillScript = `
      (() => {
        const inp = document.querySelector('input[type="url"]');
        if (inp) {
          inp.value = 'https://www.videotoquiz.com';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.dispatchEvent(new Event('change', { bubbles: true }));
          return 'FILLED_URL';
        }
        return 'NO_URL_INPUT';
      })()
    `;
    const fRes = runBskArgs(['evaluate', '--session', sid, fillScript]);
    console.log('Fill URL result:', fRes.trim());
    await sleep(500);

    // 2. Click Add button
    const clickScript = `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const addBtn = btns.find(b => (b.innerText || '').trim() === 'Add');
        if (addBtn) {
          addBtn.click();
          return 'CLICKED_ADD';
        }
        return 'NO_ADD_BTN';
      })()
    `;
    const cRes = runBskArgs(['evaluate', '--session', sid, clickScript]);
    console.log('Click Add result:', cRes.trim());
    await sleep(5000);

    // 3. Inspect updated elements
    const inspectScript = `
      (() => {
        const els = Array.from(document.querySelectorAll('input, button, textarea, select')).map(el => ({
          tag: el.tagName,
          type: el.type,
          placeholder: el.placeholder,
          text: (el.innerText || el.value || '').trim().slice(0, 40),
          id: el.id,
          name: el.name
        }));
        return JSON.stringify(els, null, 2);
      })()
    `;
    const updated = runBskArgs(['evaluate', '--session', sid, inspectScript]);
    console.log('Updated PitchWall Elements:\n', updated);

    // Screenshot current state
    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_step2.png')]);
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
