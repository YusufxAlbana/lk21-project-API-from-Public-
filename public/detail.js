const API_BASE = '/api/v1';

// Get movie URL from query parameter
const urlParams = new URLSearchParams(window.location.search);
const movieUrl = urlParams.get('url');

if (!movieUrl) {
    document.querySelector('.detail-loading').innerHTML = '<p class="error">No movie specified</p>';
} else {
    loadMovieDetail(movieUrl);
}

async function loadMovieDetail(url) {
    try {
        const response = await fetch(`${API_BASE}/detail?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.status === 'success') {
            renderMovieDetail(result.data);
        } else {
            document.querySelector('.detail-loading').innerHTML = '<p class="error">Failed to load movie details.</p>';
        }
    } catch (error) {
        console.error('Error fetching details:', error);
        document.querySelector('.detail-loading').innerHTML = '<p class="error">Error loading movie details.</p>';
    }
}

function renderMovieDetail(movie) {
    const poster = movie.poster || 'https://via.placeholder.com/300x450';
    const fullTitle = movie.title || 'Unknown Title';
    const synopsis = movie.synopsis || 'No synopsis available.';
    const rating = parseFloat(movie.rating) || 0;
    const director = movie.director || 'N/A';
    const cast = movie.cast || 'N/A';
    const country = movie.country || 'N/A';
    const duration = movie.duration || 'N/A';
    const watchLink = movie.downloadLink || movie.streamLink || '#';
    const trailerUrl = movie.trailerUrl || '';

    // Extract year from title (e.g., "Movie Title (2025)" -> year: "2025", title: "Movie Title")
    const yearMatch = fullTitle.match(/\((\d{4})\)/);
    const year = yearMatch ? yearMatch[1] : null;
    let cleanTitle = yearMatch ? fullTitle.replace(/\s*\(\d{4}\)/, '') : fullTitle;
    
    // Extract subtitle info (e.g., "Sub Indo", "di Lk21", etc.)
    const subtitlePatterns = [
        /Sub\s+(Indo|Indonesia)/i,
        /Subtitle\s+(Indonesia|Indo)/i,
        /di\s+Lk21/i,
        /Nonton\s+/i
    ];
    
    let subtitleInfo = [];
    
    // Extract and remove patterns
    subtitlePatterns.forEach(pattern => {
        const match = cleanTitle.match(pattern);
        if (match) {
            subtitleInfo.push(match[0].trim());
            cleanTitle = cleanTitle.replace(pattern, '').trim();
        }
    });
    
    // Clean up extra spaces and punctuation
    cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
    const title = cleanTitle;
    const subtitle = subtitleInfo.length > 0 ? subtitleInfo.join(' ') : null;

    // Rating bar calculation (scale 0-10)
    const ratingPercent = (rating / 10) * 100;
    
    const content = `
        <div class="detail-hero">
            <div class="detail-hero-bg" style="background-image: url('${poster}')"></div>
            <div class="detail-hero-overlay"></div>
        </div>

        <div class="detail-main">
            <div class="detail-poster">
                <img src="${poster}" alt="${title}">
            </div>
            
            <div class="detail-info">
                <h1 class="detail-title">${title}</h1>
                ${year || subtitle ? `<div class="detail-year-subtitle-wrapper">
                    ${year ? `<div class="detail-year">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem;">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                            <line x1="8" y1="14" x2="8" y2="14"/>
                            <line x1="12" y1="14" x2="12" y2="14"/>
                            <line x1="16" y1="14" x2="16" y2="14"/>
                            <line x1="8" y1="18" x2="8" y2="18"/>
                            <line x1="12" y1="18" x2="12" y2="18"/>
                            <line x1="16" y1="18" x2="16" y2="18"/>
                        </svg>
                        ${year}
                    </div>` : ''}
                    ${subtitle ? `<div class="detail-subtitle"><i class="fas fa-closed-captioning"></i> ${subtitle}</div>` : ''}
                </div>` : ''}
                
                <div class="detail-rating-section">
                    <div class="rating-bar-container">
                        <i class="fas fa-star rating-star-icon"></i>
                        <div class="rating-bar-fill" style="width: ${ratingPercent}%">
                            <span class="rating-text">${rating > 0 ? rating : 'N/A'}</span>
                        </div>
                    </div>
                    <span class="rating-label">Rating</span>
                </div>

                <div class="detail-meta">
                    <span><i class="fas fa-clock"></i> ${duration}</span>
                    <span><i class="fas fa-globe"></i> ${country}</span>
                </div>

                <div class="detail-section">
                    <h3>Synopsis</h3>
                    <p class="synopsis-text">${synopsis}</p>
                </div>

                <div class="detail-section">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="label">Director:</span>
                            <span class="value">${director}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Cast:</span>
                            <span class="value">${cast}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-actions">
                    ${watchLink !== '#' ? 
                        `<a href="${watchLink}" target="_blank" class="watch-btn">
                            <i class="fas fa-play"></i> WATCH MOVIE
                        </a>` : 
                        '<button disabled class="watch-btn">Unavailable</button>'
                    }
                    ${trailerUrl ? 
                        `<a href="${trailerUrl}" target="_blank" class="trailer-btn">
                            <i class="fas fa-video"></i> TRAILER
                        </a>` : ''
                    }
                    <button onclick="window.history.back()" class="back-btn">
                        <i class="fas fa-arrow-left"></i> BACK
                    </button>
                </div>
            </div>
        </div>
    `;

    document.querySelector('.detail-loading').style.display = 'none';
    document.getElementById('detailContent').style.display = 'block';
    document.getElementById('detailContent').innerHTML = content;
    
    // Update page title
    document.title = `${title} - LK21 Vibe`;
}

// Search functionality
document.getElementById('searchBtn')?.addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `/?search=${encodeURIComponent(query)}`;
    }
});

document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            window.location.href = `/?search=${encodeURIComponent(query)}`;
        }
    }
});
