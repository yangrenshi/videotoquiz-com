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
  console.log('=== Executing Robust Peerlist Submission ===');
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('Peerlist SID:', sid);
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';
  const logoPath = path.resolve('我的产品/2026-10-17_YouTube-Video-to-Quiz-AI/web/public/icon.png');

  try {
    runBskArgs(['navigate', '--session', sid, 'https://peerlist.io/yangrenliipu']);
    await sleep(4000);

    // 1. Click Add Project
    let snap = runBskArgs(['snapshot', '--session', sid]);
    let m = snap.match(/(@e\d+)\s+button\s+"Add Project"/i) || snap.match(/(@e\d+)\s+button\s+"Add more project"/i);
    if (m) {
      console.log('Clicking Add Project ref:', m[1]);
      runBskArgs(['click', '--session', sid, '--ref', m[1]]);
      await sleep(2500);
    }

    // 2. Click New Project
    snap = runBskArgs(['snapshot', '--session', sid]);
    let mNew = snap.match(/(@e\d+)\s+button\s+"New Project"/i);
    if (mNew) {
      console.log('Clicking New Project button ref:', mNew[1]);
      runBskArgs(['click', '--session', sid, '--ref', mNew[1]]);
      await sleep(3000);
    }

    // 3. Inject form fields directly via DOM
    const fillScript = `
      (() => {
        const results = [];
        
        // Find inputs by placeholder or label
        const inputs = Array.from(document.querySelectorAll('input'));
        const nameInput = inputs.find(i => i.placeholder && i.placeholder.includes('Project name')) ||
                          document.querySelector('input[name="name"]') ||
                          inputs.find(i => i.id && i.id.includes('name'));
        if (nameInput) {
          nameInput.value = 'YouTube to Quiz AI';
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          nameInput.dispatchEvent(new Event('change', { bubbles: true }));
          results.push('name_filled');
        }

        const tagInput = inputs.find(i => i.placeholder && (i.placeholder.includes('Tagline') || i.placeholder.includes('One liner'))) ||
                         document.querySelector('input[name="tagline"]');
        if (tagInput) {
          tagInput.value = 'Convert YouTube videos into interactive quizzes & Anki cards';
          tagInput.dispatchEvent(new Event('input', { bubbles: true }));
          tagInput.dispatchEvent(new Event('change', { bubbles: true }));
          results.push('tagline_filled');
        }

        const urlInput = inputs.find(i => i.placeholder && (i.placeholder.includes('peerlist.io') || i.placeholder.includes('Project URL') || i.type === 'url')) ||
                         document.querySelector('input[name="url"]');
        if (urlInput) {
          urlInput.value = 'https://www.videotoquiz.com';
          urlInput.dispatchEvent(new Event('input', { bubbles: true }));
          urlInput.dispatchEvent(new Event('change', { bubbles: true }));
          results.push('url_filled');
        }

        // Textarea / contenteditable
        const descArea = document.querySelector('textarea') || document.querySelector('[contenteditable="true"]');
        if (descArea) {
          const desc = 'YouTube to Quiz AI turns educational YouTube lectures into active recall quizzes, interactive practice tests, and Anki flashcards instantly with AI. Features timestamped answer explanations, printable PDF study sheets, and peer challenge quizzes.';
          if (descArea.tagName === 'TEXTAREA') {
            descArea.value = desc;
          } else {
            descArea.innerText = desc;
          }
          descArea.dispatchEvent(new Event('input', { bubbles: true }));
          descArea.dispatchEvent(new Event('change', { bubbles: true }));
          results.push('desc_filled');
        }

        return results.join(',');
      })()
    `;
    const fRes = runBskArgs(['evaluate', '--session', sid, fillScript]);
    console.log('Direct DOM Fill Results:', fRes.trim());
    await sleep(1000);

    // 4. Upload file
    console.log('Uploading Logo file...');
    const upRes = runBskArgs(['upload', '--session', sid, '--selector', 'input[type="file"]', '--file', logoPath]);
    console.log('Upload Result:', upRes.trim());
    await sleep(2500);

    // 5. Select tags if visible
    snap = runBskArgs(['snapshot', '--session', sid]);
    const lines = snap.split('\n');
    for (const l of lines) {
      if ((l.includes('Next.js') || l.includes('Cursor') || l.includes('JavaScript') || l.includes('Tailwind')) && l.includes('button')) {
        const refMatch = l.match(/(@e\d+)/);
        if (refMatch) {
          runBskArgs(['click', '--session', sid, '--ref', refMatch[1]]);
          await sleep(300);
        }
      }
    }

    // 6. Click Save Project
    snap = runBskArgs(['snapshot', '--session', sid]);
    const saveMatch = snap.match(/(@e\d+)\s+button\s+"Save Project"/i) || snap.match(/(@e\d+)\s+button\s+"Save"/i);
    if (saveMatch) {
      console.log('Clicking Save Project button ref:', saveMatch[1]);
      runBskArgs(['click', '--session', sid, '--ref', saveMatch[1]]);
      await sleep(6000);
    } else {
      console.log('Save button not found via snapshot, trying DOM click...');
      const clickSaveScript = `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const s = btns.find(b => (b.innerText || '').includes('Save Project') || (b.innerText || '').trim() === 'Save');
          if (s) {
            s.click();
            return 'CLICKED_SAVE_DOM';
          }
          return 'NO_SAVE_BTN';
        })()
      `;
      const csRes = runBskArgs(['evaluate', '--session', sid, clickSaveScript]);
      console.log('Click save DOM result:', csRes.trim());
      await sleep(6000);
    }

    // 7. Verify and screenshot
    runBskArgs(['navigate', '--session', sid, 'https://peerlist.io/yangrenliipu']);
    await sleep(4000);
    snap = runBskArgs(['snapshot', '--session', sid]);
    const verified = snap.includes('YouTube to Quiz') || snap.includes('videotoquiz');
    console.log('Verification on profile:', verified ? 'SUCCESS' : 'PENDING');
    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'peerlist_submit_success.png')]);
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
