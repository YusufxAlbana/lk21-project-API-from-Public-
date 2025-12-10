import jsdom from "jsdom";

const { JSDOM } = jsdom;

const getMovieDetail = ({ htmlCode }) => {
  const { window } = new JSDOM(htmlCode);
  const document = window.document;

  let result = {};

  try {
    const titleEl = document.querySelector("h1");
    // Ensure we clean up "Nonton" and "Sub Indo" etc if desired, but raw title is fine too.
    result.title = titleEl ? titleEl.textContent.trim() : "Unknown Title";

    const posterEl = document.querySelector(".movie-info img");
    result.poster = posterEl ? posterEl.getAttribute("src") : "";

    // Synopsis - usually in .synopsis
    const synopsisEl = document.querySelector(".synopsis");
    result.synopsis = synopsisEl ? synopsisEl.textContent.trim() : "No synopsis available.";

    // Meta info (Director, Cast, etc)
    // Detailed structure in dump: .detail p ...
    
    // Director
    const directorEl = document.querySelector('.detail a[href*="/director/"]');
    result.director = directorEl ? directorEl.textContent.trim() : "N/A";

    // Cast - multiple
    const castEls = document.querySelectorAll('.detail a[href*="/artist/"]');
    result.cast = Array.from(castEls).map(el => el.textContent.trim()).join(", ");

    // Country
    const countryEl = document.querySelector('.detail a[href*="/country/"]');
    result.country = countryEl ? countryEl.textContent.trim() : "N/A";
    
    // Rating
    const ratingEl = document.querySelector(".info-tag i.fa-star");
    result.rating = ratingEl && ratingEl.parentElement ? ratingEl.parentElement.textContent.trim() : "N/A";
    
    // Duration
    const infoTags = document.querySelectorAll(".info-tag span");
    // Usually the last one or regex. Let's just grab the text of info-tag
    // The dump shows: <span><i class="fa-star"></i>8.5</span> ... <span>1h 40m</span>
    if(infoTags.length > 0) {
        // simple heuristic: find one with 'h' and 'm'
        const durationTag = Array.from(infoTags).find(el => el.textContent.includes('h') || el.textContent.includes('m'));
        result.duration = durationTag ? durationTag.textContent.trim() : "N/A";
    }

    // Trailer
    const trailerEl = document.querySelector('a.yt-lightbox');
    result.trailerUrl = trailerEl ? trailerEl.getAttribute('href') : "";

    // Watch/Download Link
    // 1. Check for Download Button
    const downloadBtn = document.querySelector('a.btn[href*="dl.lk21"]');
    result.downloadLink = downloadBtn ? downloadBtn.getAttribute('href') : "";
    
    // 2. Iframe src if available
    const iframe = document.querySelector('#main-player');
    result.streamLink = iframe ? iframe.getAttribute('src') : "";

  } catch (e) {
    console.error("Error parsing movie detail:", e);
  }

  return result;
};

export default getMovieDetail;
