import jsdom from 'jsdom';
import fs from 'fs';

const { JSDOM } = jsdom;
const html = fs.readFileSync('debug_html.html', 'utf-8');
const { window } = new JSDOM(html);
const document = window.document;

console.log('HTML length:', html.length);
console.log('Gallery-grid articles found:', document.querySelectorAll('.gallery-grid article').length);
console.log('All articles found:', document.querySelectorAll('article').length);

const firstArticle = document.querySelector('article');
if (firstArticle) {
  console.log('\n--- First Article ---');
  console.log('Title:', firstArticle.querySelector('h3.poster-title')?.textContent);
  console.log('Rating:', firstArticle.querySelector('.rating')?.textContent);
  console.log('Img src:', firstArticle.querySelector('img')?.getAttribute('src'));
  console.log('Genre:', firstArticle.querySelector('.genre')?.textContent);
  console.log('Link:', firstArticle.querySelector('a')?.getAttribute('href'));
} else {
  console.log('No article found!');
}
