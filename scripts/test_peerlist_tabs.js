const { execSync } = require('child_process');

function runBsk(cmd) {
  try {
    return execSync(`bsk ${cmd}`, { encoding: 'utf-8', timeout: 30000 });
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

const sOut = runBsk('session start --browser 7dd226e4');
const sid = getSessionId(sOut);
console.log('Real SID:', sid);

runBsk(`navigate --session ${sid} "https://peerlist.io/yangrenliipu"`);
execSync('powershell Start-Sleep -Seconds 3');

const tabs = runBsk(`tabs --browser 7dd226e4`);
console.log('Tabs:', tabs);

const snap = runBsk(`snapshot --session ${sid}`);
console.log('Snap snippet:');
console.log(snap.slice(0, 1000));

runBsk(`session stop ${sid}`);
