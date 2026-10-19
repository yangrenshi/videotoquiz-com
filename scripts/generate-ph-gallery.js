const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '..', '..', '06.全球发布与外链弹药库', 'producthunt_assets');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 通用页面容器样式 (1270 x 760)
function getHtmlWrapper(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1270px;
      height: 760px;
      overflow: hidden;
      background: #09090b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #fafafa;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    .glow-amber {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%);
      top: -150px;
      right: -100px;
      filter: blur(60px);
      pointer-events: none;
    }
    .glow-indigo {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
      bottom: -150px;
      left: -100px;
      filter: blur(60px);
      pointer-events: none;
    }
    .header-bar {
      padding: 36px 60px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #18181b;
      border: 1px solid #3f3f46;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      font-family: monospace;
      background: rgba(245, 158, 11, 0.1);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .main-body {
      flex: 1;
      padding: 30px 60px 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 10;
    }
    h1 {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -1px;
      margin-bottom: 14px;
    }
    .highlight {
      color: #fbbf24;
    }
    p.subtitle {
      font-size: 20px;
      color: #a1a1aa;
      max-width: 850px;
      line-height: 1.5;
      margin-bottom: 36px;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow-amber"></div>
  <div class="glow-indigo"></div>
  <div class="header-bar">
    <div class="brand">
      <div class="brand-icon">🎓</div>
      <span>YouTube to Quiz AI</span>
    </div>
    <div class="badge">PRODUCT HUNT EXCLUSIVE</div>
  </div>
  <div class="main-body">
    ${content}
  </div>
</body>
</html>`;
}

// 8 张展位图定义
const slides = [
  {
    filename: 'gallery_01_hero.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">THE ACTIVE RECALL REVOLUTION</div>
        <h1>Stop Passive Video Watching.<br><span class="highlight">Turn YouTube Lectures into AI Quizzes.</span></h1>
        <p class="subtitle">Convert any YouTube lecture, podcast, or tutorial into interactive multiple-choice tests, timestamped explanations, and Anki flashcards in 10 seconds.</p>
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="padding: 20px 28px; background: rgba(24, 24, 27, 0.8); border: 1px solid #3f3f46; border-radius: 16px; display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 28px;">⚡</div>
            <div>
              <div style="font-size: 16px; font-weight: 700;">10-Second Generation</div>
              <div style="font-size: 13px; color: #71717a;">Paste URL, extract concepts instantly</div>
            </div>
          </div>
          <div style="padding: 20px 28px; background: rgba(24, 24, 27, 0.8); border: 1px solid #3f3f46; border-radius: 16px; display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 28px;">🧠</div>
            <div>
              <div style="font-size: 16px; font-weight: 700;">Active Recall Built-in</div>
              <div style="font-size: 13px; color: #71717a;">300% higher long-term retention</div>
            </div>
          </div>
          <div style="padding: 20px 28px; background: rgba(24, 24, 27, 0.8); border: 1px solid #3f3f46; border-radius: 16px; display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 28px;">🎁</div>
            <div>
              <div style="font-size: 16px; font-weight: 700;">20 Free Credits</div>
              <div style="font-size: 13px; color: #71717a;">No credit card required</div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    filename: 'gallery_02_how_it_works.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">ZERO-FRICTION PIPELINE</div>
        <h1>3 Simple Steps from <span class="highlight">URL to Mastery</span></h1>
        <p class="subtitle">No manual note-taking. No pausing every three minutes. Built for pure learning speed.</p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px;">
          <div style="padding: 28px; background: #121215; border: 1px solid #27272a; border-radius: 20px;">
            <div style="font-size: 32px; font-weight: 900; color: #fbbf24; font-family: monospace; margin-bottom: 12px;">01</div>
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Paste Video URL</div>
            <div style="font-size: 14px; color: #a1a1aa; line-height: 1.5;">Support CS50, MIT OCW, Huberman Lab, TED Talks or paste raw transcript notes.</div>
          </div>
          <div style="padding: 28px; background: #121215; border: 1px solid #27272a; border-radius: 20px;">
            <div style="font-size: 32px; font-weight: 900; color: #fbbf24; font-family: monospace; margin-bottom: 12px;">02</div>
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">AI Synthesis</div>
            <div style="font-size: 14px; color: #a1a1aa; line-height: 1.5;">DeepSeek-V3 evaluates speech against Bloom’s Taxonomy to extract core test points.</div>
          </div>
          <div style="padding: 28px; background: #121215; border: 1px solid #27272a; border-radius: 20px;">
            <div style="font-size: 32px; font-weight: 900; color: #fbbf24; font-family: monospace; margin-bottom: 12px;">03</div>
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Test & Export</div>
            <div style="font-size: 14px; color: #a1a1aa; line-height: 1.5;">Take interactive tests in 180ms, view timestamps, and download Anki cards & PDFs.</div>
          </div>
        </div>
      </div>
    `
  },
  {
    filename: 'gallery_03_science.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">COGNITIVE PSYCHOLOGY</div>
        <h1>Backed by Science: <span class="highlight">The Testing Effect</span></h1>
        <p class="subtitle">Passive video watching creates the "Illusion of Competence". Deliberate retrieval stops the Ebbinghaus forgetting curve.</p>
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 30px; max-width: 1100px; align-items: center;">
          <div style="padding: 26px; background: #121215; border: 1px solid #27272a; border-radius: 20px;">
            <div style="font-size: 14px; font-weight: 700; color: #a1a1aa; margin-bottom: 16px; font-family: monospace;">48-HOUR RETENTION BENCHMARK</div>
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; margin-bottom: 6px;">
                <span style="color: #f43f5e;">Passive Video Re-watching</span>
                <span style="color: #f43f5e;">28% Retention</span>
              </div>
              <div style="width: 100%; height: 12px; background: #27272a; border-radius: 6px; overflow: hidden;">
                <div style="width: 28%; height: 100%; background: #f43f5e;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; margin-bottom: 6px;">
                <span style="color: #34d399;">Active Recall with VideoToQuiz AI</span>
                <span style="color: #34d399;">84% Retention</span>
              </div>
              <div style="width: 100%; height: 12px; background: #27272a; border-radius: 6px; overflow: hidden;">
                <div style="width: 84%; height: 100%; background: linear-gradient(90deg, #f59e0b, #10b981);"></div>
              </div>
            </div>
          </div>
          <div style="padding: 26px; background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 20px;">
            <div style="font-size: 14px; font-style: italic; color: #e4e4e7; line-height: 1.6; margin-bottom: 12px;">
              "Taking a memory test not only assesses what one knows, but also enhances later retention... producing robust learning advantages over repeated study sessions."
            </div>
            <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 700;">
              — Roediger & Karpicke (2006), Perspectives on Psychological Science
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    filename: 'gallery_04_anki_export.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">SPACED REPETITION ECOSYSTEM</div>
        <h1>1-Click Export to <span class="highlight">Anki & Quizlet</span></h1>
        <p class="subtitle">Keep your long-term study streaks alive. Download formatted flashcards and printable worksheets without manual copying.</p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px;">
          <div style="padding: 24px; background: #121215; border: 1px solid #27272a; border-radius: 18px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 12px;">🗂️</div>
            <div style="font-size: 17px; font-weight: 700; margin-bottom: 6px;">Anki Decks (.apkg)</div>
            <div style="font-size: 13px; color: #a1a1aa;">Pre-formatted front/back cards ready for Anki spaced repetition</div>
          </div>
          <div style="padding: 24px; background: #121215; border: 1px solid #27272a; border-radius: 18px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 12px;">📄</div>
            <div style="font-size: 17px; font-weight: 700; margin-bottom: 6px;">Printable Worksheets</div>
            <div style="font-size: 13px; color: #a1a1aa;">Formatted PDF test papers with complete answer keys for offline review</div>
          </div>
          <div style="padding: 24px; background: #121215; border: 1px solid #27272a; border-radius: 18px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 12px;">📊</div>
            <div style="font-size: 17px; font-weight: 700; margin-bottom: 6px;">Quizlet & CSV</div>
            <div style="font-size: 13px; color: #a1a1aa;">Standard delimited format ready for Quizlet, Notion, or RemNote</div>
          </div>
        </div>
      </div>
    `
  },
  {
    filename: 'gallery_05_timestamped_feedback.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">INSTANT ERROR CORRECTION</div>
        <h1>Timestamped Explanations for <span class="highlight">Every Question</span></h1>
        <p class="subtitle">Never wonder why an answer is wrong. Jump straight to the exact video timestamp where the professor explains the concept.</p>
        <div style="padding: 28px; background: #121215; border: 1px solid #3f3f46; border-radius: 20px; max-width: 1050px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="font-size: 14px; font-weight: 700; color: #fbbf24; font-family: monospace;">QUESTION 3 OF 5 · CS50 DATA STRUCTURES</span>
            <span style="font-size: 12px; padding: 4px 10px; background: rgba(52, 211, 153, 0.15); color: #34d399; border-radius: 6px; font-weight: 700;">⏱️ Jump to 24:18 in Lecture</span>
          </div>
          <div style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #fff;">
            What is the primary time complexity tradeoff when searching an unsorted linked list vs. a binary search tree?
          </div>
          <div style="padding: 14px 18px; background: rgba(52, 211, 153, 0.1); border-left: 4px solid #34d399; border-radius: 8px; font-size: 14px; color: #e4e4e7; line-height: 1.5;">
            <strong style="color: #34d399;">Detailed Explanation:</strong> Linked lists require O(n) linear scans because memory is not contiguous and pointer traversal is sequential, whereas balanced BSTs achieve O(log n) branching.
          </div>
        </div>
      </div>
    `
  },
  {
    filename: 'gallery_06_peer_challenge.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">VIRAL CHALLENGE LOOP</div>
        <h1>Challenge Friends & <span class="highlight">Study Groups</span></h1>
        <p class="subtitle">Share any generated quiz with a 1-click challenge link. Compare scores, review mistakes together, and turn learning into friendly competition.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 1050px;">
          <div style="padding: 24px; background: #121215; border: 1px solid #27272a; border-radius: 18px;">
            <div style="font-size: 28px; margin-bottom: 8px;">🔗</div>
            <div style="font-size: 17px; font-weight: 700; margin-bottom: 6px;">Shareable Challenge Link</div>
            <div style="font-size: 13px; color: #a1a1aa; line-height: 1.5;">Friends take the exact test without creating an account or logging in first.</div>
          </div>
          <div style="padding: 24px; background: #121215; border: 1px solid #27272a; border-radius: 18px;">
            <div style="font-size: 28px; margin-bottom: 8px;">🏆</div>
            <div style="font-size: 17px; font-weight: 700; margin-bottom: 6px;">Instant Score Report</div>
            <div style="font-size: 13px; color: #a1a1aa; line-height: 1.5;">Beautiful completion badges, accuracy percentages, and mastery breakdown.</div>
          </div>
        </div>
      </div>
    `
  },
  {
    filename: 'gallery_07_any_subject.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">MULTIDISCIPLINARY AI</div>
        <h1>Master Any Subject, <span class="highlight">In Any Language</span></h1>
        <p class="subtitle">From Ivy League STEM lectures to medical explainers, podcasts, and foreign language tutorials.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 14px; max-width: 1000px;">
          <div style="padding: 14px 22px; background: #18181b; border: 1px solid #3f3f46; border-radius: 12px; font-size: 15px; font-weight: 600;">💻 Computer Science & Python (CS50)</div>
          <div style="padding: 14px 22px; background: #18181b; border: 1px solid #3f3f46; border-radius: 12px; font-size: 15px; font-weight: 600;">🧬 Neuroscience & Health (Huberman Lab)</div>
          <div style="padding: 14px 22px; background: #18181b; border: 1px solid #3f3f46; border-radius: 12px; font-size: 15px; font-weight: 600;">📐 Mathematics & Physics (3Blue1Brown)</div>
          <div style="padding: 14px 22px; background: #18181b; border: 1px solid #3f3f46; border-radius: 12px; font-size: 15px; font-weight: 600;">🏥 Medical & Nursing (Osmosis, Ninja Nerd)</div>
          <div style="padding: 14px 22px; background: #18181b; border: 1px solid #3f3f46; border-radius: 12px; font-size: 15px; font-weight: 600;">📈 Economics & Finance (Khan Academy)</div>
          <div style="padding: 14px 22px; background: #18181b; border: 1px solid #3f3f46; border-radius: 12px; font-size: 15px; font-weight: 600;">🌐 50+ Languages Supported via Captions</div>
        </div>
      </div>
    `
  },
  {
    filename: 'gallery_08_free_credits.png',
    html: `
      <div>
        <div class="badge" style="margin-bottom: 16px;">SPECIAL PRODUCT HUNT LAUNCH</div>
        <h1>Get Started Free with <span class="highlight">20 Free Credits</span></h1>
        <p class="subtitle">Experience active recall today. No subscription trapped behind a wall. Use code PHLAUNCH for extra perks.</p>
        <div style="padding: 30px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 24px; max-width: 900px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 8px;">Claim Your Launch Gift 🎁</div>
            <div style="font-size: 15px; color: #a1a1aa; line-height: 1.5;">20 Free Starting Credits upon Google Sign-in<br>+ 50 Bonus Credits with code <strong style="color: #fbbf24;">PHLAUNCH</strong></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 32px; font-weight: 900; color: #fbbf24; font-family: monospace;">$0.00</div>
            <div style="font-size: 12px; color: #71717a;">No credit card required</div>
          </div>
        </div>
      </div>
    `
  }
];

// 批量生成
async function renderAll() {
  const tempHtmlPath = path.join(__dirname, 'temp_slide.html');

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const fullHtml = getHtmlWrapper(slide.html);
    fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

    const outPath = path.join(OUTPUT_DIR, slide.filename);
    console.log(`Rendering [${i + 1}/8] ${slide.filename}...`);

    const cmd = `"${CHROME_PATH}" --headless --disable-gpu --window-size=1270,760 --screenshot="${outPath}" "file:///${tempHtmlPath.replace(/\\\\/g, '/')}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
    } catch (e) {
      console.error(`Error rendering ${slide.filename}:`, e.message);
    }
  }

  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  console.log('All 8 gallery slides generated successfully in:', OUTPUT_DIR);
}

renderAll();
