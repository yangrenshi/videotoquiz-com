const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function runBsk(cmd) {
  try {
    return execSync(`bsk ${cmd}`, { encoding: 'utf-8', timeout: 35000 });
  } catch (e) {
    return (e.stdout ? e.stdout.toString() : '') + ' ' + (e.stderr ? e.stderr.toString() : e.message);
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('=== Starting Peerlist Submission Flow ===');
  const sOut = runBsk('session start --browser 7dd226e4');
  const sid = sOut.trim().split(/\s+/).pop();
  console.log('Session ID:', sid);

  const artifactDir = 'C:\\Users\\jtzy\\.gemini\\antigravity\\brain\\38be23f0-5dbe-4a39-b35e-1fdae22917c7';
  const logoPath = path.resolve('我的产品/2026-10-17_YouTube-Video-to-Quiz-AI/web/public/icon.png');

  try {
    console.log('1. Navigating to profile...');
    runBsk(`navigate --session ${sid} "https://peerlist.io/yangrenliipu"`);
    await sleep(4000);

    let snap = runBsk(`snapshot --session ${sid}`);
    let m = snap.match(/(@e\d+)\s+button\s+"Add Project"/i) || snap.match(/(@e\d+)\s+button\s+"Add more project"/i);
    if (m) {
      console.log('Clicking Add Project ref:', m[1]);
      runBsk(`click --session ${sid} --ref "${m[1]}"`);
      await sleep(2500);
    }

    snap = runBsk(`snapshot --session ${sid}`);
    let mNew = snap.match(/(@e\d+)\s+button\s+"New Project"/i);
    if (mNew) {
      console.log('Clicking New Project button ref:', mNew[1]);
      runBsk(`click --session ${sid} --ref "${mNew[1]}"`);
      await sleep(3000);
    }

    // Now on New Project form
    snap = runBsk(`snapshot --session ${sid}`);
    console.log('Current form elements count:', snap.split('\n').length);

    // Let us fill Project name directly without AI Autofill to keep DOM stable
    const nameMatch = snap.match(/(@e\d+)\s+textbox\s+"Project name \*"/i);
    if (nameMatch) {
      console.log('Filling Project name:', nameMatch[1]);
      runBsk(`fill --session ${sid} --ref "${nameMatch[1]}" --value "YouTube to Quiz AI"`);
      await sleep(500);
    }

    snap = runBsk(`snapshot --session ${sid}`);
    const tagMatch = snap.match(/(@e\d+)\s+textbox\s+"Tagline \*"/i);
    if (tagMatch) {
      console.log('Filling Tagline:', tagMatch[1]);
      runBsk(`fill --session ${sid} --ref "${tagMatch[1]}" --value "Convert YouTube videos into interactive quizzes & Anki cards"`);
      await sleep(500);
    }

    snap = runBsk(`snapshot --session ${sid}`);
    const urlMatch = snap.match(/(@e\d+)\s+textbox\s+"Project URL"/i);
    if (urlMatch) {
      console.log('Filling Project URL:', urlMatch[1]);
      runBsk(`fill --session ${sid} --ref "${urlMatch[1]}" --value "https://www.videotoquiz.com"`);
      await sleep(500);
    }

    // Category / role selection
    snap = runBsk(`snapshot --session ${sid}`);
    const roleMatch = snap.match(/(@e\d+)\s+textbox\s+"What was your role in the project\?"/i) || snap.match(/(@e\d+)\s+textbox\s+".*role.*"/i);
    if (roleMatch) {
      console.log('Filling Role:', roleMatch[1]);
      runBsk(`fill --session ${sid} --ref "${roleMatch[1]}" --value "Creator & Full Stack Developer"`);
      await sleep(500);
    }

    // Description
    snap = runBsk(`snapshot --session ${sid}`);
    const descMatch = snap.match(/(@e\d+)\s+textbox\s+"Start writing here\.\.\."/i);
    if (descMatch) {
      const desc = "YouTube to Quiz AI turns educational YouTube lectures into active recall quizzes, interactive practice tests, and Anki flashcards instantly with AI. Features timestamped answer explanations, printable PDF study sheets, and peer challenge quizzes.";
      console.log('Filling Description:', descMatch[1]);
      runBsk(`fill --session ${sid} --ref "${descMatch[1]}" --value "${desc}"`);
      await sleep(500);
    }

    // Upload Logo
    console.log('Uploading Logo...');
    try {
      const upRes = runBsk(`upload --session ${sid} --selector "input[type='file']" --file "${logoPath}"`);
      console.log('Upload result:', upRes);
      await sleep(2000);
    } catch (e) {
      console.log('Upload note:', e.message);
    }

    // Check tags / buttons
    snap = runBsk(`snapshot --session ${sid}`);
    const nextjsBtn = snap.match(/(@e\d+)\s+button\s+"Next\.js.*"/i);
    if (nextjsBtn) {
      runBsk(`click --session ${sid} --ref "${nextjsBtn[1]}"`);
      await sleep(300);
    }

    // Check Save Project button
    snap = runBsk(`snapshot --session ${sid}`);
    const saveMatch = snap.match(/(@e\d+)\s+button\s+"Save Project"/i);
    if (saveMatch) {
      console.log('Clicking Save Project ref:', saveMatch[1]);
      const res = runBsk(`click --session ${sid} --ref "${saveMatch[1]}"`);
      console.log('Click save result:', res);
      await sleep(5000);
    } else {
      console.log('Could not find Save Project button. Searching all buttons:');
      const lines = snap.split('\n');
      for (const l of lines) {
        if (l.includes('button')) console.log('  ' + l.trim());
      }
    }

    // Final snapshot and screenshot
    snap = runBsk(`snapshot --session ${sid}`);
    console.log('Post-save snapshot contains YouTube to Quiz?:', snap.includes('YouTube to Quiz') || snap.includes('videotoquiz'));
    runBsk(`screenshot --session ${sid} --out "${path.join(artifactDir, 'peerlist_submit_success.png')}"`);
    console.log('Peerlist submission process done!');
  } finally {
    runBsk(`session stop ${sid}`);
  }
}

main();
