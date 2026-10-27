const { execSync } = require('child_process');

function runBsk(cmd) {
  try {
    return execSync(`bsk ${cmd}`, { encoding: 'utf-8', timeout: 30000 });
  } catch (e) {
    return e.stdout || e.message;
  }
}

const sOut = runBsk('session start --browser 7dd226e4');
const sid = sOut.trim().split(/\s+/).pop();
runBsk(`navigate --session ${sid} "https://peerlist.io/yangrenliipu"`);
execSync('powershell Start-Sleep -Seconds 3');
const snap = runBsk(`snapshot --session ${sid}`);

const hasQuiz = snap.includes('YouTube to Quiz') || snap.includes('videotoquiz');
console.log('Project Status on Peerlist:', hasQuiz ? 'SUCCESSFULLY ADDED' : 'NOT FINISHED');

const lines = snap.split('\n');
for (const l of lines) {
  if (l.includes('YouTube to Quiz') || l.includes('Tarot')) {
    console.log('  ' + l.trim());
  }
}

runBsk(`session stop ${sid}`);
