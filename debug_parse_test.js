import axios from 'axios';
import jsdom from 'jsdom';
import fs from 'fs';

const { JSDOM } = jsdom;

async function testParsing() {
    try {
        console.log('Fetching page...');
        const response = await axios.get('https://tv7.lk21official.cc/latest/page/1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate'
            },
            timeout: 15000,
            responseType: 'text'
        });

        const htmlCode = response.data;
        
        // Save HTML for analysis
        fs.writeFileSync('debug_latest.html', htmlCode);
        console.log('Saved HTML to debug_latest.html');

        const { window } = new JSDOM(htmlCode);
        const document = window.document;

        console.log('\n=== SELECTOR TEST ===');
        console.log('.gallery-grid article:', document.querySelectorAll('.gallery-grid article').length);
        console.log('article:', document.querySelectorAll('article').length);
        console.log('h3.poster-title:', document.querySelectorAll('h3.poster-title').length);
        console.log('.poster-title:', document.querySelectorAll('.poster-title').length);

        // Get first article and print structure
        const articles = document.querySelectorAll('article');
        if (articles.length > 0) {
            console.log('\n=== FIRST ARTICLE STRUCTURE ===');
            const first = articles[0];
            console.log('Classes:', first.className);
            
            // Find title inside
            const h3 = first.querySelector('h3');
            const posterTitle = first.querySelector('.poster-title');
            const title = first.querySelector('[class*="title"]');
            
            console.log('h3:', h3 ? h3.textContent.trim().substring(0, 50) : 'NOT FOUND');
            console.log('.poster-title:', posterTitle ? posterTitle.textContent.trim().substring(0, 50) : 'NOT FOUND');
            console.log('[class*=title]:', title ? `(${title.tagName}, ${title.className})` : 'NOT FOUND');
            
            // Find image
            const img = first.querySelector('img');
            console.log('img src:', img ? img.getAttribute('src')?.substring(0, 80) : 'NOT FOUND');
            console.log('img data-src:', img ? img.getAttribute('data-src')?.substring(0, 80) : 'NOT FOUND');
            
            // Find anchor
            const anchor = first.querySelector('a');
            console.log('a href:', anchor ? anchor.getAttribute('href')?.substring(0, 80) : 'NOT FOUND');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testParsing();
