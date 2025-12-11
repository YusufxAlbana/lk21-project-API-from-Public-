import api from "../config/api.js";
import getMovieData from "../utils/getMovieData.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const pathArray = path || [];
  const endpoint = pathArray[0] || 'latest';
  
  try {
    const numPage = req.query.page || 1;
    let url = '';
    
    // Route handling
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
