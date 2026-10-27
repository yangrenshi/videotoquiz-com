/**
 * 客户端纯前端文件解析引擎 (Client-side Document Parser)
 * 纯本地内存解析，绝不向后端服务器持久化或转储文件，100% 保护学术隐私与零存储成本。
 */

export interface ParsedDocumentResult {
  title: string;
  text: string;
  fileName: string;
  fileSizeFormatted: string;
  wordCount: number;
  charCount: number;
  isTruncated: boolean;
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 清理字幕文件时间轴和序号（.srt, .vtt）
export function cleanSubtitleText(raw: string): string {
  let cleaned = raw.replace(/^WEBVTT[^\n]*\n+/i, '');
  // 清理时间轴如 00:01:23.456 --> 00:01:28.900
  cleaned = cleaned.replace(/\d{1,2}:\d{2}:\d{2}[,\.]\d{2,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,\.]\d{2,3}[^\n]*/g, '');
  // 清理行号序号
  cleaned = cleaned.replace(/^\s*\d+\s*$/gm, '');
  // 规整空行
  return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}

// 计算字数 (兼容中英文)
export function countWordsAndChars(text: string): { words: number; chars: number } {
  const chars = text.length;
  // 英文按空格单词统计，中文字符每个字算 1 词
  const englishWords = (text.match(/[a-zA-Z0-9_-]+/g) || []).length;
  const cjkChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = Math.max(1, englishWords + cjkChars);
  return { words, chars };
}

// 1. 读取纯文本类文件 (.txt, .md, .srt, .vtt, .json, .csv)
export async function readPlainTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'srt' || ext === 'vtt') {
        resolve(cleanSubtitleText(result));
      } else {
        resolve(result);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file, 'UTF-8');
  });
}

// 2. 读取 Word 讲义文档 (.docx)
export async function readDocxFile(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  } catch (err: any) {
    throw new Error(`Failed to parse Word document: ${err.message || 'Unknown error'}`);
  }
}

// 3. 读取 PDF 课件讲义 (.pdf)
export async function readPdfFile(file: File): Promise<string> {
  try {
    // 动态按需引入 pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    // 配置 Worker 路径
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;

    const pageTexts: string[] = [];
    const maxPages = Math.min(pdfDoc.numPages, 100); // 最多读取前 100 页

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageString = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      if (pageString.trim()) {
        pageTexts.push(pageString);
      }
    }

    return pageTexts.join('\n\n');
  } catch (err: any) {
    throw new Error(`Failed to extract text from PDF: ${err.message || 'Corrupted or password-protected PDF'}`);
  }
}

// 统一对外解析入口
export async function parseUploadedDocument(file: File): Promise<ParsedDocumentResult> {
  const fileName = file.name;
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  let extractedText = '';

  if (['txt', 'md', 'srt', 'vtt', 'json', 'csv'].includes(ext)) {
    extractedText = await readPlainTextFile(file);
  } else if (ext === 'docx') {
    extractedText = await readDocxFile(file);
  } else if (ext === 'pdf') {
    extractedText = await readPdfFile(file);
  } else if (ext === 'doc') {
    throw new Error('Old .doc format is not supported. Please save as .docx or .pdf before uploading.');
  } else {
    throw new Error(`Unsupported file format (.${ext}). Supported formats: PDF, DOCX, TXT, MD, SRT, VTT.`);
  }

  extractedText = extractedText.trim();
  if (extractedText.length < 50) {
    throw new Error('Extracted text is too short (less than 50 characters). Please provide a lecture file with readable text.');
  }

  // 超长截断安全保护 (最大保留前 40,000 字符，约 8,000~10,000 词，确保 DeepSeek-V3 响应高效)
  const MAX_CHARS = 40000;
  let isTruncated = false;
  if (extractedText.length > MAX_CHARS) {
    extractedText = extractedText.slice(0, MAX_CHARS);
    isTruncated = true;
  }

  const { words, chars } = countWordsAndChars(extractedText);

  return {
    title: cleanTitle,
    text: extractedText,
    fileName,
    fileSizeFormatted: formatFileSize(file.size),
    wordCount: words,
    charCount: chars,
    isTruncated,
  };
}
