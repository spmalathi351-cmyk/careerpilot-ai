import path from 'path';

export const MAX_RESUME_SIZE = 15 * 1024 * 1024; // 15 MB
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

/**
 * Validates file extension, MIME type, and size
 */
export function validateResumeFile(
  filename: string,
  fileSize?: number,
  buffer?: Buffer
): { valid: boolean; error?: string } {
  if (!filename || typeof filename !== 'string') {
    return { valid: false, error: 'File name is required' };
  }

  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a valid PDF or DOCX file (up to 15MB).',
    };
  }

  const size = fileSize || (buffer ? buffer.length : 0);
  if (size > MAX_RESUME_SIZE) {
    return {
      valid: false,
      error: `File size (${(size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of 15 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Extracts raw readable text from a DOCX file buffer
 */
export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const mammothModule = await import('mammoth');
    const extractRawText = mammothModule.default?.extractRawText || mammothModule.extractRawText;
    const result = await extractRawText({ buffer });
    if (result && result.value && result.value.trim().length > 0) {
      return result.value.trim();
    }
  } catch (err: any) {
    console.warn('Primary DOCX extraction via mammoth failed, attempting fallback:', err?.message || err);
  }

  // Fallback: extract XML text from docx zip if mammoth encountered an unexpected format
  try {
    const zlib = await import('zlib');
    // Look for PK header and word/document.xml entry
    const docXmlMatch = buffer.indexOf('word/document.xml');
    if (docXmlMatch !== -1) {
      // Find possible uncompressed text or xml tags
      const str = buffer.toString('binary');
      const textMatches = str.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (textMatches && textMatches.length > 0) {
        return textMatches
          .map((m) => m.replace(/<[^>]+>/g, ''))
          .filter(Boolean)
          .join(' ')
          .trim();
      }
    }
  } catch {
    // ignore
  }

  return '';
}

/**
 * Extracts raw readable text from a PDF file buffer
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfParseModule = await import('pdf-parse');
    const PDFParse = pdfParseModule.PDFParse || (pdfParseModule as any).default?.PDFParse;
    if (PDFParse) {
      const parser: any = new (PDFParse as any)({ data: new Uint8Array(buffer) });
      await parser.load();
      const res = await parser.getText();
      if (res && res.text && res.text.trim().length > 0) {
        return res.text.trim();
      }
    }
  } catch (err: any) {
    console.warn('Primary PDF extraction via PDFParse failed, attempting stream scan fallback:', err?.message || err);
  }

  // Fallback: extract plain text chunks from PDF stream
  try {
    const raw = buffer.toString('utf-8', 0, Math.min(buffer.length, 500000));
    const matches = raw.match(/\(([^)]+)\)\s*Tj/g);
    if (matches && matches.length > 0) {
      return matches.map((m) => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ').trim();
    }
  } catch {
    // ignore
  }

  return '';
}

/**
 * Master text extractor for uploaded files
 */
export async function extractTextFromFileBuffer(buffer: Buffer, filename: string): Promise<string> {
  const ext = path.extname(filename).toLowerCase();
  const isZip = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
  const isPdfHeader = buffer.length >= 4 && buffer.slice(0, 5).toString('ascii').startsWith('%PDF');

  if (ext === '.docx' || isZip) {
    const text = await extractTextFromDocx(buffer);
    if (text) return text;
  }

  if (ext === '.pdf' || isPdfHeader) {
    const text = await extractTextFromPdf(buffer);
    if (text) return text;
  }

  // Text file or plain text buffer
  try {
    const utf8 = buffer.toString('utf-8');
    if (!utf8.includes('\u0000')) {
      return utf8.trim();
    }
  } catch {
    // ignore
  }

  return '';
}
