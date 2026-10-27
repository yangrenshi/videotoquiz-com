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
  console.log('=== Starting Continuous PitchWall Submission Pipeline ===');
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('Session ID:', sid);
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    // 1. Navigate
    console.log('1. Navigating to PitchWall Free Submit...');
    runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/product/submit?plan=free']);
    await sleep(4000);

    // 2. Fill URL & click Add
    console.log('2. Entering URL and triggering Add...');
    const fillScript = `
      (() => {
        const inp = document.querySelector('input[type="url"]');
        if (inp) {
          inp.value = 'https://www.videotoquiz.com';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const btns = Array.from(document.querySelectorAll('button'));
        const addBtn = btns.find(b => (b.innerText || '').trim() === 'Add');
        if (addBtn) addBtn.click();
        return 'TRIGGERED_ADD';
      })()
    `;
    const fRes = runBskArgs(['evaluate', '--session', sid, fillScript]);
    console.log('  Add result:', fRes.trim());

    // 3. Wait for Next button to become visible (AI auto-generates description)
    console.log('3. Waiting for AI content generation to complete...');
    let nextReady = false;
    for (let i = 0; i < 20; i++) {
      await sleep(2500);
      const checkScript = `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const nextBtn = btns.find(b => (b.innerText || '').trim() === 'Next');
          const isScanning = btns.some(b => (b.innerText || '').includes('Scanning') || (b.innerText || '').includes('Writing'));
          return JSON.stringify({ hasNext: !!nextBtn, isScanning });
        })()
      `;
      const res = runBskArgs(['evaluate', '--session', sid, checkScript]);
      console.log(`  [Poll ${i+1}] ${res.trim()}`);
      if (res.includes('"hasNext":true') && !res.includes('"isScanning":true')) {
        nextReady = true;
        break;
      }
    }

    if (!nextReady) {
      console.log('Warning: Next button not detected via poll, attempting anyway.');
    }

    await sleep(1500);

    // 4. Click Next (Step 1 -> Step 2)
    console.log('4. Clicking Next on Step 1...');
    const clickNextScript = `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find(b => (b.innerText || '').trim() === 'Next');
        if (nextBtn) {
          nextBtn.click();
          return 'CLICKED_NEXT_STEP1';
        }
        return 'NO_NEXT_STEP1';
      })()
    `;
    const cnRes = runBskArgs(['evaluate', '--session', sid, clickNextScript]);
    console.log('  Step 1 Next:', cnRes.trim());
    await sleep(4000);

    // 5. Inspect Step 2
    console.log('5. Inspecting Step 2 Form...');
    let snap = runBskArgs(['snapshot', '--session', sid]);
    console.log('  Step 2 Snapshot Slice:');
    const lines = snap.split('\n');
    for (const l of lines.slice(0, 35)) {
      console.log('    ' + l.trim());
    }

    // 6. Handle Step 2 (Look for Next or Submit or Finish)
    const handleStep2Script = `
      (() => {
        const results = [];
        const btns = Array.from(document.querySelectorAll('button'));
        
        // Find next or submit
        const submitBtn = btns.find(b => {
          const t = (b.innerText || '').toLowerCase().trim();
          return t === 'submit' || t === 'submit product' || t === 'finish' || t === 'publish' || t === 'save';
        });

        const nextBtn = btns.find(b => (b.innerText || '').trim() === 'Next');

        if (submitBtn) {
          submitBtn.click();
          results.push('CLICKED_SUBMIT: ' + submitBtn.innerText.trim());
        } else if (nextBtn) {
          nextBtn.click();
          results.push('CLICKED_NEXT_STEP2');
        } else {
          results.push('NO_ACTION_BUTTON_STEP2');
        }

        return results.join('; ');
      })()
    `;
    const s2Res = runBskArgs(['evaluate', '--session', sid, handleStep2Script]);
    console.log('  Step 2 Action:', s2Res.trim());
    await sleep(5000);

    // 7. Check if there is another step (e.g. Plan confirmation or final Submit)
    const handleStep3Script = `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const submitBtn = btns.find(b => {
          const t = (b.innerText || '').toLowerCase().trim();
          return t === 'submit' || t === 'submit product' || t === 'publish' || t === 'finish';
        });
        if (submitBtn) {
          submitBtn.click();
          return 'CLICKED_FINAL_SUBMIT';
        }
        return 'NO_FURTHER_SUBMIT';
      })()
    `;
    const s3Res = runBskArgs(['evaluate', '--session', sid, handleStep3Script]);
    console.log('  Step 3 / Final Action:', s3Res.trim());
    await sleep(4000);

    // 8. Capture Screenshot of submission
    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_submit_success.png')]);
    console.log('  Screenshot pitchwall_submit_success.png saved.');

    // 9. Navigate to My Products and verify
    console.log('9. Navigating to My Products to verify entry...');
    runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/profile/products']);
    await sleep(4000);

    snap = runBskArgs(['snapshot', '--session', sid]);
    const hasQuiz = snap.includes('YouTube to Quiz') || snap.includes('quiz');
    console.log('  Profile products contains YouTube to Quiz?:', hasQuiz);
    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'pitchwall_my_products.png')]);
    console.log('=== PitchWall Continuous Pipeline Completed Successfully ===');
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
