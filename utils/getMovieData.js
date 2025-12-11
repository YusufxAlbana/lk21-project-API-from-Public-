import jsdom from "jsdom";

const { JSDOM } = jsdom;

const getMovieData = ({ htmlCode }) => {
  const { window } = new JSDOM(htmlCode);
  const document = window.document;

  // Attempt to find movie cards using the new selector structure
  let movieCards = document.querySelectorAll(".gallery-grid article");
  // Fallback if gallery-grid not found (e.g. slight layout diff)
  if (movieCards.length === 0) {
      movieCards = document.querySelectorAll("article");
  }

  let totalPages = 1;
  try {
      // Pagination parsing: <ul class="pagination"> ... <li><a href="...">1106</a></li> ... </ul>
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

        // Try multiple ways to get poster image
        let poster = "";
        // First try: img tag directly
        const imgEl = movie.querySelector("img");
        if (imgEl) {
            poster = imgEl.getAttribute("src") || "";
        }
        // Second try: picture > source with srcset
        if (!poster) {
            const sourceEl = movie.querySelector("picture source");
            if (sourceEl) {
                poster = sourceEl.getAttribute("srcset") || "";
            }
        }

        // Get rating from the span with itemprop="ratingValue"
        const ratingValueEl = movie.querySelector('span[itemprop="ratingValue"]');
        const rating = ratingValueEl ? ratingValueEl.textContent.trim() : "N/A";

        const qualityEl = movie.querySelector(".label");
        const quality = qualityEl ? qualityEl.textContent.trim() : "HD";

        const categoryEl = movie.querySelector(".genre");
        const categories = categoryEl ? categoryEl.textContent.trim() : "";

        const anchor = movie.querySelector("a");
        const href = anchor ? anchor.getAttribute("href") : "";
        
        // Construct a logical options object for frontend compatibility
        const options = {
            name: title,
            url: href.startsWith("http") ? href : `https://tv7.lk21official.cc${href}`
        };
        
        // Use the movie page URL as the "downloadLink" for now
        const downloadLink = options.url;

        // Only require title to be present - poster might be lazy loaded
        if (title) {
             result.push({ title, poster, rating, quality, categories, downloadLink, options });
        }
    } catch (e) {
        console.error("Error parsing individual movie:", e);
    }
  });

  return { result, totalPages };
};

export default getMovieData;

