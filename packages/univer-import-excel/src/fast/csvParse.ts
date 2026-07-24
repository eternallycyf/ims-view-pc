/**
 * CSV → 行矩阵（UTF-8 / GB18030；支持逗号 / Tab；RFC4180 引号字段）。
 */
export const isCsvFileName = (fileName?: string): boolean =>
  Boolean(fileName && /\.csv$/i.test(fileName));

const stripBom = (text: string): string =>
  text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

/** 优先 UTF-8（含 BOM）；非法 UTF-8 再试 GB18030（常见中文 Excel 另存） */
export const decodeCsvBytes = (bytes: Uint8Array): string => {
  let offset = 0;
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    offset = 3;
  }
  const view = offset ? bytes.subarray(offset) : bytes;

  try {
    return stripBom(new TextDecoder('utf-8', { fatal: true }).decode(view));
  } catch {
    // ignore
  }

  try {
    return stripBom(new TextDecoder('gb18030').decode(view));
  } catch {
    // ignore
  }

  return stripBom(new TextDecoder('utf-8').decode(view));
};

const detectDelimiter = (sample: string): ',' | '\t' | ';' => {
  let inQuotes = false;
  let commas = 0;
  let tabs = 0;
  let semis = 0;
  const limit = Math.min(sample.length, 8_000);
  for (let i = 0; i < limit; i += 1) {
    const ch = sample[i];
    if (ch === '"') {
      if (inQuotes && sample[i + 1] === '"') {
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (inQuotes) continue;
    if (ch === ',') commas += 1;
    else if (ch === '\t') tabs += 1;
    else if (ch === ';') semis += 1;
  }
  if (tabs > commas && tabs >= semis) return '\t';
  if (semis > commas && semis >= tabs) return ';';
  return ',';
};

/** 解析整段 CSV 文本为二维字符串表（保留空单元格为 ''） */
export const parseCsvText = (raw: string): string[][] => {
  const text = stripBom(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (!text) return [];

  const delimiter = detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === delimiter) {
      row.push(field);
      field = '';
      continue;
    }
    if (ch === '\n') {
      row.push(field);
      field = '';
      // 跳过末尾空行
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
      continue;
    }
    field += ch;
  }

  row.push(field);
  if (row.length > 1 || row[0] !== '') rows.push(row);

  return rows;
};

export const csvBytesToRows = (bytes: Uint8Array): string[][] =>
  parseCsvText(decodeCsvBytes(bytes));
