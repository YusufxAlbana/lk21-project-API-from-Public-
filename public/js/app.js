// API Configuration
const API_BASE = '/api/v1';

// State
let currentPage = 1;
let currentEndpoint = 'latest';
let isLoading = false;
let allMovies = [];

// DOM Elements
const movieGrid = document.getElementById('movieGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const sectionTitle = document.getElementById('sectionTitle');
const searchInput = document.getElementById('searchInput');
const movieModal = document.getElementById('movieModal');
const modalContent = document.getElementById('modalContent');
const floatingSearch = document.getElementById('floatingSearch');
const navbar = document.getElementById('navbar');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMovies('latest');
    
    // Search on Enter
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovies();
    });
    
    // Close modal on click outside
    movieModal?.addEventListener('click', (e) => {
        if (e.target === movieModal) closeModal();
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

// Expand/Collapse search
function expandSearch() {
    floatingSearch?.classList.add('expanded');
}

function collapseSearch() {
    setTimeout(() => {
        if (!searchInput?.value) {
            floatingSearch?.classList.remove('expanded');
        }
    }, 200);
}

// Load movies
async function loadMovies(endpoint, page = 1, reset = true) {
    if (isLoading) return;
    isLoading = true;
    
    showLoading(true);
    if (reset) {
        movieGrid.innerHTML = '';
        currentPage = 1;
    }
    
    try {
        const url = `${API_BASE}/${endpoint}?page=${page}`;
        console.log('Fetching:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        let movies = data.data || data.result || [];
        
        if (reset) {
            allMovies = movies;
        } else {
            allMovies = [...allMovies, ...movies];
        }
        
        renderMovies(movies, !reset);
        currentEndpoint = endpoint;
        currentPage = page;
        
        updateSectionTitle(endpoint);
        loadMoreContainer.style.display = movies.length > 0 ? 'flex' : 'none';
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        showError();
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

// Render movies to grid
function renderMovies(movies, append = false) {
    if (!movies || movies.length === 0) {
        if (!append) {
            emptyState.style.display = 'block';
            loadMoreContainer.style.display = 'none';
        }
        return;
    }
    
    emptyState.style.display = 'none';
    
    const html = movies.map((movie, index) => createMovieCard(movie, index)).join('');
    
    if (append) {
        movieGrid.innerHTML += html;
    } else {
        movieGrid.innerHTML = html;
    }
}

// Create movie card HTML
function createMovieCard(movie, index) {
    const title = movie.title || movie.options?.name || 'Unknown';
    const poster = movie.poster || 'https://via.placeholder.com/300x450?text=No+Image';
    const rating = movie.rating || 'N/A';
    const quality = movie.quality || 'HD';
    const categories = movie.categories || '';
    
    const movieData = encodeURIComponent(JSON.stringify(movie));
    const delay = Math.min(index * 0.1, 0.7);
    
    return `
        <div class="movie-card" onclick="openModal('${movieData}')" style="animation-delay: ${delay}s">
            <div class="poster-wrapper">
                <img src="${poster}" alt="${title}" 
                     onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'" loading="lazy">
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${title}</h3>
                <div class="movie-meta">
                    <span>${categories.split(',')[0] || 'Movie'}</span>
                    <span class="rating-badge">⭐ ${rating}</span>
                </div>
            </div>
        </div>
    `;
}

// Load more
function loadMore() {
    loadMovies(currentEndpoint, currentPage + 1, false);
}

// Load by genre
function loadByGenre(genre) {
    setActiveTag(genre);
    loadMovies(`genre/${genre}`, 1, true);
}

// Search movies
function searchMovies() {
    const query = searchInput?.value?.trim();
    if (!query) {
        loadMovies('latest');
        return;
    }
    
    sectionTitle.textContent = `Search: "${query}"`;
    
    // Filter from loaded movies first
    const filtered = allMovies.filter(m => {
        const title = (m.title || m.options?.name || '').toLowerCase();
        return title.includes(query.toLowerCase());
    });
    
    if (filtered.length > 0) {
        movieGrid.innerHTML = '';
        renderMovies(filtered);
        loadMoreContainer.style.display = 'none';
    } else {
        // Try API search
        fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(data => {
                const movies = data.data || data.result || [];
                movieGrid.innerHTML = '';
                if (movies.length > 0) {
                    renderMovies(movies);
                    loadMoreContainer.style.display = 'none';
                } else {
                    emptyState.style.display = 'block';
                }
            })
            .catch(err => console.error(err));
    }
}

// Open movie modal
function openModal(movieData) {
    const movie = JSON.parse(decodeURIComponent(movieData));
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <img src="${movie.poster || 'https://via.placeholder.com/800x400?text=No+Image'}" 
                 alt="${movie.title}" onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'">
            <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <h2 class="modal-title">${movie.title || 'Unknown'}</h2>
            <div class="modal-meta">
                <span class="rating"><i class="fas fa-star"></i> ${movie.rating || 'N/A'}</span>
                <span><i class="fas fa-film"></i> ${movie.quality || 'HD'}</span>
                <span><i class="fas fa-tags"></i> ${movie.categories || 'Movie'}</span>
            </div>
            <div class="modal-actions">
                <a href="${movie.downloadLink || movie.options?.url || '#'}" target="_blank" class="watch-btn">
                    <i class="fas fa-play"></i> Watch Now
                </a>
            </div>
        </div>
    `;
    
    movieModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    movieModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Set active tag
function setActiveTag(selectedGenre) {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('active');
        const tagText = tag.textContent.toLowerCase();
        if (tagText === selectedGenre || (selectedGenre === 'latest' && tagText === 'all')) {
            tag.classList.add('active');
        }
    });
}

// Update section title
function updateSectionTitle(endpoint) {
    if (endpoint === 'latest') {
        sectionTitle.textContent = 'Film Terbaru';
    } else if (endpoint.startsWith('genre/')) {
        const genre = endpoint.split('/')[1];
        sectionTitle.textContent = `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`;
    } else {
        sectionTitle.textContent = 'Movies';
    }
}

// Show loading
function showLoading(show) {
    if (show) {
        loadingState.style.display = 'block';
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';
    } else {
        loadingState.style.display = 'none';
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Movies';
    }
}

// Show error
function showError() {
    emptyState.style.display = 'block';
    emptyState.querySelector('h3').textContent = 'Failed to load movies';
    emptyState.querySelector('p').textContent = 'Please try again later';
}
