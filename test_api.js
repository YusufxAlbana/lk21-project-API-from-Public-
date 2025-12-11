import axios from 'axios';
import axiosRetry from 'axios-retry';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

const api = axios.create({
  baseURL: 'https://lk21.de',
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  },
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 2000;
  },
});

async function testFetch() {
  try {
    console.log('Fetching from lk21.de...');
    const response = await api.get('/latest/page/1');
    const html = response.data;
    
    console.log('Response status:', response.status);
    console.log('HTML length:', html?.length || 0);
    
    if (!html) {
      console.log('No HTML received!');
      return;
    }
    
    const { window } = new JSDOM(html);
    const document = window.document;
    
    const articles = document.querySelectorAll('.gallery-grid article');
    console.log('Articles found:', articles.length);
    
    if (articles.length > 0) {
      const first = articles[0];
      console.log('\n--- First Movie ---');
      console.log('Title:', first.querySelector('h3.poster-title')?.textContent);
      console.log('Rating:', first.querySelector('.rating span[itemprop="ratingValue"]')?.textContent);
      console.log('Poster:', first.querySelector('img')?.getAttribute('src'));
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testFetch();
