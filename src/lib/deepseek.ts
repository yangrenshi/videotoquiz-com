import { QuizQuestion, QuizResultData } from './types';

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

/**
 * 调度底层 AI 模型生成高质量交互式测验题
 */
export async function generateQuizWithDeepSeek(
  contextText: string,
  videoTitleHint: string = "Educational Video Lecture",
  questionCount: number = 5
): Promise<QuizResultData> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("Missing DEEPSEEK_API_KEY environment variable.");
  }

  const validCount = Math.min(Math.max(Number(questionCount) || 5, 1), 30);

  const prompt = `You are an elite cognitive learning assistant, professor, and professional examination creator.
Your goal is to parse the educational content provided below and construct an interactive, high-retention ${validCount}-question multiple choice test.

Content context:
"""
${contextText.slice(0, 15000)}
"""

Task requirements:
1. Synthesize the core mental model into 3 clear summary sentences.
2. Extract 3 actionable, high-impact key takeaways.
3. Design exactly ${validCount} challenging but fair multiple-choice questions (options A, B, C, D):
   - Options must be plausible distractors that diagnose common misconceptions.
   - Specify the 0-indexed correct answer (0 for A, 1 for B, 2 for C, 3 for D).
   - Write a clear, pedagogical explanation for why the answer is correct based on the lecture.

Output format: You MUST return ONLY valid JSON matching this schema, without any markdown fences, conversational filler, or intro text:
{
  "videoTitle": "${videoTitleHint.replace(/"/g, "'")}",
  "summary": "3-sentence summary of the main conceptual thesis...",
  "takeaways": [
    "Key Takeaway 1",
    "Key Takeaway 2",
    "Key Takeaway 3"
  ],
  "questions": [
    {
      "id": 1,
      "question": "Clear and specific question stem?",
      "options": [
        "First option statement",
        "Second option statement",
        "Third option statement",
        "Fourth option statement"
      ],
      "answerIndex": 0,
      "explanation": "Detailed pedagogical rationale explaining why this option is correct."
    }
  ]
}`;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a professional educational assessment engine. You strictly output RFC 8259 compliant JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI Engine API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || '{}';
  
  // 清洗可能存在的 markdown 代码块包裹
  const cleaned = rawContent.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(cleaned);

  const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];
  const processedQuestions: QuizQuestion[] = rawQuestions.slice(0, validCount).map((q: any, i: number) => ({
    id: i + 1,
    question: q.question || `Question ${i + 1}`,
    options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
    answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : 0,
    explanation: q.explanation || 'Refer to the video lecture key points.'
  }));

  return {
    videoId: '',
    videoTitle: parsed.videoTitle || videoTitleHint,
    summary: parsed.summary || 'Summary synthesized from video lecture.',
    takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways : [],
    questions: processedQuestions,
    totalQuestions: processedQuestions.length || validCount
  };
}
