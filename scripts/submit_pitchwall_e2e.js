const { execFileSync } = require('child_process');
const path = require('path');

function runBskArgs(args) {
  try {
    return execFileSync('bsk', args, { encoding: 'utf-8', timeout: 50000 });
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
  console.log('=== PitchWall Robust Submission Started ===');
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('PitchWall Session ID:', sid);
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    console.log('Navigating to PitchWall Free Submit...');
    runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/product/submit?plan=free']);
    await sleep(4000);

    // 1. Fill URL
    const fillUrlScript = `
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
    const fRes = runBskArgs(['evaluate', '--session', sid, fillUrlScript]);
    console.log('Fill URL:', fRes.trim());
    await sleep(500);

    // 2. Click Add
    const clickAddScript = `
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
    const cRes = runBskArgs(['evaluate', '--session', sid, clickAddScript]);
    console.log('Click Add:', cRes.trim());

    // 3. Wait for AI generation (Scanning metadata -> Writing description -> Done)
    console.log('Waiting for PitchWall AI generation pipeline...');
    for (let i = 0; i < 25; i++) {
      await sleep(3000);
      const statusScript = `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const busyBtn = btns.find(b => {
            const t = (b.innerText || '').toLowerCase();
            return t.includes('scanning') || t.includes('writing') || t.includes('generating');
          });
          const hasForm = Array.from(document.querySelectorAll('input')).length > 2 || !!document.querySelector('textarea');
          return JSON.stringify({
            busyText: busyBtn ? busyBtn.innerText.trim() : null,
            hasForm,
            url: window.location.href
          });
        })()
      `;
      const res = runBskArgs(['evaluate', '--session', sid, statusScript]);
      console.log(`  [Cycle ${i+1}] ${res.trim()}`);
      if (!res.includes('busyText') || res.includes('"busyText":null')) {
        console.log('AI processing finished!');
        break;
      }
    }

    await sleep(3000);

    // 4. Check if there is a Submit / Publish / Next button
    const submitScript = `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const sub = btns.find(b => {
          const t = (b.innerText || '').toLowerCase().trim();
          return t === 'submit' || t === 'submit product' || t === 'publish' || t === 'save & continue' || t === 'continue' || t === 'next' || t === 'save';
        });
        if (sub) {
          sub.click();
          return 'CLICKED: ' + sub.innerText.trim();
        }
        return 'NO_SUBMIT_BUTTON_VISIBLE';
      })()
    `;
    const sRes = runBskArgs(['evaluate', '--session', sid, submitScript]);
    console.log('Final Submit Button action:', sRes.trim());
    await sleep(4000);

    // 5. Screenshot final state
    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_submit_success.png')]);
    console.log('PitchWall Submission Complete & Screenshot Saved!');
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
