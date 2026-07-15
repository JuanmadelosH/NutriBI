// test-markdown.js
const fs = require('fs');
const markdownIt = require('markdown-it');
const md = markdownIt({html:true,breaks:true,linkify:true});

const content = fs.readFileSync('docs/DOCUMENTO_FINAL.md','utf-8');
const html = md.render(content);
console.log('HTML length:', html.length);
console.log(html.substring(0, 1000));