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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const sOut = runBskArgs(['session', 'start', '--browser', '7dd226e4']);
  const sid = getSessionId(sOut);
  console.log('PitchWall SID:', sid);
  try {
    runBskArgs(['navigate', '--session', sid, 'https://pitchwall.co/product/submit?plan=free']);
    await sleep(3500);

    const script = `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input, button, textarea')).map(el => ({
          tag: el.tagName,
          type: el.type,
          placeholder: el.placeholder,
          text: (el.innerText || el.value || '').trim().slice(0, 40),
          className: el.className
        }));
        return JSON.stringify(inputs, null, 2);
      })()
    `;
    const res = runBskArgs(['evaluate', '--session', sid, script]);
    console.log('PitchWall elements:\n', res);
  } finally {
    runBskArgs(['session', 'stop', sid]);
  }
}

main();
