// test color
const { PDFDocument, rgb } = require('pdf-lib');

async function test() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  // Test 1: rgb helper
  const c1 = rgb(0.886, 0.537, 0.121);
  console.log('rgb helper:', c1);
  
  // Test 2: direct object
  const c2 = { r: 0.886, g: 0.537, b: 0.121 };
  console.log('direct:', c2);
  
  page.drawRectangle({
    x: 0, y: 700, width: 100, height: 20,
    color: c1
  });
  
  page.drawRectangle({
    x: 0, y: 650, width: 100, height: 20,
    color: c2
  });
  
  const bytes = await pdfDoc.save();
  require('fs').writeFileSync('test-color.pdf', bytes);
  console.log('Test PDF created');
}

test().catch(console.error);