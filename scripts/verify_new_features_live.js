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
  console.log('=== Verifying Live Production Deployment ===');
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('Verification SID:', sid);
  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';

  try {
    // 1. Verify /for/medical-students
    console.log('1. Checking https://www.videotoquiz.com/for/medical-students ...');
    runBskArgs(['navigate', '--session', sid, 'https://www.videotoquiz.com/for/medical-students']);
    await sleep(5000);

    let script = `(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      hasTable: !!document.querySelector('table'),
      hasFaq: !!document.querySelector('details'),
      hasSampleQuiz: !!document.body.innerText.includes('Ninja Nerd')
    }))()`;
    let res = runBskArgs(['evaluate', '--session', sid, script]);
    console.log('Medical Students Page Info:\n', res);

    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'medical_students_live.png')]);

    // 2. Click Flashcard Mode button
    console.log('2. Testing Flashcard Mode on live page...');
    const clickFlashcard = `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const fcBtn = btns.find(b => (b.innerText || '').includes('闪卡模式') || (b.innerText || '').includes('Flashcard'));
      if (fcBtn) {
        fcBtn.click();
        return 'CLICKED_FLASHCARD';
      }
      return 'NO_FC_BTN';
    })()`;
    const fcRes = runBskArgs(['evaluate', '--session', sid, clickFlashcard]);
    console.log('Flashcard click result:', fcRes.trim());
    await sleep(2500);

    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'flashcard_mode_live.png')]);

    // 3. Check /topics/ninja-nerd-medicine-anatomy-quiz
    console.log('3. Checking https://www.videotoquiz.com/topics/ninja-nerd-medicine-anatomy-quiz ...');
    runBskArgs(['navigate', '--session', sid, 'https://www.videotoquiz.com/topics/ninja-nerd-medicine-anatomy-quiz']);
    await sleep(4000);

    const topicScript = `(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      hasMedicalBadge: document.body.innerText.includes('USMLE') || document.body.innerText.includes('Medical Students'),
      hasDemoBanner: document.body.innerText.includes('Pre-loaded Medical Quiz Demo')
    }))()`;
    const topicRes = runBskArgs(['evaluate', '--session', sid, topicScript]);
    console.log('Topic Ninja Nerd Page Info:\n', topicRes);

    runBskArgs(['screenshot', '--session', sid, '--out', path.join(artifactDir, 'ninja_nerd_optimized_live.png')]);

    console.log('All Live Verifications Completed!');
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
