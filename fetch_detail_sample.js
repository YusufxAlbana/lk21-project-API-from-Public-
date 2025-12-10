import axios from 'axios';
import jsdom from 'jsdom';
import fs from 'fs';

const { JSDOM } = jsdom;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

async function run() {
    try {
        console.log("Fetching index...");
        const indexResp = await axios.get('https://lk21.de/latest', { headers: { 'User-Agent': UA } });
        const dom = new JSDOM(indexResp.data);
        const article = dom.window.document.querySelector('article a');
        
        if (!article) {
            console.log("No article found");
            return;
        }
        
        const href = article.getAttribute('href');
        const url = href.startsWith('http') ? href : `https://lk21.de${href}`;
        console.log("Found URL:", url);
        
        console.log("Fetching detail...");
        const detailResp = await axios.get(url, { headers: { 'User-Agent': UA } });
        
        fs.writeFileSync('detail_dump.html', detailResp.data);
        console.log("Saved to detail_dump.html");
        
    } catch (e) {
        console.error(e);
    }
}

run();
