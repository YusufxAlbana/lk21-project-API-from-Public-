import axios from "axios";
import axiosRetry from "axios-retry";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

// API Config
const baseURL = process.env.LK21_BASE_URL || "https://tv.lk21official.love";

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
  },
  decompress: true,
  responseType: 'text',
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           (error.response && error.response.status >= 500);
  },
});

// Movie Parser
function getMovieData({ htmlCode }) {
  const { window } = new JSDOM(htmlCode);
  const document = window.document;

  let movieCards = document.querySelectorAll(".gallery-grid article");
  if (movieCards.length === 0) {
    movieCards = document.querySelectorAll("article");
  }

  let totalPages = 1;
  try {
    const paginationItems = document.querySelectorAll("ul.pagination li a");
    paginationItems.forEach(item => {
      const val = parseInt(item.textContent.trim());
      if (!isNaN(val) && val > totalPages) {
        totalPages = val;
      }
    });
  } catch (err) {
    console.warn("Pagination parse error:", err.message);
  }

  let result = [];

  movieCards.forEach((movie) => {
    try {
      const titleEl = movie.querySelector("h3.poster-title");
      const title = titleEl ? titleEl.textContent.trim() : "";

      let poster = "";
      const imgEl = movie.querySelector("img");
      if (imgEl) {
        poster = imgEl.getAttribute("src") || "";
      }
      if (!poster) {
        const sourceEl = movie.querySelector("picture source");
        if (sourceEl) {
          poster = sourceEl.getAttribute("srcset") || "";
        }
      }

      const ratingValueEl = movie.querySelector('span[itemprop="ratingValue"]');
      const rating = ratingValueEl ? ratingValueEl.textContent.trim() : "N/A";

      const qualityEl = movie.querySelector(".label");
      const quality = qualityEl ? qualityEl.textContent.trim() : "HD";

      const categoryEl = movie.querySelector(".genre");
      const categories = categoryEl ? categoryEl.textContent.trim() : "";

      const anchor = movie.querySelector("a");
      const href = anchor ? anchor.getAttribute("href") : "";
      
      const options = {
        name: title,
        url: href.startsWith("http") ? href : `https://tv7.lk21official.cc${href}`
      };
      
      const downloadLink = options.url;

      if (title) {
        result.push({ title, poster, rating, quality, categories, downloadLink, options });
      }
    } catch (e) {
      console.error("Error parsing movie:", e);
    }
  });

  return { result, totalPages };
}

// Main Handler
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const pathArray = Array.isArray(path) ? path : (path ? [path] : []);
  const endpoint = pathArray[0] || 'latest';
  
  try {
    const numPage = req.query.page || 1;
    let url = '';
    
    if (endpoint === 'latest') {
      url = `/latest/page/${numPage}`;
    } else if (endpoint === 'genre' && pathArray[1]) {
      url = `/genre/${pathArray[1]}/page/${numPage}`;
    } else if (endpoint === 'year' && pathArray[1]) {
      url = `/year/${pathArray[1]}/page/${numPage}`;
    } else if (endpoint === 'country' && pathArray[1]) {
      url = `/country/${pathArray[1]}/page/${numPage}`;
    } else if (endpoint === 'trending') {
      url = `/trending/page/${numPage}`;
    } else if (endpoint === 'popular') {
      url = `/populer/page/${numPage}`;
    } else if (endpoint === 'search') {
      const query = req.query.q || '';
      url = `/search/?s=${encodeURIComponent(query)}`;
    } else if (endpoint === 'hd-quality') {
      url = `/quality/bluray/page/${numPage}`;
    } else if (endpoint === 'imdb-rating') {
      url = `/rating/page/${numPage}`;
    } else if (endpoint === 'release') {
      url = `/release/page/${numPage}`;
    } else {
      url = `/${endpoint}/page/${numPage}`;
    }

    console.log(`Fetching: ${url}`);
    const response = await api.get(url);
    const htmlCode = response.data;

    if (!htmlCode || htmlCode.length < 1000) {
      return res.status(500).json({
        error: "Failed to fetch data from source",
        htmlLength: htmlCode?.length || 0,
      });
    }

    const { result, totalPages } = getMovieData({ htmlCode });

    res.json({
      data: result,
      totalItems: result.length,
      totalPages,
      currentPage: Number(numPage),
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}
