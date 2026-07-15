// Conversion script: Markdown -> Word (.docx) -> PDF
// Run: node convert-docs.js

const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const markdownIt = require('markdown-it');

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

const DOCS_DIR = path.join(__dirname, 'docs');
const OUTPUT_DIR = path.join(__dirname, 'output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const files = [
  'DOCUMENTO_FINAL.md',
  'MANUAL_TECNICO.md',
  'MANUAL_USUARIO.md',
  'INFORME_AUDITORIA.md'
];

// Color theme
const PRIMARY_HEX = '1B4F2E';
const SECONDARY_HEX = '2E7D32';
const ACCENT_HEX = 'E2891F';

// RGB colors for pdf-lib
const PRIMARY_RGB = rgb(27/255, 79/255, 46/255);
const SECONDARY_RGB = rgb(46/255, 125/255, 50/255);
const ACCENT_RGB = rgb(226/255, 137/255, 31/255);
const BLACK_RGB = rgb(0, 0, 0);
const GRAY_RGB = rgb(0.4, 0.4, 0.4);
const WHITE_RGB = rgb(1, 1, 1);

// Character sanitization for WinAnsi encoding (pdf-lib standard fonts)
function sanitizeForPdf(text) {
  return text
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/↔/g, '<->')
    .replace(/•/g, '-')
    .replace(/•/g, '*')
    .replace(/─/g, '-')
    .replace(/│/g, '|')
    .replace(/┌/g, '+')
    .replace(/┐/g, '+')
    .replace(/└/g, '+')
    .replace(/┘/g, '+')
    .replace(/├/g, '+')
    .replace(/┤/g, '+')
    .replace(/┬/g, '+')
    .replace(/┴/g, '+')
    .replace(/┼/g, '+')
    .replace(/▶/g, '>')
    .replace(/◀/g, '<')
    .replace(/✓/g, 'OK')
    .replace(/✗/g, 'X')
    .replace(/★/g, '*')
    .replace(/☆/g, '*')
    .replace(/…/g, '...')
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/…/g, '...')
    .replace(/¿/g, '?')
    .replace(/¡/g, '!')
    .replace(/×/g, 'x')
    .replace(/÷/g, '/')
    .replace(/±/g, '+/-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/≠/g, '!=')
    .replace(/≈/g, '~')
    .replace(/∞/g, 'inf')
    .replace(/∑/g, 'sum')
    .replace(/∏/g, 'prod')
    .replace(/√/g, 'sqrt')
    .replace(/∫/g, 'int')
    .replace(/∂/g, 'd')
    .replace(/Δ/g, 'Delta')
    .replace(/δ/g, 'delta')
    .replace(/π/g, 'pi')
    .replace(/σ/g, 'sigma')
    .replace(/μ/g, 'mu')
    .replace(/α/g, 'alpha')
    .replace(/β/g, 'beta')
    .replace(/γ/g, 'gamma')
    .replace(/θ/g, 'theta')
    .replace(/φ/g, 'phi')
    .replace(/ω/g, 'omega')
    .replace(/Ω/g, 'Omega')
    .replace(/λ/g, 'lambda')
    .replace(/ε/g, 'epsilon')
    .replace(/∈/g, 'in')
    .replace(/∉/g, 'not in')
    .replace(/⊂/g, 'subset')
    .replace(/⊃/g, 'superset')
    .replace(/∪/g, 'union')
    .replace(/∩/g, 'intersect')
    .replace(/∅/g, 'empty')
    .replace(/∀/g, 'for all')
    .replace(/∃/g, 'exists')
    .replace(/¬/g, 'not')
    .replace(/∧/g, 'and')
    .replace(/∨/g, 'or')
    .replace(/⊕/g, 'xor')
    .replace(/⇒/g, '=>')
    .replace(/⇔/g, '<=>')
    .replace(/∴/g, 'therefore')
    .replace(/∵/g, 'because')
    .replace(/⊤/g, 'true')
    .replace(/⊥/g, 'false');
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

const PRIMARY_DOCX = PRIMARY_HEX;
const SECONDARY_DOCX = SECONDARY_HEX;
const ACCENT_DOCX = ACCENT_HEX;

// Simple markdown parser - converts markdown tokens directly to docx elements
function parseMarkdownToDocx(markdown, title) {
  const children = [];
  
  // Title page
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'BI-GenIA NutriCampo (NutriBI)', bold: true, size: 48, color: PRIMARY_DOCX })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 32, color: SECONDARY_DOCX })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Universidad de Caldas', size: 24, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Facultad de Ingeniería - Ingeniería de Sistemas', size: 20, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Asignatura: Sistemas de Información e Informática Industrial', size: 18, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Profesor: Jhon Wilder Sanchez', size: 18, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Grupo 2', size: 18, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Integrantes: Juan Manuel Giraldo, Juan David Maldonado, Victor Manuel Fernandez', size: 18, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Julio 2026', size: 20, color: PRIMARY_DOCX })],
      alignment: AlignmentType.CENTER,
      pageBreakBefore: true,
    })
  );

  // Parse markdown lines
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  let codeBlockContent = [];
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];
  let listCounter = 0;
  let inList = false;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Code block
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        const codeText = codeBlockContent.join('\n');
        children.push(new Paragraph({
          children: [new TextRun({ text: codeText, font: 'Courier New', size: 20 })],
          spacing: { after: 120 },
          shading: { fill: 'F5F5F5' },
        }));
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Skip title page metadata table at the start
    if (i < 30 && trimmed.startsWith('|') && trimmed.includes('Universidad')) {
      // Skip the metadata table lines
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      children.push(new Paragraph({
        children: [new TextRun({ text: '-'.repeat(80), color: ACCENT_DOCX, size: 12 })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
      }));
      continue;
    }

    // Headers
    const h1Match = trimmed.match(/^#\s+(.+)$/);
    if (h1Match) {
      if (inList) { flushList(); }
      children.push(new Paragraph({
        text: h1Match[1],
        heading: HeadingLevel.HEADING_1,
        style: 'Heading1',
      }));
      continue;
    }

    const h2Match = trimmed.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (inList) { flushList(); }
      children.push(new Paragraph({
        text: h2Match[1],
        heading: HeadingLevel.HEADING_2,
        style: 'Heading2',
      }));
      continue;
    }

    const h3Match = trimmed.match(/^###\s+(.+)$/);
    if (h3Match) {
      if (inList) { flushList(); }
      children.push(new Paragraph({
        text: h3Match[1],
        heading: HeadingLevel.HEADING_3,
        style: 'Heading3',
      }));
      continue;
    }

    // Lists
    const bulletMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'bullet') {
        if (inList) { flushList(); }
        inList = true;
        listType = 'bullet';
        listCounter = 0;
      }
      listCounter++;
      children.push(new Paragraph({
        children: [
          new TextRun({ text: '• ', bold: true, color: PRIMARY_DOCX }),
          new TextRun({ text: bulletMatch[1] }),
        ],
        indent: { left: 720, hanging: 360 },
        spacing: { after: 60 },
      }));
      continue;
    }

    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (!inList || listType !== 'numbered') {
        if (inList) { flushList(); }
        inList = true;
        listType = 'numbered';
        listCounter = 0;
      }
      listCounter++;
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${listCounter}. `, bold: true, color: PRIMARY_DOCX }),
          new TextRun({ text: numberedMatch[1] }),
        ],
        indent: { left: 720, hanging: 360 },
        spacing: { after: 60 },
      }));
      continue;
    }

    if (inList && !bulletMatch && !numberedMatch && trimmed === '') {
      // Empty line in list - continue
      continue;
    }

    if (inList && !bulletMatch && !numberedMatch && trimmed !== '') {
      // End of list
      inList = false;
      listType = null;
    }

    // Table
    if (trimmed.startsWith('|')) {
      const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length > 0) {
        if (!inTable) {
          inTable = true;
          if (trimmed.includes('---')) {
            // Skip separator row
          } else if (tableHeaders.length === 0) {
            tableHeaders = cells;
          } else {
            tableRows.push(cells);
          }
        } else {
          if (trimmed.includes('---')) {
            // Skip separator row
          } else if (tableHeaders.length === 0) {
            tableHeaders = cells;
          } else {
            tableRows.push(cells);
          }
        }
      }
      continue;
    }

    if (inTable && !trimmed.startsWith('|')) {
      // End of table
      inTable = false;
      if (tableHeaders.length > 0 || tableRows.length > 0) {
        children.push(buildTable(tableHeaders, tableRows));
      }
      tableHeaders = [];
      tableRows = [];
    }

    // Bold/italic inline processing for regular paragraphs
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('|') && !trimmed.startsWith('---')) {
      if (inList) { flushList(); }
      const runs = parseInlineFormatting(line);
      if (runs.length > 0) {
        children.push(new Paragraph({
          children: runs,
          spacing: { after: 120 },
        }));
      }
    }
  }

  // Flush any remaining
  if (inList) { flushList(); }
  if (inTable && (tableHeaders.length > 0 || tableRows.length > 0)) {
    children.push(buildTable(tableHeaders, tableRows));
  }

  function flushList() {
    inList = false;
    listType = null;
    listCounter = 0;
  }

  function buildTable(headers, rows) {
    const tableChildren = [];
    
    if (headers.length > 0) {
      tableChildren.push(new TableRow({
        children: headers.map(h => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })],
          shading: { fill: PRIMARY_DOCX },
          borders: { top: { style: BorderStyle.SINGLE, size: 1 }, bottom: { style: BorderStyle.SINGLE, size: 1 }, left: { style: BorderStyle.SINGLE, size: 1 }, right: { style: BorderStyle.SINGLE, size: 1 } },
        })),
        tableHeader: true,
      }));
    }
    
    for (const row of rows) {
      tableChildren.push(new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: cell })] })],
          borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
        })),
      }));
    }
    
    return new Table({
      rows: tableChildren,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }, insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    });
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: children,
    }],
    styles: {
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { color: PRIMARY_DOCX, bold: true, size: 28 }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { color: SECONDARY_DOCX, bold: true, size: 24 }, paragraph: { spacing: { before: 200, after: 100 }, keepNext: true } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { color: SECONDARY_DOCX, bold: true, size: 22 }, paragraph: { spacing: { before: 160, after: 80 }, keepNext: true } },
      ],
    },
  });

  return doc;
}

function parseInlineFormatting(text) {
  const runs = [];
  let lastIndex = 0;
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index) }));
    }
    const content = match[1];
    if (content.startsWith('**') && content.endsWith('**')) {
      runs.push(new TextRun({ text: content.slice(2, -2), bold: true }));
    } else if (content.startsWith('*') && content.endsWith('*')) {
      runs.push(new TextRun({ text: content.slice(1, -1), italics: true }));
    } else if (content.startsWith('`') && content.endsWith('`')) {
      runs.push(new TextRun({ text: content.slice(1, -1), font: 'Courier New', size: 20 }));
    }
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex) }));
  }
  
  return runs.length > 0 ? runs : [new TextRun({ text })];
}

// PDF generation
async function generatePdf(markdown, title, outputPath) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 72;
  const contentWidth = pageWidth - 2 * margin;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Title page
  drawTitlePage(pdfDoc, page, title, font, fontBold);
  page = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - margin;

  // Parse markdown for PDF
  const lines = parseMarkdownForPdf(markdown);

  for (const line of lines) {
    if (y < margin + 20) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    const { text, style } = line;
    if (!text.trim()) {
      y -= 8;
      continue;
    }

    // Sanitize text for WinAnsi encoding
    const sanitizedText = sanitizeForPdf(text);

    const fontSize = style === 'h1' ? 18 : style === 'h2' ? 15 : style === 'h3' ? 13 : style === 'bullet' || style === 'numbered' ? 11 : style === 'table' ? 9 : 11;
    const usedFont = style === 'h1' || style === 'h2' || style === 'h3' ? fontBold : style === 'blockquote' ? fontOblique : font;
    const color = style === 'h1' ? PRIMARY_RGB : style === 'h2' || style === 'h3' ? SECONDARY_RGB : BLACK_RGB;
    const indent = style === 'bullet' || style === 'numbered' ? 36 : 0;
    const spacingBefore = style === 'h1' ? 16 : style === 'h2' ? 14 : style === 'h3' ? 12 : 0;

    y -= spacingBefore;

    const words = sanitizedText.split(' ');
    let lineText = '';
    const maxWidth = contentWidth - indent;

    for (const word of words) {
      const testLine = lineText + (lineText ? ' ' : '') + word;
      const width = usedFont.widthOfTextAtSize(testLine, fontSize);
      
      if (width > maxWidth && lineText) {
        page.drawText(lineText, {
          x: margin + indent,
          y,
          size: fontSize,
          font: usedFont,
          color: color,
        });
        y -= fontSize * 1.3;
        lineText = word;
        
        if (y < margin + 20) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
      } else {
        lineText = testLine;
      }
    }

    if (lineText) {
      page.drawText(lineText, {
        x: margin + indent,
        y,
        size: fontSize,
        font: usedFont,
        color: color,
      });
      y -= fontSize * 1.3;
    }

    y -= 4;
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}

function drawTitlePage(pdfDoc, page, title, font, fontBold) {
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  page.drawRectangle({
    x: 0, y: pageHeight - 120, width: pageWidth, height: 8,
    color: ACCENT_RGB,
  });

  const titleText = 'BI-GenIA NutriCampo (NutriBI)';
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 32);
  page.drawText(titleText, {
    x: (pageWidth - titleWidth) / 2, y: pageHeight - 200,
    size: 32, font: fontBold, color: PRIMARY_RGB,
  });

  const subtitleWidth = font.widthOfTextAtSize(title, 20);
  page.drawText(title, {
    x: (pageWidth - subtitleWidth) / 2, y: pageHeight - 250,
    size: 20, font: fontBold, color: SECONDARY_RGB,
  });

  const infoLines = [
    'Universidad de Caldas',
    'Facultad de Ingeniería - Ingeniería de Sistemas',
    'Asignatura: Sistemas de Información e Informática Industrial',
    'Profesor: Jhon Wilder Sanchez',
    'Grupo 2',
    'Integrantes: Juan Manuel Giraldo, Juan David Maldonado, Victor Manuel Fernandez',
    '',
    'Julio 2026'
  ];

  let y = pageHeight - 320;
  for (const line of infoLines) {
    const lineWidth = font.widthOfTextAtSize(line, 12);
    page.drawText(line, {
      x: (pageWidth - lineWidth) / 2, y,
      size: 12, font: line === 'Julio 2026' ? fontBold : font,
      color: line === 'Julio 2026' ? PRIMARY_RGB : GRAY_RGB,
    });
    y -= 20;
  }
}

function parseMarkdownForPdf(markdown) {
  const lines = [];
  const mdLines = markdown.split('\n');
  let inCodeBlock = false;
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];
  let listCounter = 0;
  let inList = false;
  let listType = null;

  for (let i = 0; i < mdLines.length; i++) {
    let line = mdLines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (trimmed === '---' || trimmed === '***') {
      lines.push({ text: '----------------------------------------', style: 'hr' });
      continue;
    }

    const h1Match = trimmed.match(/^#\s+(.+)$/);
    if (h1Match) { if (inList) { inList = false; } lines.push({ text: h1Match[1], style: 'h1' }); continue; }

    const h2Match = trimmed.match(/^##\s+(.+)$/);
    if (h2Match) { if (inList) { inList = false; } lines.push({ text: h2Match[1], style: 'h2' }); continue; }

    const h3Match = trimmed.match(/^###\s+(.+)$/);
    if (h3Match) { if (inList) { inList = false; } lines.push({ text: h3Match[1], style: 'h3' }); continue; }

    const bulletMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'bullet') { if (inList) { inList = false; } inList = true; listType = 'bullet'; listCounter = 0; }
      listCounter++;
      lines.push({ text: `• ${bulletMatch[1]}`, style: 'bullet' });
      continue;
    }

    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (!inList || listType !== 'numbered') { if (inList) { inList = false; } inList = true; listType = 'numbered'; listCounter = 0; }
      listCounter++;
      lines.push({ text: `${listCounter}. ${numberedMatch[1]}`, style: 'numbered' });
      continue;
    }

    if (inList && !bulletMatch && !numberedMatch && trimmed === '') continue;
    if (inList && !bulletMatch && !numberedMatch && trimmed !== '') { inList = false; listType = null; }

    if (trimmed.startsWith('|')) {
      const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length > 0) {
        if (!inTable) {
          inTable = true;
          if (trimmed.includes('---')) {
            // skip
          } else if (tableHeaders.length === 0) {
            tableHeaders = cells;
          } else {
            tableRows.push(cells);
          }
        } else {
          if (trimmed.includes('---')) {
            // skip
          } else if (tableHeaders.length === 0) {
            tableHeaders = cells;
          } else {
            tableRows.push(cells);
          }
        }
      }
      continue;
    }

    if (inTable && !trimmed.startsWith('|')) {
      inTable = false;
      if (tableHeaders.length > 0) {
        lines.push({ text: tableHeaders.join(' | '), style: 'table' });
        for (const row of tableRows) {
          lines.push({ text: row.join(' | '), style: 'table' });
        }
      }
      tableHeaders = [];
      tableRows = [];
    }

    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('|') && !trimmed.startsWith('---') && !trimmed.startsWith('*')) {
      if (inList) { inList = false; listType = null; }
      // Clean inline formatting for PDF
      let cleanText = line
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1');
      lines.push({ text: cleanText.trim(), style: 'p' });
    }
  }

  if (inTable && tableHeaders.length > 0) {
    lines.push({ text: tableHeaders.join(' | '), style: 'table' });
    for (const row of tableRows) {
      lines.push({ text: row.join(' | '), style: 'table' });
    }
  }

  return lines;
}

async function convertAll() {
  for (const file of files) {
    const inputPath = path.join(DOCS_DIR, file);
    const outputName = file.replace('.md', '');
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  File not found: ${inputPath}`);
      continue;
    }
    
    console.log(`Converting ${file}...`);
    
    const markdown = fs.readFileSync(inputPath, 'utf-8');
    const title = outputName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    // Generate DOCX
    const doc = parseMarkdownToDocx(markdown, title);
    const docxBuffer = await Packer.toBuffer(doc);
    const docxPath = path.join(OUTPUT_DIR, `${outputName}.docx`);
    fs.writeFileSync(docxPath, docxBuffer);
    console.log(`  ✅ DOCX: ${docxPath}`);
    
    // Generate PDF
    await generatePdf(markdown, title, path.join(OUTPUT_DIR, `${outputName}.pdf`));
    console.log(`  ✅ PDF: ${path.join(OUTPUT_DIR, `${outputName}.pdf`)}`);
  }
  
  console.log('\n✨ All documents converted successfully!');
}

convertAll().catch(console.error);