import { QuizScoreSummary } from './types';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

export function drawQuizScorePoster(
  canvas: HTMLCanvasElement,
  videoTitle: string,
  summary: QuizScoreSummary
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  // 1. 背景暗夜深蓝渐变
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f172a'); // slate-900
  bgGrad.addColorStop(0.5, '#1e1b4b'); // indigo-950
  bgGrad.addColorStop(1, '#020617'); // slate-950
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. 星芒装饰几何光晕
  const glowGrad = ctx.createRadialGradient(width / 2, 240, 50, width / 2, 240, 400);
  glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.25)'); // indigo glow
  glowGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. 双层优雅金色边框
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // amber gold
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // 4. 品牌 Header
  ctx.fillStyle = '#f59e0b'; // Gold
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ACADEMIC MASTERY CERTIFICATE', width / 2, 110);

  ctx.fillStyle = '#94a3b8'; // Slate-400
  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('YOUTUBE TO QUIZ AI • COGNITIVE RETENTION REPORT', width / 2, 140);

  // 5. 视频标题 (智能换行)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  wrapText(ctx, `"${videoTitle}"`, width / 2, 200, 950, 44);

  // 6. 得分大圆形勋章 (Score Badge)
  const centerX = width / 2;
  const centerY = 370;
  const radius = 95;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  const badgeGrad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
  badgeGrad.addColorStop(0, '#312e81');
  badgeGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = badgeGrad;
  ctx.fill();
  ctx.strokeStyle = summary.percentage >= 80 ? '#10b981' : '#f59e0b';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();

  // 得分文字
  ctx.fillStyle = summary.percentage >= 80 ? '#34d399' : '#fbbf24';
  ctx.font = 'bold 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${summary.percentage}%`, centerX, centerY + 8);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${summary.correct} OF ${summary.total} CORRECT`, centerX, centerY + 42);

  // 7. 掌握度评级与评语
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(summary.badgeTitle, width / 2, 530);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(summary.masteryLevel, width / 2, 570);

  // 8. 统计数据条 (Time & Speed)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.roundRect(280, 620, 640, 50, 12);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const min = Math.floor(summary.timeSpentSeconds / 60);
  const sec = summary.timeSpentSeconds % 60;
  ctx.fillText(`Duration: ${min}m ${sec}s  •  Pace: ~${Math.round(summary.timeSpentSeconds / summary.total)}s per item  •  Verified by VideoToQuiz AI`, width / 2, 652);

  // 9. 页脚与权威声明
  ctx.fillStyle = '#64748b';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  •  https://www.videotoquiz.ai`, width / 2, 730);
}
