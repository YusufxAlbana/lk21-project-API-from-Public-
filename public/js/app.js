// API Configuration
const API_BASE = '/api/v1';

// State
let movies = [];
let allMovies = [];
let currentPage = 1;
let currentEndpoint = 'latest';
let loading = false;
let activeGenre = 'all';

// DOM Elements
const movieGrid = document.getElementById('movieGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const sectionTitle = document.getElementById('sectionTitle');
const searchInput = document.getElementById('searchInput');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies('latest', 1, true);
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // Check URL for search param
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        searchInput.value = searchQuery;
        filterMovies(searchQuery);
    }
});

// Mobile Menu
function toggleMenu() {
    hamburger?.classList.toggle('active');
    navLinks?.classList.toggle('active');
    navOverlay?.classList.toggle('active');
}

function closeMenu() {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('active');
    navOverlay?.classList.remove('active');
}

// Fetch Movies
async function fetchMovies(endpoint, page = 1, reset = true) {
    if (loading) return;
    loading = true;
    
    if (reset) {
        movieGrid.innerHTML = '<div class="loading-spinner" id="loadingSpinner"><i class="fas fa-spinner fa-spin"></i></div>';
    }
    
    try {
        let url;
        if (endpoint === 'latest') {
            url = `${API_BASE}/latest?page=${page}`;
        } else if (endpoint.startsWith('genre/')) {
            url = `${API_BASE}/${endpoint}?page=${page}`;
        } else {
            url = `${API_BASE}/${endpoint}?page=${page}`;
        }

        console.log('Fetching:', url);
        const response = await fetch(url);
        const data = await response.json();

        let moviesData = data.data || data.result || [];

        if (reset) {
            movies = moviesData;
            allMovies = moviesData;
            currentEndpoint = endpoint;
            currentPage = page;
            sectionTitle.textContent = formatTitle(endpoint);
        } else {
            movies = [...movies, ...moviesData];
            allMovies = [...allMovies, ...moviesData];
            currentPage = page;
        }

        renderMovies(reset);
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        showNoResults();
    } finally {
        loading = false;
    }
}

// Render Movies (same as React MovieCard)
function renderMovies(reset = true) {
    if (reset) {
        movieGrid.innerHTML = '';
    }
    
    if (movies.length === 0) {
        showNoResults();
        return;
    }
    
    noResults.style.display = 'none';
    loadMoreContainer.style.display = 'flex';
    
    const startIndex = reset ? 0 : (currentPage - 1) * 24;
    const moviesToRender = reset ? movies : movies.slice(startIndex);
    
    moviesToRender.forEach((movie, index) => {
        const title = movie.title || movie.Title || movie.options?.name || 'Unknown Title';
        const poster = movie.poster || movie.thumbnail || movie.Poster || 'https://via.placeholder.com/300x450?text=No+Image';
        const rating = movie.rating || movie.imDbRating || 'N/A';
        const quality = movie.quality || movie.Quality || 'HD';
        const url = movie.options?.url || '#';
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.animationDelay = `${Math.min(index * 0.1, 0.7)}s`;
        card.onclick = () => {
            if (url && url !== '#') {
                window.location.href = `/detail.html?url=${encodeURIComponent(url)}`;
            }
        };
        
        card.innerHTML = `
            <div class="poster-wrapper">
                <img src="${poster}" alt="${title}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x450?text=Error'">
            </div>
            <div class="movie-info">
                <h3 class="movie-title" title="${title}">${title}</h3>
                <div class="movie-meta">
                    <span class="quality">${quality}</span>
                    <span class="rating-badge">
                        <i class="fas fa-star"></i> ${rating}
                    </span>
                </div>
            </div>
        `;
        
        movieGrid.appendChild(card);
    });
}

// Filter Movies
function filterMovies(query) {
    if (!query) {
        movies = allMovies;
        sectionTitle.textContent = 'Latest Updates';
        renderMovies(true);
        return;
    }

    const filtered = allMovies.filter(movie => {
        const title = (movie.title || movie.Title || movie.options?.name || '').toLowerCase();
        return title.includes(query.toLowerCase());
    });

    movies = filtered;
    sectionTitle.textContent = `Search Results for "${query}"`;
    renderMovies(true);
    loadMoreContainer.style.display = 'none';
}

// Genre Change Handler
function handleGenreChange(genre) {
    activeGenre = genre;
    setActiveTag(genre);
    
    if (genre === 'all') {
        fetchMovies('latest', 1, true);
    } else {
        fetchMovies(`genre/${genre}`, 1, true);
    }
}

// Load More
function handleLoadMore() {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';
    fetchMovies(currentEndpoint, currentPage + 1, false).finally(() => {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Movies';
    });
}

// Search Handler
function handleSearch(e) {
    e.preventDefault();
    const query = searchInput?.value?.trim();
    if (query) {
        window.location.href = `/films.html?search=${encodeURIComponent(query)}`;
    }
}

// Format Title
function formatTitle(endpoint) {
    if (endpoint === 'latest') return 'Latest Updates';
    if (endpoint.startsWith('genre/')) {
        const genre = endpoint.split('/')[1];
        return `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`;
    }
    return 'Movies';
}

// Set Active Tag
function setActiveTag(genre) {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('active');
        const tagText = tag.textContent.toLowerCase();
        if (tagText === genre || (genre === 'all' && tagText === 'all')) {
            tag.classList.add('active');
        }
    });
}

// Show No Results
function showNoResults() {
    movieGrid.innerHTML = '';
    noResults.style.display = 'block';
    loadMoreContainer.style.display = 'none';
}
