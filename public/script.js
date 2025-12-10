const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sectionTitle = document.querySelector('#latest-section h2');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Base API URL
const API_BASE = '/api/v1';

// State tracks
let currentPage = 1;
let currentEndpoint = 'latest';
let isLoading = false;
let allMovies = []; // Store all loaded movies for client-side search
let displayedMovies = []; // Currently displayed movies

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies('latest', 1, true);
});

// Load More Button
loadMoreBtn.addEventListener('click', () => {
    if (!isLoading) {
        currentPage++;
        fetchMovies(currentEndpoint, currentPage, false);
    }
});

// Search functionality - Real-time filtering (like Ctrl+F)
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    filterMovies(query);
});

// Clear search when clicking search button (optional - toggle behavior)
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        filterMovies(query);
    } else {
        // If empty, show all movies
        filterMovies('');
    }
});

// Real-time filter function
function filterMovies(query) {
    if (!query) {
        // Show all loaded movies
        renderFilteredMovies(allMovies);
        sectionTitle.textContent = 'Latest Updates';
        return;
    }
    
    // Filter movies based on title
    const filtered = allMovies.filter(movie => {
        const title = (movie.title || movie.Title || movie.options?.name || '').toLowerCase();
        return title.includes(query);
    });
    
    renderFilteredMovies(filtered, query);
}


// Fetch Functions
async function fetchMovies(endpoint, page = 1, reset = true) {
    if (isLoading) return;
    showLoading(true);
    
    // Save state if this is a fresh fetch (not load more)
    if (reset) {
        currentEndpoint = endpoint;
        currentPage = page;
        isSearching = false;
        loadMoreBtn.style.display = 'none'; // Hide until we know we have results
    }

    try {
        // Construct URL pending on endpoint type
        // if endpoint is 'latest', api is /latest?page=N (or /latest/page/N)
        // controller says: /latest/page/:page
        
        let url;
        if (endpoint === 'latest') {
            // Check if endpoint already has page or if we need to construct it
            // The controller for latest is mapped at /latest and uses query param ?page=
            // Wait, let me check controller again. 
            // routes/api/v1/latest/latest.controller.js: const numPage = req.query.page || 1;
            // AND: const latestMoviesByPage = await api(`/latest/page/${numPage}`);
            // So /api/v1/latest?page=N is correct for our proxy.
            url = `${API_BASE}/latest?page=${page}`;
        } else if (endpoint.startsWith('genre/')) {
            // For genre, it usually follows /genre/:genreName?page=N
            url = `${API_BASE}/${endpoint}?page=${page}`;
        } else {
             url = `${API_BASE}/${endpoint}?page=${page}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        let movies = [];
        if (data.data) {
             movies = data.data;
        } else if (data.result) {
            movies = data.result;
        } else if (Array.isArray(data)) {
            movies = data;
        }

        processMovies(movies, reset);
        
        if (reset) {
            sectionTitle.textContent = formatTitle(endpoint);
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        if (reset) {
            movieGrid.innerHTML = '<p class="error">Failed to load movies. Please try again later.</p>';
        }
    } finally {
        showLoading(false);
    }
}

async function searchMovies(query, page = 1, reset = true) {
    if (isLoading) return;
    showLoading(true);

    if (reset) {
        sectionTitle.textContent = `Search Results for "${query}"`;
        loadMoreBtn.style.display = 'none';
        currentPage = 1;
    }

    try {
        // Search endpoint: /search?q=query&page=N
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&page=${page}`);
        const data = await response.json();
        
        let movies = [];
        if (data.data) {
             movies = data.data;
        } else if (data.result) {
            movies = data.result;
        } else if (Array.isArray(data)) {
            movies = data;
        }

        if (movies.length === 0 && reset) {
            movieGrid.innerHTML = '<p>No movies found matching your query.</p>';
            loadMoreBtn.style.display = 'none';
            return;
        }

        processMovies(movies, reset);
        
    } catch (error) {
        console.error('Error searching:', error);
        if (reset) {
            movieGrid.innerHTML = '<p class="error">Search failed. Please try again.</p>';
        }
    } finally {
        showLoading(false);
    }
}

function processMovies(movies, reset) {
    if (reset) {
        movieGrid.innerHTML = '';
        allMovies = [...movies]; // Reset and store all movies
    } else {
        // Remove the spinner appended at the bottom if any
        const spinner = movieGrid.querySelector('.loading-spinner');
        if (spinner) spinner.remove();
        // Append new movies to allMovies
        allMovies = [...allMovies, ...movies];
    }

    if (movies.length > 0) {
        renderMovies(movies);
        // Show load more button if we got results, assuming there might be more
        loadMoreBtn.style.display = 'block';
    } else {
        if (!reset) {
            // No more movies to load
            loadMoreBtn.style.display = 'none';
        }
    }
}

// UI Helpers
function showLoading(show) {
    isLoading = show;
    if (show) {
        // If resetting, clear grid and show big spinner? Or just spinner?
        // If loading more, append spinner.
        
        // Simpler approach:
        if (loadMoreBtn) loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';
        
        // If grid is empty, show spinner in grid
        if (movieGrid.children.length === 0) {
             movieGrid.innerHTML = '<div class="loading-spinner"></div>';
        }
    } else {
        if (loadMoreBtn) loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Movies';
        
        // Remove spinner from grid if it was the only thing
        const spinner = movieGrid.querySelector('.loading-spinner');
        if (spinner && movieGrid.children.length === 1) {
            spinner.remove();
        }
    }
}

function renderMovies(movies) {
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        const title = movie.title || movie.Title || movie.options?.name || 'Unknown Title';
        const poster = movie.poster || movie.thumbnail || movie.Poster || 'https://via.placeholder.com/300x450?text=No+Image';
        const rating = movie.rating || movie.imDbRating || 'N/A';
        const quality = movie.quality || movie.Quality || 'HD';
        const url = movie.options?.url || '#';
        
        card.innerHTML = `
            <div class="poster-wrapper">
                <img src="${poster}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450?text=Error'">
            </div>
            <div class="movie-info">
                <h3 class="movie-title" title="${title}">${title}</h3>
                <div class="movie-meta">
                    <span class="quality">${quality}</span>
                    <span class="rating-badge"><i class="fas fa-star"></i> ${rating}</span>
                </div>
            </div>
        `;
        
        // Add click event to navigate to detail page
        card.addEventListener('click', () => {
             if (url && url !== '#') {
                 window.location.href = `/detail.html?url=${encodeURIComponent(url)}`;
             }
        });
        
        movieGrid.appendChild(card);
    });
}

// Render filtered movies (client-side search results)
function renderFilteredMovies(movies, query = '') {
    movieGrid.innerHTML = '';
    
    if (movies.length === 0) {
        // Show "no results" message
        movieGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No movies found matching your search</h3>
                <p>Try different keywords or browse all movies</p>
            </div>
        `;
        sectionTitle.textContent = query ? `Search Results for "${query}"` : 'Latest Updates';
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    // Update title
    if (query) {
        sectionTitle.textContent = `Search Results for "${query}"`;
    } else {
        sectionTitle.textContent = 'Latest Updates';
    }
    
    // Render the filtered movies
    renderMovies(movies);
    loadMoreBtn.style.display = 'none'; // Hide load more when filtering
}


// Modal Logic
const movieModal = document.getElementById('movieModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');

closeModal.addEventListener('click', () => {
    movieModal.classList.remove('active');
    modalBody.innerHTML = '<div class="loading-spinner"></div>'; // Reset
});

movieModal.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.classList.remove('active');
        modalBody.innerHTML = '<div class="loading-spinner"></div>';
    }
});

async function openMovieDetail(url) {
    movieModal.classList.add('active');
    modalBody.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const response = await fetch(`${API_BASE}/detail?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.status === 'success') {
            renderMovieDetail(result.data);
        } else {
            modalBody.innerHTML = '<p class="error">Failed to load details.</p>';
        }
    } catch (error) {
        console.error('Error fetching details:', error);
        modalBody.innerHTML = '<p class="error">Error loading movie details.</p>';
    }
}

function renderMovieDetail(movie) {
    const poster = movie.poster || 'https://via.placeholder.com/300x450';
    const title = movie.title || 'Unknown Title';
    const synopsis = movie.synopsis || 'No synopsis available.';
    const rating = movie.rating || 'N/A';
    const director = movie.director || 'N/A';
    const cast = movie.cast || 'N/A';
    const country = movie.country || 'N/A';
    const duration = movie.duration || 'N/A';
    
    // Determine the action link
    // Priority: Stream Link (iframe src) > Download Link > Fallback to trailer or #
    // User asked to "nonton" (watch), so we prefer stream link if available.
    // However, scraping iframe sources can be tricky (often protected or dynamic).
    // The util tries to get iframe src.
    
    // For the button "WATCH MOVIE", we'll link to the download/stream page or the actual LK21 page 
    // depending on what we found. If we found a direct stream link (rare), we could use it.
    // But safely, let's link to the scraped "downloadLink" which is often the movie page itself or a pseudo-link.
    // Actually, in getMovieDetail.js, downloadLink came from .btn[href*="dl.lk21"] which is usually an interstitial.
    // Let's use the source URL as a fallback if no direct play link.
    
    // Actually, the user wants "diarahkan ke link yang disediakan".
    // Let's use the downloadLink if available, otherwise the original URL.
    const watchLink = movie.downloadLink || movie.streamLink || '#';
    
    modalBody.innerHTML = `
        <div class="modal-grid">
            <div class="modal-poster">
                <img src="${poster}" alt="${title}">
            </div>
            <div class="modal-info">
                <h2>${title}</h2>
                <div class="modal-meta-row">
                    <span class="modal-rating"><i class="fas fa-star"></i> ${rating}</span>
                    <span>${duration}</span>
                    <span>${country}</span>
                </div>
                
                <div class="modal-details-grid">
                    <span class="label">Director:</span>
                    <span class="value">${director}</span>
                    
                    <span class="label">Cast:</span>
                    <span class="value">${cast}</span>
                </div>
                
                <p class="synopsis-text">${synopsis}</p>
                
                <div class="modal-actions">
                    ${watchLink !== '#' ? `<a href="${watchLink}" target="_blank" class="watch-btn"><i class="fas fa-play"></i> WATCH MOVIE</a>` : '<button disabled class="watch-btn">Unavailable</button>'}
                </div>
            </div>
        </div>
    `;
}

function formatTitle(endpoint) {
    if (endpoint === 'latest') return 'Latest Updates';
    if (endpoint.startsWith('genre/')) {
        const genre = endpoint.split('/')[1];
        return `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`;
    }
    return 'Movies';
}

// Tag Filtering
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        const genre = tag.textContent.toLowerCase();
        if (genre === 'all') {
            fetchMovies('latest', 1, true);
        } else {
            fetchMovies(`genre/${genre}`, 1, true);
        }
    });
});
